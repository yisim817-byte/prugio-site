import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell, SubHero, pageHead } from "@/components/layout";
import { PROJECT_PHONE_DISPLAY } from "@/data/content";

export const Route = createFileRoute("/privacy")({
  head: () => pageHead("개인정보처리방침"),
  component: Page,
});

function Page() {
  return (
    <Shell>
      <SubHero en="PRIVACY" title="개인정보처리방침" crumbs="개인정보처리방침" />
      <article className="mx-auto max-w-3xl space-y-8 px-4 py-12 text-sm leading-7">
        <p>
          이 방침은 「청라 아크원 푸르지오」 안내 페이지의 관심고객등록에만 적용됩니다. 시행사·시공사의 공식 홈페이지가 아니고, 그 홈페이지나 외부 관심고객 폼으로 정보를 보내지 않습니다.
        </p>
        <section>
          <h2 className="font-serif text-2xl">처리자</h2>
          <p className="mt-3">개인정보 처리자: HUMANE 운영자.</p>
          <p className="mt-3">
            ㈜청라스마트시티, 대우건설, 나인야드, 넥스미디어, 도담에셋, 애드파워는 이 등록 폼의 처리자도 아니고, 이 폼의 수탁자도 아닙니다.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-2xl">항목과 목적</h2>
          <p className="mt-3">성명, 휴대전화, 생년월일 앞 6자리, 주소(시·도, 시·군·구, 동). 주민등록번호 전체와 뒷자리, 신분증은 받지 않습니다.</p>
          <p className="mt-3">목적: 이 사이트로 들어온 관심고객을 구분하고, 등록 사실을 이 사이트 담당자에게 알리기 위해서입니다. 계약, 분양가 안내, 세대 지정은 하지 않습니다.</p>
        </section>
        <section>
          <h2 className="font-serif text-2xl">보유</h2>
          <p className="mt-3">운영자가 관리 화면에서 해당 접수를 삭제할 때까지 보유합니다. 자동 파기 일수를 정해 두지 않았습니다. 삭제하면 이 사이트의 저장본에서 지웁니다.</p>
        </section>
        <section>
          <h2 className="font-serif text-2xl">알림</h2>
          <p className="mt-3">
            카카오 알림톡 발송 계정, 승인된 템플릿, 서버 비밀값이 연결된 뒤에만 알림을 시도합니다. 알림에는 사이트명, 접수번호, 등록시각, 성명, 휴대전화, 관리자 상세 주소만 넣습니다. 생년월일과 주소는 넣지 않습니다. 수신번호는 서버에만 있고, 신청자가 바꿀 수 없습니다.
          </p>
          <p className="mt-3">지금은 그 계정과 템플릿이 연결되어 있지 않습니다. 연결 전에는 제3자에게 등록 정보가 나가지 않습니다. API가 접수를 받았다는 기록과 휴대전화에 도착했다는 확인은 다릅니다.</p>
        </section>
        <section>
          <h2 className="font-serif text-2xl">열람과 삭제</h2>
          <p className="mt-3">등록한 사람의 열람·정정·삭제 요청은 운영자가 관리 화면에서 처리합니다. 다른 신청자의 정보는 보여 주지 않습니다. 공개 상담 창구는 대표번호 {PROJECT_PHONE_DISPLAY}입니다.</p>
        </section>
        <p>
          <Link to="/register" className="underline">관심고객등록</Link>
        </p>
      </article>
    </Shell>
  );
}
