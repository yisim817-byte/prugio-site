# 청라 아크원 푸르지오 3사이트 인수인계

작성: 2026-10-03. 이 문서는 다음 세션이 QA 브랜치에서 남은 작업만 잇기 위한 기록이다.
화면 전체 재검수, 운영 배포, 운영 재시작, 데이터 삭제, 실제 알림 발송은 하지 않는다.
직원 휴대전화번호와 비밀값은 이 문서에 없다. 번호 매핑은 저장소에 넣지 않는 별도 비공개 메모에만 둔다.

## 1. 최초 목적과 현재 상태

세 사이트(직원 배포본을 고객 사이트로 정리)에서 내부 작업 문구를 제거하고, 모바일·PC의 헤더·팝업 오류를 고치는 것이 시작이었다.

- 화면 수정은 QA 브랜치 기준으로 보고상 완료다. main 병합과 운영 배포는 하지 않았다.
- 이어서 영구 DB 미연결과 카카오 알림톡 미설정을 확인했다.
- 현재 우선 과제는 접수 영구 저장 연결이다. 영구 저장 없이 접수 완료를 보여주는 경로를 없애는 코드는 QA에만 있다. 운영 중인 main 배포에는 아직 없다.
- 저장 성공 뒤 알림 예외가 접수 실패로 보이는 분리는 QA 최신 커밋에 들어갔다. 운영 반영 전이다.
- 화면 전체 재검수는 반복하지 않는다.
- 이번 턴에서 수신번호 서버 반영을 시작하기 전에 중단했다. 코드·환경변수 모두 미반영이다.

## 2. 사이트별 식별 정보

공통 QA 브랜치: `qa/mobile-header-fit`
공통 Vercel 팀(이전 세션 기록): `team_gdpDciqMqKDlggM0z5Skpp8M`
이번 턴에서 배포 목록·환경변수·Preview alias는 다시 조회하지 않았다. 아래 운영 배포는 그 이전 확인값이다.

| 항목 | A 아크원푸르지오청라.site | B 푸르지오청라.site | C 푸르지오.site |
|---|---|---|---|
| GitHub | yisim817-byte/arkone-cheongna-staff | yisim817-byte/prugio-cheongna | yisim817-byte/prugio-site |
| Vercel 프로젝트 | arkone-cheongna-staff | prugio-cheongna | prugio-site |
| 프로젝트 ID | prj_0L5VgLNeZviO14d0S2iWCOLSxGVK | prj_R9EQQJnJ2BHfRR7mMO4FZOW0DoMi | prj_V1Trelpd7nvmTmfUcoENAn7aWSWC |
| 상담 대표번호 | 1666-4250 | 1666-6799 | 1533-9014 |
| 이전 보고 QA | d3d0f0c | 40fa1b2 | 00a6aa2 |
| 실제 코드 HEAD | 93820a6 | 784ce17 | c5efa00 |
| 코드 HEAD 의미 | 저장 성공 후 알림 예외여도 접수 성공 유지 | 동일 | 동일 |
| 인수인계 문서 커밋 | 코드 커밋 위. 이 파일만. 첫 커밋 76a9b37. 문장 교정이 더 있으면 그것도 문서만 | 첫 커밋 07f0be8. 이후도 문서만 | 첫 커밋 5ed7d53. 이후도 문서만 |
| 원격 QA | origin/qa/mobile-header-fit 에 푸시함 | 푸시함 | 푸시함 |
| 운영 배포 | dpl_6f3UFMz62pLthxPHFToJgWbkrYzX / 17e25a8 | dpl_4G3aTUQUzkz1Z3wgR8vFqeduhJjD / 798649d | dpl_8GEQqd6Fjs8jVrCXf76Nkvxey9zq / 2cc291b |
| A 복구 기준 | dpl_DcYgy92NNGnoFeYjdbbWdrVyiqTc / 4c23888 | 해당 없음 | 해당 없음 |
| 운영 도메인 | www.아크원푸르지오청라.site | www.푸르지오청라.site | 푸르지오.site |
| Preview URL | 이 기록에 없음. 필요하면 Vercel Preview만 조회 | 동일 | 동일 |

로컬 작업 트리 3곳 모두 인수인계 문서 추가 전에는 깨끗했다. 미커밋 수정은 없다.
main에는 병합하지 않는다. 운영 배포는 승인되지 않았다.

코드상 알림에 넣는 관리 화면 호스트(수신번호 아님):

- A `https://www.xn--oi2b90bg5twzasy72k38fc1ipxj.site`
- B `https://www.xn--oi2b90bo0vusdbte57o.site`
- C `https://xn--2w2b25ugxct7o.site`

