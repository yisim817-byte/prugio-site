import { createFileRoute } from "@tanstack/react-router";
import { Photo, Shell, SourceNote, SubHero, pageHead } from "@/components/layout";
import { PLACES, PROJECT_PHONE_DISPLAY, PROJECT_PHONE_TEL } from "@/data/content";

export const Route = createFileRoute("/contact")({
  head: () => pageHead("오시는 길"),
  component: Page,
});

function Page() {
  return (
    <Shell>
      <SubHero en="CONTACT" title="오시는 길" crumbs="사업안내 / 오시는 길" />
      <article className="ak-wrap ak-page">
        <div className="border-t border-ink">
          <section className="grid gap-5 border-b border-line py-8 md:grid-cols-[280px_minmax(0,1fr)] md:gap-12">
            <Photo
              src={PLACES[0].map}
              alt="청라 아크원 푸르지오 모델하우스 약도"
              className="h-48 w-full object-cover"
            />
            <div>
              <h2 className="ak-h3">모델하우스(견본주택)</h2>
              <p className="mt-2 leading-7">방문 전 대표번호로 예약해 주세요</p>
            </div>
          </section>
        </div>
        <p className="mt-8 leading-7">
          대표번호{" "}
          <a href={PROJECT_PHONE_TEL} className="ak-link ak-num">
            {PROJECT_PHONE_DISPLAY}
          </a>
        </p>
        <p className="ak-note">
          방문 전 대표번호로 예약해 주세요.
        </p>
      </article>
      <SourceNote />
    </Shell>
  );
}
