import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { PGlite } from '@electric-sql/pglite';
import { submitLeadRecord } from '../src/lib/lead-submission.server.ts';
import { pendingMigrations } from './migration-plan.mjs';

const input={mode:'prereg',product:'officetel',name:'검수전용',phone:'010-0000-0001',birth6:'900101',consent:true,age14:true,entry:'/?product=officetel'};
const evidence={backend:'isolated local PGlite (PostgreSQL)',externalNotifications:0,migrations:[],cases:[]};
const migrationDir=new URL('../migrations/',import.meta.url);
const db=new PGlite();
await db.exec('CREATE TABLE _migrations (name TEXT PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT now())');
for(const {name} of pendingMigrations(await readdir(migrationDir),[])){
  const sql=await readFile(new URL(name,migrationDir),'utf8');
  await db.transaction(async tx=>{await tx.exec(sql);await tx.query('INSERT INTO _migrations(name) VALUES($1)',[name]);});
  evidence.migrations.push({name,sha256:createHash('sha256').update(sql).digest('hex')});
}
const sql=async(strings,...values)=>{let query=strings[0];values.forEach((_,i)=>{query+=`$${i+1}${strings[i+1]}`;});return (await db.query(query,values)).rows;};
sql.query=async(text,params=[]) => (await db.query(text,params)).rows;
const alerts=[];
const dependencies={siteId:'prugio-site',dbSource:'neon',env:{vercelEnv:'production',nodeEnv:'production'},getSql:async()=>sql,checkVisit:async()=>null,sendStaffAlert:async payload=>{
  const {rows}=await db.query('SELECT * FROM leads WHERE receipt_no=$1',[payload.receiptNo]);
  assert.equal(rows.length,1,'row must exist before notification boundary');
  assert.equal(rows[0].notify_status,'pending');
  assert.equal(rows[0].birth6,input.birth6);
  alerts.push(payload);
  return {status:'accepted',detail:'LOCAL TEST SPY: no external call'};
}};

test('production persistence pipeline saves all three products and reaches notification boundary',async()=>{
  for(const [i,product] of ['officetel','commercial','apt'].entries()){
    const withAddress=i===1?{sido:'인천광역시',sigungu:'서해구',dong:'청라동'}:{};
    const result=await submitLeadRecord({...input,product,phone:`0100000000${i+1}`,...withAddress},dependencies);
    assert.equal(result.ok,true);assert.equal(result.duplicate,false);assert.equal(result.notifyStatus,'accepted');
    const [row]=await sql.query('SELECT * FROM leads WHERE receipt_no=$1',[result.receiptNo]);
    for(const [key,value] of Object.entries({site_id:'prugio-site',product,name:input.name,birth6:input.birth6,phone:`0100000000${i+1}`,sido:withAddress.sido??'',sigungu:withAddress.sigungu??'',dong:withAddress.dong??''})) assert.equal(row[key],value);
    evidence.cases.push({case:'saved_then_notification_boundary',product,result,row});
  }
  assert.equal(alerts.length,3);
});
test('duplicate preserves receipt and existing identity, updates product, skips notification',async()=>{
  const old=(await sql.query('SELECT * FROM leads WHERE phone=$1',['01000000001']))[0];
  const result=await submitLeadRecord({...input,product:'commercial'},dependencies);
  assert.equal(result.ok,true);assert.equal(result.duplicate,true);assert.equal(result.receiptNo,old.receipt_no);assert.equal(alerts.length,3);
  const current=(await sql.query('SELECT * FROM leads WHERE phone=$1',['01000000001']))[0];
  assert.equal(current.product,'commercial');assert.equal(current.birth6,old.birth6);
  evidence.cases.push({case:'duplicate',result});
});
test('preview blocks before database access and notification even with production store configured',async()=>{
  let touched=0;
  const result=await submitLeadRecord(input,{...dependencies,env:{vercelEnv:'preview',nodeEnv:'production'},getSql:async()=>{touched++;throw Error('live access forbidden');},sendStaffAlert:async()=>{touched++;throw Error('external notification forbidden');}});
  assert.equal(result.ok,false);assert.equal(result.preview,true);assert.equal(touched,0);
  evidence.cases.push({case:'preview_guard',result,databaseAndAlertCalls:touched});
});
test('invalid birth fails before database or notification',async()=>{
  for(const birth6 of ['', '9001019',undefined]) await assert.rejects(submitLeadRecord({...input,birth6},dependencies));
  const count=(await sql.query('SELECT count(*)::int AS n FROM leads'))[0].n;
  assert.equal(count,3);assert.equal(alerts.length,3);
  evidence.cases.push({case:'invalid_birth',rowsAfter:count,alertsAfter:alerts.length});
});
test('notification failure does not erase the successful registration',async()=>{
  const result=await submitLeadRecord({...input,phone:'01000000004'},{...dependencies,sendStaffAlert:async()=>{throw Error('local simulated notification failure');}});
  assert.equal(result.ok,true);assert.equal(result.notifyStatus,'failed');
  const row=(await sql.query('SELECT notify_status FROM leads WHERE receipt_no=$1',[result.receiptNo]))[0];
  assert.equal(row.notify_status,'failed');
  evidence.cases.push({case:'notification_failure_preserves_row',result});
});
test.after(async()=>{
  evidence.notificationBoundaryPayloads=alerts;
  if(process.env.LEAD_TEST_EVIDENCE) await writeFile(process.env.LEAD_TEST_EVIDENCE,JSON.stringify(evidence,null,2));
  await db.close();
});