## 3. 완료한 수정

같은 작업이 세 저장소에 각각 있다. 커밋은 QA 브랜치에만 있다.

| 내용 | 파일 | A | B | C |
|---|---|---|---|---|
| 360px 헤더, 팝업 포커스 복귀 | `src/components/layout.tsx`, `src/components/event-popup.tsx` | a02ed4c | 744efe2 | 3c5ea74 |
| B canonical 중복 제거 | 744efe2 메시지에 포함. B만 | — | 744efe2 | — |
| 홈 내부 문구(세대 합산 설명) 삭제 | `src/routes/index.tsx` | f2bea54 | 26023d9 | dfa7307 |
| 고객 푸터의 관리자 링크, 프리미엄 내부 설명 삭제 | `src/components/layout.tsx`, `src/components/event-popup.tsx`, `src/data/content.ts` | fadaa7a | 9c63dad | 4899681 |
| 팝업 포커스 유지 | `src/components/event-popup.tsx` | 5bec797 | ba92546 | e6fac86 |
| 영구 저장 없을 때 접수번호·성공 화면 차단, 고객용 meta | `src/lib/leads.functions.ts`, `src/routes/register.tsx`, `src/routes/__root.tsx`, `src/components/layout.tsx`, `src/routes/privacy.tsx` | 8aab7c5 | 65820cf | 0f0df05 |
| 처리방침에 제3자 미제공 문구와 알림에 들어가는 관리 화면 주소 안내 복원 | `src/routes/privacy.tsx` | d3d0f0c | 40fa1b2 | 00a6aa2 |
| 저장 성공 후 알림 예외가 나도 접수 성공 유지 | `src/lib/kakao.server.ts`, `src/lib/leads.functions.ts` | 93820a6 | 784ce17 | c5efa00 |

처리방침: 계정·템플릿 설명은 고객 문구에서 빼는 쪽이 맞다. 그 과정에서 같이 빠졌던 “알림을 보내지 않으면 제3자에게 제공하지 않는다”와 “알림 항목에 관리 화면 주소가 포함된다”만 복원했다. 발송 자격 증명은 넣지 않았다.

상담 대표번호와 `tel:` 링크는 바꾸지 않았다. 검색 설정(noindex 포함)은 유지한다. B의 canonical 중복 제거만 예외다.

## 4. 검증 근거와 한계

- 화면 수정은 로컬에서 봤다. 이전 QA의 로컬 포트는 A 4181, B 4182, C 4183. 이건 운영 Preview가 아니다.
- 실제 Vercel Preview 브라우저 검수와 Preview SSO 로그인은 끝나지 않았다. SSO는 끄지 않는다.
- 운영 DB에 접수가 저장되는지는 확인하지 못했다. 카카오 단말 수신도 확인하지 못했다.
- 기존 접수가 있는지, 보존됐는지, 유실됐는지는 미확인이다. 유실 확정이라고 쓰지 않는다.
- 운영 런타임 로그 보존 구간에 `/register`가 없었다. 그것만으로 접수 0건이라고 판단하지 않는다. 메모리 저장은 재시작 시 로그와 따로 사라질 수 있고, 로그 보관 기간 밖은 모른다.
- 알림 예외 분리 커밋을 만든 세션에서, 운영 고객정보와 실제 알림을 쓰지 않는 격리 환경의 네 가지(저장 성공, 저장 실패, 저장 성공+알림 예외, 같은 번호 재시도)가 통과했다고 기록돼 있다. 이번 턴에서 다시 실행하지 않았다.
- 운영 배포 커밋(17e25a8 / 798649d / 2cc291b)에는 영구 저장 게이트와 알림 예외 분리가 없다.

## 5. 저장·알림 구현

관련 위치(세 저장소 동일 구조):

- `src/lib/db.ts` — `DATABASE_URL`이 비어 있지 않으면 Neon(`dbSource=neon`), 없으면 프로세스 메모리 PGLite(`dbSource=pglite`).
- `src/lib/leads.functions.ts` — `submitLead`. 접수번호는 `AC{YYMMDD}-{4자리}`. 중복은 같은 `site_id` + 전화번호.
- `src/lib/kakao.server.ts` — `staffRecipient`, `sendStaffAlert`, `missingKakaoEnv`.
- `src/routes/register.tsx` — `ok: true`일 때만 접수번호 화면.
- `migrations/` — `0001_auth.sql`, `0002_staff.sql`과 그 이후 SQL. 적용 기록은 파일명 기준.
- `scripts/migrate.mjs` — 마이그레이션 실행 경로로 이전 세션에서 확인. 이번 턴에서 재실행하지 않음.
- `src/routes/admin.tsx` — 로그인 뒤 이 사이트 접수만. 수신번호 변경 폼이 DB `notify_settings`를 바꾼다.

