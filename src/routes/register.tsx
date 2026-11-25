import { createFileRoute, redirect } from "@tanstack/react-router";
import { pageHead } from "@/components/layout";
import { RegisterPage } from "@/components/landing-redesign";
export const Route = createFileRoute("/register")({
  beforeLoad: () => { throw redirect({ to: "/visit", replace: true }); },
  head: () => pageHead("사전고객등록", "/register"),
  component: RegisterPage,
});
