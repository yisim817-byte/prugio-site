import { createFileRoute } from "@tanstack/react-router";
import { Nb } from "@/components/chrome";
import { Photo, Shell, SourceNote, SubHero, pageHead, PageFaq, QuickAnswer } from "@/components/layout";
import { OVERVIEW_ROWS, img } from "@/data/content";

export const Route = createFileRoute("/overview")({
  head: () => pageHead("사업개요", "/overview"),
  component: Page,
});

function Page() {
  return (
    <Shell>
      <SubHero en="OVERVIEW" title="사업개요" crumbs="사업안내 / 사업개요" />
      <QuickAnswer path="/overview" />
      <PageFaq path="/overview" />
      <article className="ak-wrap ak-page grid gap-10 md:grid-cols-[minmax(0,1fr)_280px] md:gap-16">
        <div>
          <h2 className="ak-h2">사업 규모와 구성</h2>
          <p className="ak-lead">청라에 다시없을 완벽한 주거중심</p>
          <dl className="ak-kv mt-10">
            {OVERVIEW_ROWS.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>
                  <Nb>{v}</Nb>
                </dd>
              </div>
            ))}
          </dl>
          <p className="ak-note">하자 사항은 공동주택관리법 등 관련 법령을 따릅니다.</p>
        </div>
        <Photo
          src={img("/resources/img/sub/overview_apt_img.v4.jpg")}
          alt="단지 이미지"
          className="w-full object-cover"
        />
      </article>
      <SourceNote />
    </Shell>
  );
}
