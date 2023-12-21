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

const JitSchema = z.object({,
  curriculumId: z.string().nullable(),
  isFavorite: z.boolean(),
  isGoal: z.boolean(),
  categoryId: z.string().nullable(),
  positionId: z.string().nullable(),
  moveId: z.string().nullable(),
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
          category: {
            select: { name: true, metadata: true },
          },
          position: { select: { name: true, metadata: true } },
          move: { select: { name: true, metadata: true } },
          notes: {
            select: {
              id: true,
              createdAt: true,
              updatedAt: true,
              metadata: true,
              body: true,
              isFavorite: true,
            },
          },
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

      const lastSession = await ctx.prisma.session.findFirst({
        where: { jitId: input.id },
        orderBy: { createdAt: "desc" },
      });

      return { ...jit, sessionCount, firstSession, lastSession };
    }),

  getAllSessionsById: privateProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const jitSessions = await ctx.prisma.jit.findMany({
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
        category: {
          select: { name: true, metadata: true },
        },
        position: { select: { name: true, metadata: true } },
        move: { select: { name: true, metadata: true } },
        notes: {
          select: {
            id: true,
            createdAt: true,
            updatedAt: true,
            metadata: true,
            body: true,
            isFavorite: true,
            jitId: true,
          },
        },
      },
    });

    if (!jits) throw new TRPCError({ code: "NOT_FOUND" });

    const jitsWithSessionCountAndLastSession = await Promise.all(
      jits.map(async (jit) => {
        const sessionCount = await ctx.prisma.session.count({
          where: { jitId: jit.id },
        });
        const lastSession = await ctx.prisma.session.findFirst({
          where: { jitId: jit.id },
          orderBy: { updatedAt: "desc" },
        });

        return { ...jit, sessionCount, lastSession };
      }),
    );

    return jitsWithSessionCountAndLastSession;
  }),

  updateById: privateProcedure
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
          curriculumId: input.curriculumId ?? null,
          isFavorite: input.isFavorite ?? false,
          isGoal: input.isGoal ?? false,
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
        categoryId: input.categoryId ?? null,
        positionId: input.positionId ?? null,
        moveId: input.moveId ?? null,
        curriculumId: input.curriculumId ?? null,
        isFavorite: input.isFavorite ?? false,
        isGoal: input.isGoal ?? false,
      },
    });

    return newJit;
  }),
});
