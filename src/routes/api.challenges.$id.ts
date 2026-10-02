import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/challenges/$id")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const { handleGet } = await import("@/lib/challenge-store.server");
        return handleGet(request, params.id);
      },
    },
  },
});
