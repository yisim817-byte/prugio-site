# 작업지시서: 3사이트 영구 DB 연결 + 문자 알림 켜기 + 시험 접수

수신: Claude Cowork (사용자 PC, 크롬 사용). 부록 B는 Claude Code(터미널)용.
작성: 2026-10-03. 배경 기록: 각 저장소 `ARKONE_3SITES_HANDOVER.md` 10~11절.
이 문서에는 비밀값, 직원 휴대전화, DB 접속 문자열이 없다. 작업 중에도 대화·보고·파일에 쓰지 않는다.

## 1. 목표 (끝났다고 말할 수 있는 조건)

세 사이트 모두 아래 4가지를 만족해야 한다.

1. 사이트 전용 Neon DB가 그 Vercel 프로젝트의 **Production에만** `DATABASE_URL`이라는 이름으로 연결됐다.
2. `KAKAO_ALERT_RECIPIENT`, `SOLAPI_API_KEY`, `SOLAPI_API_SECRET`, `SMS_SENDER` 4개가 **Sensitive, Production**으로 등록됐다.
3. 재배포 빌드 로그에 `[migrate] applied 0001_auth.sql`, `0002_staff.sql`, `0003_lead_entry.sql` 세 줄이 있다.
4. 운영 신청 화면에서 시험 접수 1건이 접수번호를 받았고, 그 사이트 지정 직원 휴대전화에 문자가 왔다(직원 확인).

## 2. 대상

| 사이트 | Vercel 프로젝트 | 운영 도메인 | 대표번호(변경 금지) | 지금 운영 배포 |
|---|---|---|---|---|
| A | arkone-cheongna-staff | https://www.아크원푸르지오청라.site | 1666-4250 | dpl_EpTWdHae75G4WoRvLcN6YCQvKUvW |
| B | prugio-cheongna | https://www.푸르지오청라.site | 1666-6799 | dpl_3tXNvgQJYzaH9Kh4UFRU5konBtyq |
| C | prugio-site | https://푸르지오.site | 1533-9014 | dpl_57zNFjdjJrKA8PSnKCpREoipj1WM |

Vercel 팀: `yisim817-6215's projects`. 함수 리전: Washington, D.C., USA (East) – `iad1`.
코드는 이미 운영에 올라가 있다. 지금 신청 화면은 DB가 없어서 "지금은 접수를 저장할 수 없습니다"를 보인다. 이번 작업으로 그걸 푼다.

## 3. 절대 금지

- 직원 휴대전화, SOLAPI 키, DB 접속 문자열을 대화·보고·메모·파일에 다시 적지 않는다. 화면의 비밀값은 **복사 버튼 → 붙여넣기**로만 옮기고, 읽어서 타이핑하지 않는다.
- 한 사이트의 DB나 수신번호를 다른 사이트에 넣지 않는다. A는 A에만, B는 B에만, C는 C에만.
- DB와 변수는 Production에만 넣는다. Preview·Development는 체크 해제.
- 이미 같은 이름의 변수가 있으면 덮어쓰지 말고 멈춰서 보고한다.
- 코드 수정, GitHub 병합, 화면 디자인 변경, 대표번호·`tel:`·이벤트 조건·noindex·도메인 변경 금지.
- 다른 Vercel 프로젝트, 기존 Supabase 프로젝트, 기존 데이터는 건드리지 않는다. 삭제 금지.
- 유료 플랜 선택, 결제, 충전은 사용자에게 금액을 보여 주고 승인을 받은 뒤에만 한다.
- 시험 접수는 사이트당 1건만.

## 4. 사용자가 직접 해야 하는 지점

| 표시 | 내용 | 코워크가 할 말 |
|---|---|---|
| [사람-1] | 각 사이트 수신 휴대전화 3개를 코워크에 알려 줌 | "A·B·C 사이트별 알림 받을 휴대전화를 알려 주세요. 다시 보여 드리지 않습니다." |
| [사람-2] | SOLAPI 가입과 본인인증 | 본인인증 화면에서 멈추고 요청 |
| [사람-3] | SOLAPI 발신번호 등록 인증 | 담당자 휴대폰 인증으로 등록하는 번호가 가장 빠르다. 대표번호(1666·1533)는 서류 심사가 필요해 오래 걸린다 |
| [사람-4] | SOLAPI 충전 금액 승인 | 금액을 보여 주고 승인 대기 |
| [사람-5] | Neon 약관·플랜 확인 | 무료로 3개가 안 되면 멈추고 비용 확인 |
| [사람-6] | 시험 후 직원 문자 수신 확인 | 사이트별로 받았는지 물어본다 |

## 5. 순서 (A를 끝까지 한 번 성공시킨 뒤 B, C 반복)

### 5-1. SOLAPI 준비 (한 번만)

1. 크롬에서 solapi.com 가입·로그인. [사람-2]
2. 발신번호 등록. [사람-3] 등록 완료된 번호(숫자만)가 `SMS_SENDER` 값이 된다.
3. 잔액 충전. [사람-4]
4. 콘솔의 API Key 메뉴에서 새 키를 만든다. API Key와 API Secret이 나온다. Secret은 다시 볼 수 없을 수 있으니, 이 화면은 8단계에서 붙여넣기를 마칠 때까지 탭으로 열어 둔다.

메뉴 이름이 다르면 화면에 보이는 "발신번호", "API Key" 항목을 찾는다. 모르면 멈추고 사용자에게 화면을 보여 준다.

### 5-2. 사이트 DB 만들기 (사이트마다)