`DATABASE_URL`이 없을 때: PGLite는 그 인스턴스 메모리라 재시작·다른 서버리스 인스턴스에서 남지 않는다.

QA의 차단(8aab7c5 / 65820cf / 0f0df05): `dbSource !== neon` 이고 `VERCEL_ENV=production` 이면 저장하지 않고 오류를 반환한다. 접수번호를 주지 않는다. 이 가드는 운영 배포 커밋에는 없다. 그래서 현재 운영은 DB가 없으면 메모리에 쓴 뒤 접수 완료를 보여줄 수 있다. 이번 턴에서 운영 코드를 다시 열지는 않았고, 이전 세션의 운영 커밋 확인을 유지한다.

알림 예외(93820a6 / 784ce17 / c5efa00): 행을 넣은 뒤 알림이 예외를 내도 접수 실패로 되돌리지 않는다. 접수 결과와 알림 결과를 나눈다. 알림 오류는 서버 로그와 `notify_status`에 남긴다. 영구 저장 자체가 실패하면 성공 화면을 주지 않는 가드는 유지한다. 이 수정은 QA에만 있다.

빌드: 이전 세션에서 `npm run build`를 사용했다. 이번 턴에서 다시 빌드하지 않았다.

## 6. 필요한 외부 설정

사이트마다 자기 영구 DB가 필요하다. 다른 현장 DB나 접속 문자열을 재사용하지 않는다.

운영 `DATABASE_URL` 없음: 이전 세션에서 세 프로젝트 모두 Vercel 환경변수를 decrypt 없이 조회했고, 목록이 비어 있으며 숨겨진 production env 개수도 0이었다. Neon 쪽 연동 생성은 토큰 권한으로 403이었다. 시각은 2026-10-03 작업 중이며, 이번 턴에서 다시 조회하지 않았다.

사용자가 할 일:

1. 사이트별 Postgres를 따로 만든다. 요금·저장 한도·접속 한도는 만드는 화면에서 확인한다. 여기서 요금을 다시 조사하지 않았다.
2. 각 Vercel 프로젝트 → Settings → Environment Variables 에만 `DATABASE_URL`을 넣는다. Sensitive. Production에 넣는다. Preview에 넣을 거면 운영 DB와 다른 접속 문자열을 쓴다.
3. 값을 채팅, git, 이 문서에 붙여 넣지 않는다.
4. 연결 뒤에만 `migrations/`를 그 DB에 적용한다. 적용 전 운영 배포로 접수를 열지 않는다.
5. 기존 접수 보존 근거가 생기면 그 데이터를 지우거나 다른 DB로 덮지 않는다. 근거가 없으면 유실 확정으로 말하지 않는다.

카카오 공식 연동은 없다. 채널·발신 프로필·승인 템플릿·발송 API 자격은 확보되지 않았다. 아래는 이름과 용도만 적는다.

| 이름 | 용도 | 상태 |
|---|---|---|
| `DATABASE_URL` | 사이트별 영구 Postgres. 있으면 neon, 없으면 pglite | 운영·QA 모두 미설정으로 확인(이전 세션) |
| `KAKAO_ALIMTALK_ENDPOINT` | 알림톡 발송 API 주소 | 없음. 없으면 발송하지 않음 |
| `KAKAO_ALIMTALK_AUTHORIZATION` | 발송 API 인증 | 없음 |
| `KAKAO_TEMPLATE_CODE` | 승인된 템플릿 코드 | 없음 |
| `KAKAO_ALERT_RECIPIENT` | 그 사이트 알림 수신 휴대전화. 서버 전용. 코드에 넣지 않음 | 아직 만들지 않음. 7절 |
| `VERCEL_ENV` | production일 때만 영구 저장 가드 | 플랫폼이 설정 |

세 값이 모두 있기 전에는 발송하지 않는다. 수신번호만 넣는 것을 연동 완료로 보지 않는다.

## 7. 수신번호

사용자가 사이트별 카카오 수신 휴대전화를 지정했다. 홈페이지 상담 대표번호와 다르다. 대표번호와 `tel:`은 유지한다.

서버 반영은 하지 않았다. Vercel 환경변수로 넣지 않았고, 코드도 그 매핑으로 바꾸지 않았다. 커밋하지 않은 변경도 없다.

현재 발송 경로:

