import { createFileRoute } from "@tanstack/react-router";
import { Nb } from "@/components/chrome";
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
      <article className="ak-wrap ak-page">
        <h2 className="ak-h2">청라의 기다림이 완성되는 곳</h2>
        <p className="ak-lead">푸르지오의 품격을 더하다 · CENTRAL LOCATION PRUGIO</p>
        <Photo
          src={img("/resources/img/sub/location_map_img.v4.jpg")}
          alt="입지 지도"
          className="mt-8 w-full"
        />
        <div className="ak-index mt-12">
          {LOCATION_BLOCKS.map(([title, body]) => (
            <section key={title} className="ak-index__row">
              <div>
                <h3 className="ak-index__t">{title}</h3>
                <p className="ak-index__d">
                  <Nb>{body}</Nb>
                </p>
              </div>
            </section>
          ))}
        </div>
        <ul className="ak-note mt-10 space-y-2">
          {LOCATION_NOTES.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
        <p className="ak-note">
          학교 배정은 교육지원청 문의 사항입니다. 도보 시간·신설 학교는 예정·계획입니다.
        </p>
      </article>
      <SourceNote />
    </Shell>
  );
}
