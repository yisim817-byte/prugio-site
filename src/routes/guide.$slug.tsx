import { createFileRoute, notFound } from "@tanstack/react-router";
import { Shell, guideHead } from "@/components/layout";
import { GuideBody } from "@/components/r2";
import { GUIDES } from "@/data/r2";

export const Route = createFileRoute("/guide/$slug")({
  loader: ({ params }) => {
    if (!GUIDES[params.slug]) throw notFound();
    return null;
  },
  head: ({ params }) => guideHead(params.slug),
  component: Page,
});

function Page() {
  const { slug } = Route.useParams();
  return (
    <Shell>
      <GuideBody slug={slug} />
    </Shell>
  );
}
