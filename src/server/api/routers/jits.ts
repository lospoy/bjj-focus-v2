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

const JitSchema = z.object({
  id: z.string(),
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
  curriculumId: z.string().optional(),
  isFavorite: z.boolean(),
  isGoal: z.boolean(),
  categoryId: z.string().optional(),
  positionId: z.string().optional(),
  moveId: z.string().optional(),
  notes: z.string().optional(),
});

export const jitsRouter = createTRPCRouter({
  getById: privateProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const jit = await ctx.prisma.jit.findUnique({
        where: {
          id: input.id,
          userId: ctx.userId,
        },
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          metadata: true,
          curriculum: true,
          isFavorite: true,
          isGoal: true,
          notes: true,
          category: { select: { name: true, metadata: true } },
          position: { select: { name: true, metadata: true } },
          move: { select: { name: true, metadata: true } },
        },
      });

      if (!jit) throw new TRPCError({ code: "NOT_FOUND" });

      const sessionCount = await ctx.prisma.session.count({
        where: { jitId: input.id },
      });

      const firstSession = await ctx.prisma.session.findFirst({
        where: { jitId: input.id },
        orderBy: { createdAt: "asc" },
      });

      return { ...jit, sessionCount, firstSession };
    }),

  getAllSessionsByJitId: privateProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const jitSessions = await ctx.prisma.jit.findUnique({
        where: {
          id: input.id,
          userId: ctx.userId,
        },
        select: {
          sessions: true,
        },
      });

      if (!jitSessions) throw new TRPCError({ code: "NOT_FOUND" });

      return jitSessions;
    }),

  getAll: privateProcedure.query(async ({ ctx }) => {
    const jits = await ctx.prisma.jit.findMany({
      where: {
        userId: ctx.userId,
      },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        metadata: true,
        curriculum: true,
        isFavorite: true,
        isGoal: true,
        notes: true,
        category: { select: { name: true, metadata: true } },
        position: { select: { name: true, metadata: true } },
        move: { select: { name: true, metadata: true } },
      },
    });

    if (!jits) throw new TRPCError({ code: "NOT_FOUND" });

    const jitsWithSessionCount = await Promise.all(
      jits.map(async (jit) => {
        const sessionCount = await ctx.prisma.session.count({
          where: { jitId: jit.id },
        });

        return { ...jit, sessionCount };
      }),
    );

    return jitsWithSessionCount;
  }),

  updateByJitId: privateProcedure
    .input(JitSchema)
    .mutation(async ({ ctx, input }) => {
      const { success } = await ratelimit.limit(ctx.userId);

      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

      const updatedJit = await ctx.prisma.jit.update({
        where: {
          id: input.id,
          userId: ctx.userId,
        },
        data: {
          metadata: input.metadata ?? undefined,
          notes: input.notes ?? undefined,
          curriculumId: input.curriculumId ?? undefined,
          isFavorite: input.isFavorite ?? undefined,
          isGoal: input.isGoal ?? undefined,
        },
      });

      if (!updatedJit) throw new TRPCError({ code: "NOT_FOUND" });

      return updatedJit;
    }),

  create: privateProcedure.input(JitSchema).mutation(async ({ ctx, input }) => {
    const { success } = await ratelimit.limit(ctx.userId);

    if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

    const newJit = await ctx.prisma.jit.create({
      data: {
        userId: ctx.userId,
        categoryId: input.categoryId ?? undefined,
        positionId: input.positionId ?? undefined,
        moveId: input.moveId ?? undefined,
        metadata: input.metadata ?? undefined,
        notes: input.notes ?? undefined,
        curriculumId: input.curriculumId ?? undefined,
        isFavorite: input.isFavorite ?? undefined,
        isGoal: input.isGoal ?? undefined,
      },
    });

    return newJit;
  }),
});
