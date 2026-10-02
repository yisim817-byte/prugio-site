import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Shell, SubHero, pageHead } from "@/components/layout";

export const Route = createFileRoute("/video")({
  head: () => pageHead("홍보영상"),
  component: Page,
});

const YT = "_wAuOJSTLek";

function Page() {
  const [play, setPlay] = useState(false);
  return (
    <Shell>
      <SubHero en="MEDIA" title="홍보영상" crumbs="홍보센터 / 홍보영상" />
      <article className="mx-auto max-w-4xl px-4 py-12">
        <div className="aspect-video bg-ink">
          {play ? (
            <iframe
              className="h-full w-full"
              src={`https://www.youtube-nocookie.com/embed/${YT}?autoplay=1&rel=0&playsinline=1`}
              title="청라 아크원 홍보영상"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <button type="button" className="relative h-full w-full" onClick={() => setPlay(true)}>
              <img
                src={`https://img.youtube.com/vi/${YT}/maxresdefault.jpg`}
                alt="영상 썸네일"
                className="h-full w-full object-cover"
              />
              <span className="absolute inset-0 grid place-items-center bg-ink/30 text-sm text-paper">재생</span>
            </button>
          )}
        </div>
      </article>
    </Shell>
  );
}
