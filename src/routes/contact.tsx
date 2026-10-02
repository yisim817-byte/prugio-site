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
      <article className="mx-auto grid max-w-6xl gap-8 px-4 py-16">
        {PLACES.map((place) => (
          <section key={place.title} className="grid gap-4 border border-line p-4 md:grid-cols-[280px_1fr] md:p-6">
            <Photo src={place.map} alt={`${place.title} 약도`} className="h-48 w-full object-cover" />
            <div>
              <h2 className="font-serif text-2xl">{place.title}</h2>
              <p className="mt-2 leading-7">{place.address}</p>
              <div className="mt-4 flex flex-wrap gap-3 text-sm">
                <a className="underline" href={place.naver} target="_blank" rel="noreferrer">네이버 지도</a>
                <a className="underline" href={place.kakao} target="_blank" rel="noreferrer">카카오 지도</a>
              </div>
            </div>
          </section>
        ))}
        <p className="text-sm leading-6">
          대표번호{" "}
          <a href={PROJECT_PHONE_TEL} className="font-medium text-forest">
            {PROJECT_PHONE_DISPLAY}
          </a>
        </p>
        <p className="text-sm leading-6 text-muted">
          현장·견본주택·홍보관은 주소를 확인하고, 경로는 지도에서 다시 확인해야 합니다.
        </p>
      </article>
      <SourceNote />
    </Shell>
  );
}
