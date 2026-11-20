import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/components/layout";
import { LandingPage } from "@/components/landing-redesign";
export const Route = createFileRoute("/")({ head: () => pageHead("청라 아크원 푸르지오", "/"), component: LandingPage });
