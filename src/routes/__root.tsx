import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import appCss from "../styles.css?url";
import { SEO_ORIGIN } from "@/data/seo";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "청라 아크원 푸르지오" },
      { name: "robots", content: "noindex, nofollow" },
      { name: "theme-color", content: "#1c3a32" },
      { name: "google-site-verification", content: "NvrPz-qoa4YWNDb033ep9P5Bz5c6MN_L2D9MIWzqcxg" },
      { name: "naver-site-verification", content: "cb3bb5704a089865ac157fc0f014c243fdc70c81" },
    ],
    links: [
      { rel: "icon", type: "image/png", sizes: "144x144", href: "/g-icon-144.png?v=20261009" },
      { rel: "shortcut icon", href: "/g-icon-144.png?v=20261009" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/g-icon-180.png" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "preconnect", href: "https://cdn.jsdelivr.net", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Hahmlet:wght@300;400;500&family=Aboreto&display=swap",
      },
      {
        rel: "stylesheet",
        href: "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css",
      },
      {
        rel: "stylesheet",
        href: "https://cdn.jsdelivr.net/gh/sun-typeface/SUIT@2.0.5/fonts/static/woff2/SUIT.css",
        integrity: "sha384-mMsv9ePXdDSZ5/ow3/9MfU9yh0kB3kl9FhTuYEPbeOmoJWs1mpXtQ2AlPvHVDLqs",
        crossOrigin: "anonymous",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "청라 아크원 푸르지오",
          url: SEO_ORIGIN,
          telephone: "+82-1533-9014",
        }),
      },
    ],
  }),
  component: () => (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <AuthProvider>
          <Outlet />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  ),
});