- A는 `notify_settings`의 이 사이트 번호를 읽고, 없거나 짧으면 소스에 적힌 기본 번호로 보낸다. 기본 번호와 시드 INSERT는 이미 QA 히스토리(`src/lib/kakao.server.ts`, `migrations/0002_staff.sql`)에 있다. 히스토리 재작성은 하지 않았다.
- B·C는 DB에 이 사이트 번호가 있을 때만 보내고, 하드코드 대체 번호는 없다. 없으면 `not_configured`.
- 관리 화면의 수신번호 저장은 DB를 바꾼다. A에서는 그 값이 기본 번호보다 우선한다. 지정 번호만 쓰게 하려면 이 경로를 막아야 한다.
- 고객 신청 화면에는 직원 번호가 없다. 대표번호만 있다.
- 세 알림 본문의 관리 URL은 각 사이트 호스트다. B·C가 A 관리 URL을 넣지는 않는다.

다음 세션이 할 일(배포·실발송 아님): 사이트별 Sensitive 환경변수로만 수신번호를 두고, 소스·마이그레이션·프론트의 번호와 다른 번호로 떨어지는 fallback을 제거한다. 번호는 커밋하지 않는다. 공식 발송 계정·템플릿·영구 DB·처리방침이 되기 전에는 발송을 켜지 않는다. 실발송 시험은 별도 지시 전 금지.

비공개 매핑 메모는 저장소 밖 `/workspace/ARKONE_3SITES_HANDOVER_PRIVATE.md` 뿐이다. QA 브랜치에 올리지 않는다.

## 8. 다음 작업 순서

1. 기존 접수 보존 근거를 읽기 전용으로 확인하고, 보존 가능한 데이터가 있으면 보호한다. 고객정보를 채팅에 출력하지 않는다.
2. 사이트별 승인 영구 DB를 만들고 `DATABASE_URL`만 연결한다. 다른 사이트 값을 재사용하지 않는다.
3. 알림 예외 분리는 QA HEAD에 있다. 코드가 그대로면 다시 고치지 않는다. 저장 실패 시 성공 화면을 막는 가드도 유지한다.
4. DB 연결이나 수신 경로를 바꾼 뒤에만, 격리 환경에서 저장 성공·저장 실패·저장 성공+알림 예외·동일 번호 재시도를 확인한다. 운영 고객정보와 실제 알림을 쓰지 않는다. 이미 한 격리 테스트를 화면 검수처럼 반복하지 않는다.
5. 운영 배포 준비 결과만 제출한다. 수신번호 지정만으로 카카오 연결 완료라고 하지 않는다.
6. 사용자가 배포를 지시한 뒤에만 main 병합과 운영 반영을 한다.

카카오 활성화는 공식 연동, 서버 수신자, 개인정보 처리 요건이 된 뒤 별도 지시로 한다.

## 9. 유지할 제약

- 다른 현장·다른 도메인으로 바꾸지 않는다.
- 상담 대표번호, `tel:` 링크, 이벤트 조건을 바꾸지 않는다.
- noindex 등 현재 검색 설정을 유지한다. 색인을 열지 않는다.
- 기존 고객정보, 접속 문자열, 인증값, 직원 휴대전화를 채팅·공개 문서·저장소에 쓰지 않는다.
- 운영 테스트 접수와 실제 알림 발송은 별도 지시 전 금지.
- 전체 화면 검수를 반복하지 않는다.
- 현재 정상 운영 배포를 복구 기준으로 남긴다. 2절의 배포 ID.
- 운영 배포는 아직 승인되지 않았다.

## 10. 후속 기록: 수신 경로 서버 고정 (2026-10-03)

코드 커밋(QA 브랜치): A 757715e, B 5fba776, C 7175265. 세 사이트 같은 내용이다. 7절의 "현재 발송 경로"는 이 커밋으로 대체된다.

- 수신자는 그 Vercel 프로젝트의 서버 환경변수 `KAKAO_ALERT_RECIPIENT` 하나다. 010으로 시작하는 11자리만 쓴다. 하이픈은 허용한다.
- 값이 없거나 형식이 틀리면 발송하지 않고 `not_configured`로 남긴다. DB·소스·다른 사이트 번호로 대체하지 않는다.
- A 소스의 기본 번호 상수를 지웠다. 세 저장소 `0002_staff.sql`의 `notify_settings` 시드 행도 지웠다. 히스토리는 재작성하지 않았다. 적용 기록이 파일명 기준이라, 이미 적용된 DB가 있어도 깨지지 않는다. 그 행은 더 이상 읽지 않는다.
- 관리 화면의 수신번호 저장 폼과 `updateNotifyPhone` 서버 함수를 지웠다. 관리 화면은 환경변수 설정 여부(설정됨/미설정)만 보인다. CSV는 유지했다. `notify_settings`, `notify_recipient_log` 테이블과 행은 지우지 않았다.
- 접수 저장, 운영 영구 저장 가드, 알림 예외 분리는 바꾸지 않았다.

