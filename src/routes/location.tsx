import { createFileRoute } from "@tanstack/react-router";
import { Photo, Shell, SourceNote, SubHero, pageHead } from "@/components/layout";
import { LOCATION_BLOCKS, LOCATION_NOTES, img } from "@/data/content";

export const Route = createFileRoute("/location")({
  head: () => pageHead("입지환경"),
  component: Page,
});

function Page() {
  return (
    <Shell>
      <SubHero en="LOCATION" title="입지환경" crumbs="입지안내 / 입지환경" />
      <article className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-serif text-3xl">청라의 기다림이 완성되는 곳</h2>
        <p className="mt-3 text-muted">푸르지오의 품격을 더하다 · CENTRAL LOCATION PRUGIO</p>
        <Photo
          src={img("/resources/img/sub/location_map_img.v4.jpg")}
          alt="입지 지도"
          className="mt-8 w-full"
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {LOCATION_BLOCKS.map(([title, body]) => (
            <section key={title} className="border-t border-ink pt-4">
              <h3 className="font-serif text-xl">{title}</h3>
              <p className="mt-2 leading-7 text-muted">{body}</p>
            </section>
          ))}
        </div>
        <ul className="mt-10 space-y-2 text-sm leading-6 text-muted">
          {LOCATION_NOTES.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
        <p className="mt-6 text-sm leading-6 text-muted">
          학교 배정은 교육지원청 문의 사항입니다. 도보 시간·신설 학교는 예정·계획입니다.
        </p>
      </article>
      <SourceNote />
    </Shell>
  );
}
