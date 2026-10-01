import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/br-quiz")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
});
