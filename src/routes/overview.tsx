import { createFileRoute } from "@tanstack/react-router";
import { Photo, Shell, SourceNote, SubHero, pageHead, QuickAnswer } from "@/components/layout";
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
      <article className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-[1fr_280px]">
        <div>
          <p className="font-serif text-3xl leading-snug">압도적인 스케일, 독보적인 프리미엄</p>
          <p className="mt-3 text-muted">청라에 다시없을 완벽한 주거중심</p>
          <dl className="mt-10 divide-y divide-line border-y border-line">
            {OVERVIEW_ROWS.map(([k, v]) => (
              <div key={k} className="grid gap-1 py-4 md:grid-cols-[140px_1fr]">
                <dt className="text-sm text-muted">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-sm leading-6 text-muted">
            하자 사항은 공동주택관리법 등 관련 법령을 따릅니다.
          </p>
        </div>
        <Photo src={img("/resources/img/sub/overview_apt_img.v4.jpg")} alt="단지 이미지" className="w-full object-cover" />
      </article>
      <SourceNote />
    </Shell>
  );
}
