import { createFileRoute } from "@tanstack/react-router";
import { Shell, SubHero, pageHead } from "@/components/layout";

export const Route = createFileRoute("/video")({
  head: () => pageHead("홍보영상"),
  component: Page,
});

function Page() {
  return (
    <Shell>
      <SubHero en="MEDIA" title="홍보영상" crumbs="홍보센터 / 홍보영상" />
      <article className="ak-wrap ak-page">
        <p>현재 등록된 홍보영상이 없습니다.</p>
      </article>
    </Shell>
  );
}
