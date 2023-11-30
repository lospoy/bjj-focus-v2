import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(20, "1 m"),
  analytics: true,
});

// UserId always taken from context, so not needed here
const ActiveJitSchema = z.object({
  jitId: z.string(),
  level: z.optional(z.number()),
  hitRolling: z.optional(
    z.number().refine((value) => value === undefined || value >= 0, {
      message: "hitRolling must be a non-negative number",
    }),
  ),
  hitCompeting: z.optional(z.number()),
  notes: z.optional(z.string()),
});

export const activeJitsRouter = createTRPCRouter({
  getByJitId: privateProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const activeJit = await ctx.prisma.activeJit.findUnique({
        where: { userId_jitId: { userId: ctx.userId, jitId: input.id } },
      });

      if (!activeJit) throw new TRPCError({ code: "NOT_FOUND" });

      return activeJit;
    }),

  getAllKnownByThisUser: privateProcedure.query(async ({ ctx }) => {
    const activeJits = await ctx.prisma.activeJit.findMany({
      where: { userId: ctx.userId },
      take: 200,
      orderBy: [{ activatedOn: "desc" }], //descending, newest first
    });

    return activeJits;
  }),

  updateByJitId: privateProcedure
    .input(ActiveJitSchema)
    .mutation(async ({ ctx, input }) => {
      const currentUser = ctx.userId;
      const { success } = await ratelimit.limit(currentUser);

      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

      const activeJit = await ctx.prisma.activeJit.update({
        where: { userId_jitId: { userId: currentUser, jitId: input.jitId } },
        data: {
          userId: currentUser,
          jitId: input.jitId,
          level: input.level ?? undefined, // optional field
          hitRolling: input.hitRolling ?? undefined, // optional field
          hitCompeting: input.hitCompeting ?? undefined, // optional field
          notes: input.notes ?? undefined, // optional field
        },
      });

      if (!activeJit) throw new TRPCError({ code: "NOT_FOUND" });

      return activeJit;
    }),

  create: privateProcedure
    .input(z.object({ jitId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const currentUser = ctx.userId;
      const { success } = await ratelimit.limit(currentUser);

      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

      const activeJit = await ctx.prisma.activeJit.create({
        data: {
          userId: currentUser,
          jitId: input.jitId,
        },
      });

      return activeJit;
    }),
});
