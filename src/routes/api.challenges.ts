import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/challenges")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { handleCreate } = await import("@/lib/challenge-store.server");
        return handleCreate(request);
      },
    },
  },
});
