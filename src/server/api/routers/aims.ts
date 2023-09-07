import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const aimsRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.aim.findMany();
  }),
});
