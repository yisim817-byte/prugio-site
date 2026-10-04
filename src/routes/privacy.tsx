import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell, SubHero, pageHead } from "@/components/layout";
import { PROJECT_PHONE_DISPLAY } from "@/data/content";
import { REGISTER_LABEL } from "@/data/labels";

export const Route = createFileRoute("/privacy")({
  head: () => pageHead("개인정보처리방침"),
  component: Page,
});

function Page() {
  return (
    <Shell>
      <SubHero en="PRIVACY" title="개인정보처리방침" crumbs="개인정보처리방침" />
      <article className="ak-wrap ak-page">
        <div className="max-w-3xl space-y-8 text-[15px] leading-7">
        <p>
          이 방침은 「청라 아크원 푸르지오」 안내 페이지의 사전고객등록에만 적용됩니다. 시행사·시공사의 공식 홈페이지가 아니고, 그 홈페이지나 외부 사전고객 폼으로 정보를 보내지 않습니다.
        </p>
        <section>
          <h2 className="ak-h3">처리자</h2>
          <p className="mt-3">개인정보 처리자: HUMANE 운영자.</p>
          <p className="mt-3">
            ㈜청라스마트시티, 대우건설, 나인야드, 넥스미디어, 도담에셋, 애드파워는 이 등록 폼의 처리자도 아니고, 이 폼의 수탁자도 아닙니다.
          </p>
        </section>
        <section>
          <h2 className="ak-h3">항목과 목적</h2>
          <p className="mt-3">성명, 휴대전화, 생년월일 앞 6자리, 주소(시·도, 시·군·구, 동). 주민등록번호 전체와 뒷자리, 신분증은 받지 않습니다.</p>
          <p className="mt-3">목적: 이 사이트로 들어온 사전고객을 구분하고, 등록 사실을 이 사이트 담당자에게 알리기 위해서입니다. 계약, 분양가 안내, 세대 지정은 하지 않습니다.</p>
        </section>
        <section>
          <h2 className="ak-h3">보유</h2>
          <p className="mt-3">운영자가 관리 화면에서 해당 접수를 삭제할 때까지 보유합니다. 자동 파기 일수를 정해 두지 않았습니다. 삭제하면 이 사이트의 저장본에서 지웁니다.</p>
        </section>
        <section>
          <h2 className="ak-h3">알림</h2>
          <p className="mt-3">
            등록 사실을 이 사이트 담당자에게 알릴 수 있습니다. 알림을 보내지 않으면 등록 정보를 제3자에게 제공하지 않습니다. 알림을 보낼 때는 사이트명, 접수번호, 등록시각, 성명, 휴대전화, 관리 화면 주소만 넣습니다. 생년월일과 주소는 넣지 않습니다. 알림을 받는 번호는 신청자가 바꿀 수 없습니다.
          </p>
          <p className="mt-3">알림을 시도했는지와 휴대전화에 도착했는지는 다릅니다. 수신 여부는 이 화면에서 확인하지 않습니다.</p>
        </section>
        <section>
          <h2 className="ak-h3">열람과 삭제</h2>
          <p className="mt-3">등록한 사람의 열람·정정·삭제 요청은 운영자가 관리 화면에서 처리합니다. 다른 신청자의 정보는 보여 주지 않습니다. 공개 상담 창구는 대표번호 {PROJECT_PHONE_DISPLAY}입니다.</p>
        </section>
        <p>
          <Link to="/register" className="ak-link">{REGISTER_LABEL}</Link>
        </p>
        </div>
      </article>
    </Shell>
  );
}
