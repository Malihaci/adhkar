import { createFileRoute } from "@tanstack/react-router";

/** /api/push/{key|sync|pending|snooze|test|tick} — voir src/lib/push-store.server.ts */
export const Route = createFileRoute("/api/push/$action")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const s = await import("@/lib/push-store.server");
        if (params.action === "key") return s.handleKey();
        if (params.action === "tick") return s.handleTick(request);
        return new Response("Not found", { status: 404 });
      },
      POST: async ({ request, params }) => {
        const s = await import("@/lib/push-store.server");
        switch (params.action) {
          case "sync":
            return s.handleSync(request);
          case "pending":
            return s.handlePending(request);
          case "snooze":
            return s.handleSnooze(request);
          case "test":
            return s.handleTest(request);
          case "tick":
            return s.handleTick(request);
          default:
            return new Response("Not found", { status: 404 });
        }
      },
    },
  },
});
