import { TRPCError } from "@trpc/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(20, "1 m"),
  analytics: true,
});

const SessionSchema = z.object({
  metadata: z
    .record(
      z.union([
        z.string(),
        z.number(),
        z.boolean(),
        z.null(),
        z.array(z.any()),
        z.record(z.any()),
      ]),
    )
    .optional(),
  jitId: z.string(),
  notes: z.string().optional(),
});

export const sessionsRouter = createTRPCRouter({
  getById: privateProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const session = await ctx.prisma.session.findUnique({
        where: {
          id: input.id,
        },
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          metadata: true,
          jitId: true,
        },
      });

      if (!session) throw new TRPCError({ code: "NOT_FOUND" });

      return session;
    }),

  getSessionsByJitId: privateProcedure
    .input(z.object({ jitId: z.string() }))
    .query(async ({ ctx, input }) => {
      const sessionsByJitId = await ctx.prisma.session.findMany({
        where: {
          jitId: input.jitId,
        },
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          metadata: true,
          jitId: true,
        },
      });

      if (!sessionsByJitId) throw new TRPCError({ code: "NOT_FOUND" });

      return sessionsByJitId;
    }),

  create: privateProcedure
    .input(SessionSchema)
    .mutation(async ({ ctx, input }) => {
      const { success } = await ratelimit.limit(ctx.userId);

      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

      const newSession = await ctx.prisma.session.create({
        data: {
          metadata: input.metadata ?? { set: null },
          jitId: input.jitId,
        },
      });

      return newSession;
    }),
});
