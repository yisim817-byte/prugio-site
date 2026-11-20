import test from 'node:test';
import assert from 'node:assert/strict';
import { leadSchema } from '../src/lib/lead-input.ts';
const minimal = {mode:'prereg',product:'officetel',name:'검수전용',phone:'01000000001',birth6:'900101',consent:true,age14:true};
test('new registration requires product and birth, with optional collapsed address',()=>{
  const parsed=leadSchema.parse(minimal);
  assert.equal(parsed.product,'officetel');
  assert.equal(parsed.birth6,'900101');
  for(const key of ['sido','sigungu','dong']) assert.equal(parsed[key],'');
  assert.equal(leadSchema.parse({...minimal,sido:'인천광역시',sigungu:'서해구',dong:'청라동'}).dong,'청라동');
});
test('missing, malformed or overlong birth digits are refused',()=>{
  for(const birth6 of [undefined,'','90010','9001011','9001A1','901301']) assert.equal(leadSchema.safeParse({...minimal,birth6}).success,false);
});
test('legacy full form retains address requirements',()=>{
  assert.equal(leadSchema.safeParse({...minimal,mode:'full'}).success,false);
  assert.equal(leadSchema.safeParse({...minimal,mode:'full',sido:'인천광역시',sigungu:'서해구',dong:'청라동'}).success,true);
});
test('required consent, age confirmation and product cannot be bypassed',()=>{
  for(const variant of [{consent:false},{age14:undefined},{age14:false},{product:undefined},{product:null},{product:'unexpected'},{name:'가'.repeat(21)}]) assert.equal(leadSchema.safeParse({...minimal,...variant}).success,false);
});
