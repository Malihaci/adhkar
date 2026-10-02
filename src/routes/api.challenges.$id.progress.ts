import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/challenges/$id/progress")({
  server: {
    handlers: {
      POST: async ({ request, params }) => {
        const { handleProgress } = await import("@/lib/challenge-store.server");
        return handleProgress(request, params.id);
      },
    },
  },
});
