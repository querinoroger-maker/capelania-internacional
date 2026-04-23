import { createRouter, publicQuery } from "./middleware";
import { studentRouter } from "./routers/student";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  student: studentRouter,
});

export type AppRouter = typeof appRouter;
