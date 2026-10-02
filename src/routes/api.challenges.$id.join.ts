import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/challenges/$id/join")({
  server: {
    handlers: {
      POST: async ({ request, params }) => {
        const { handleJoin } = await import("@/lib/challenge-store.server");
        return handleJoin(request, params.id);
      },
    },
  },
});