1. vercel.com → 팀 `yisim817-6215's projects` → 프로젝트(예: arkone-cheongna-staff) → **Storage** 탭.
2. **Create Database** → Marketplace에서 **Neon** → Continue. [사람-5]
3. 리전: **Washington, D.C., USA (East)** 또는 us-east-1 계열. 플랜: Free(가능하면). 이름: `arkone-cheongna-staff-leads`(B는 `prugio-cheongna-leads`, C는 `prugio-site-leads`).
4. 프로젝트 연결 창에서:
   - 연결 프로젝트: **그 사이트 프로젝트 하나만**.
   - Environments: **Production만** 체크. Preview, Development 해제.
   - 환경변수 접두어(Prefix) 칸이 있으면 **비운다**.
5. 확인: Settings → Environment Variables에서 Production에 `DATABASE_URL`이 **정확히 이 이름**으로 보이면 통과. `XXX_DATABASE_URL`처럼 접두어가 붙었으면 멈추고 보고한다.

### 5-3. 수신번호와 문자 키 등록 (사이트마다)

프로젝트 → Settings → Environment Variables → Add New. 각 항목마다 **Environments는 Production만**, **Sensitive 켬**.

| Key | Value |
|---|---|
| `KAKAO_ALERT_RECIPIENT` | 그 사이트 지정 직원 휴대전화, 숫자 11자리(010…) [사람-1] |
| `SOLAPI_API_KEY` | SOLAPI 탭에서 복사 → 붙여넣기 |
| `SOLAPI_API_SECRET` | SOLAPI 탭에서 복사 → 붙여넣기 |
| `SMS_SENDER` | 등록된 발신번호, 숫자만 |

- `KAKAO_ALIMTALK_*`는 넣지 않는다. 없으면 사이트가 문자로 보낸다.
- 저장 후 목록에서 이름 4개(+ `DATABASE_URL`)가 Production에 있는지 확인한다. 값은 열어 보지 않는다.

### 5-4. 재배포와 DB 적용 확인 (사이트마다)

1. 프로젝트 → **Deployments** → 맨 위 Production 배포(2절의 ID) → 오른쪽 `…` → **Redeploy** → Redeploy.
2. 새 배포가 Ready가 되면 그 배포 → **Build Logs**에서 `migrate`를 검색한다.
   - 통과: `[migrate] applied 0001_auth.sql`, `applied 0002_staff.sql`, `applied 0003_lead_entry.sql`.
   - 실패: `DATABASE_URL not set`이면 5-2로 돌아간다. 다른 오류면 그 줄만 보고한다.
3. 새 배포가 Production이고 운영 도메인이 붙었는지(Domains 표시) 확인한다.

### 5-5. 시험 접수 (사이트당 1건)

1. 운영 도메인의 관심고객등록(`/register`)을 연다.
2. 입력: 성명 `시험접수` / 휴대전화 `01000000000` / 생년월일 `900101` / 인천광역시 / 서구 / 청라동 / 개인정보 동의 체크 → 등록.
3. 통과: 화면에 접수번호(`AC261003-1234` 형식)가 나온다. 같은 내용으로 한 번 더 누르면 같은 접수번호가 나와야 한다(중복 생성 없음).
4. [사람-6] 그 사이트 지정 직원에게 문자가 왔는지 확인한다.
5. 화면에 "지금은 접수를 저장할 수 없습니다"가 나오면 DB가 아직 안 붙은 것이다. 5-2, 5-4를 다시 확인한다.
6. 접수번호는 나왔는데 문자가 안 오면 SOLAPI 발신번호 등록 상태와 잔액을 확인하고 보고한다.

## 6. 되돌리기

사이트가 열리지 않는 등 문제가 생기면, Deployments에서 2절의 이전 운영 배포를 골라 `…` → **Promote**(또는 Instant Rollback)로 되돌린다. 환경변수와 DB는 지우지 않는다.

## 7. 보고 양식 (값 없이, 사이트별)

| 항목 | A | B | C |
|---|---|---|---|
| `DATABASE_URL` (Production) | 있음/없음 | | |
| 빌드 로그 migrate | applied 3줄 / 실패 내용 | | |
| 수신번호·SOLAPI 3종 등록 | 완료/건너뜀(이미 있음)/실패 | | |
| 새 운영 배포 ID | | | |
| 시험 접수번호 | | | |
| 직원 문자 수신 | 받음/못 받음 | | |
| 남은 문제 | | | |

함께 적을 남은 과제: 처리방침에 문자 발송 위탁(SOLAPI) 명시, 관리 화면 로그인이 운영에서 되는지 확인, 카카오 알림톡 전환.

---

## 부록 B. Claude Code(터미널)로 할 때

Vercel CLI에 사용자 계정으로 로그인(`vercel login`)한 뒤 같은 일을 명령으로 한다. 공식 문서 기준 명령:

```bash
npm i -g vercel@latest && vercel login
git clone https://github.com/yisim817-byte/arkone-cheongna-staff.git && cd arkone-cheongna-staff
vercel link --yes --project arkone-cheongna-staff --scope yisim817-6215s-projects
vercel env ls production                                   # 이름만 확인
vercel integration add neon --help                         # 리전 메타데이터 키 확인
vercel integration add neon --name arkone-cheongna-staff-leads --plan free -e production --no-env-pull
printf %s "$VALUE" | vercel env add KAKAO_ALERT_RECIPIENT production --sensitive   # 값은 저장소 밖 비밀 파일에서 읽고 출력 금지
vercel redeploy <현재 운영 배포 URL>
vercel inspect <새 배포 URL> --logs | grep "\[migrate\]"
vercel logs --deployment <새 배포 URL> --level error --since 30m
```

`vercel env pull`과 `.env` 생성은 금지. B·C는 프로젝트 이름만 바꿔 반복한다.