검증(격리 환경, 더미 번호, 메모리 PGlite와 로컬 가짜 발송 API. 운영 고객정보와 실발송 없음): 세 저장소 각 26/26 통과.

| 항목 | 결과 |
|---|---|
| 저장 성공 | 접수번호 발급, 알림은 env 수신자로만 |
| 저장 실패 | 접수번호 없음, 행·알림 없음 |
| 저장 성공 + 알림 예외(함수 예외, 네트워크 예외) | 접수 성공 유지, 알림 failed |
| 같은 번호 재시도 | 같은 접수번호, 추가 행·알림 없음 |
| 수신 env 없음·형식 오류 | not_configured, 다른 번호로 발송 없음 |
| DB에 다른 번호가 있을 때 | env 번호로만 발송 |
| 관리 화면 재시도 | env 번호로만, accepted 재발송 없음 |
| 운영 + 영구 DB 없음 | 접수번호 미발급 유지 |

대조: 수정 전 코드(A QA 9d23879)에 같은 검사를 돌리면 11건이 실패했다(DB 번호로 발송 등). 핵심 4항목은 수정 전후 모두 통과다.
`npm run typecheck`, `npm run build`(DATABASE_URL 없이) 세 저장소 통과. `npm test`의 17건 실패는 수정 전에도 같은 템플릿·브랜딩 테스트다.

Vercel 권한(이 세션 토큰): 환경변수 목록 조회 403, Production 환경변수 생성 403. 그래서 `KAKAO_ALERT_RECIPIENT`와 `DATABASE_URL`을 서버에 넣지 못했다. 사용자가 대시보드에서 넣는다. 값은 이 문서·git·채팅에 쓰지 않는다.

기존 접수 보존(읽기 전용 확인):

- 세 운영 프로젝트 런타임 로그 보관 구간은 약 1시간이었다. 그 안에 서버 함수(`/_serverFn/`) 요청은 없었다.
- 운영 커밋(17e25a8 / 798649d / 2cc291b)의 접수 코드는 로그를 남기지 않고 메모리 PGlite에만 쓴다.
- 보존 근거는 찾지 못했다. 유실 확정도 아니다. 남아 있다면 살아 있는 운영 인스턴스 메모리뿐이고, 새 운영 배포나 재시작이 그 인스턴스를 끝낸다.
- 운영 관리 화면 로그인으로 꺼내 보는 일은 운영 메모리 DB 쓰기(첫 로그인 owner 등록)가 생기므로 하지 않았다.

새로 확인한 운영 위험(코드 미변경, 확인 필요):

- 관리 화면 로그인은 Grok 인증 중개(OAuth) 방식이다. Vercel에 `GROK_AUTH_CLIENT_ID`, `GROK_AUTH_CLIENT_SECRET`, `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`이 없으면 운영 도메인에서 로그인이 되지 않을 수 있다. DB 연결 뒤 접수는 저장되지만 관리 화면으로 못 볼 수 있다. 그때는 DB 콘솔에서 읽는다.
- `bootstrapOwner`는 그 사이트 DB에서 처음 로그인한 계정을 owner로 만든다. DB 연결 직후 담당자가 먼저 로그인해 owner를 잡아야 한다.

## 새 세션 시작용 지시문

청라 아크원 3사이트 인수인계는 `ARKONE_3SITES_HANDOVER.md`다. QA 브랜치 `qa/mobile-header-fit`의 코드 커밋은 A 757715e, B 5fba776, C 7175265이다. 그 위는 이 문서만 있는 커밋이다. main 병합과 운영 배포는 하지 마라. 화면 재검수, 운영 접수, 실제 알림 발송, 비밀값 출력은 하지 마라. 남은 일은 사이트별 영구 DB 연결과 `KAKAO_ALERT_RECIPIENT` Sensitive 등록(사용자 조작)이다. 알림 예외 분리와 env 전용 수신 경로는 코드 커밋에 있다. 10절을 먼저 읽어라. 번호는 비공개 메모에만 있고 저장소에 넣지 마라. 대표번호와 검색 설정은 유지하라. 복구 기준은 A dpl_6f3UFMz62pLthxPHFToJgWbkrYzX, B dpl_4G3aTUQUzkz1Z3wgR8vFqeduhJjD, C dpl_8GEQqd6Fjs8jVrCXf76Nkvxey9zq다.
