import { clerkClient } from "@clerk/nextjs";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const newActiveJitSchema = z.object({
  jitId: z.string(),
});

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(30, "1 m"),
  analytics: true,
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

  create: privateProcedure
    .input(newActiveJitSchema)
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

  // // *******GET ALL (this user's activeJits)

  // // *******SOFT DELETE
  // softDelete: privateProcedure
  //   .input(z.object({ id: z.string() }))
  //   .mutation(async ({ ctx, input }) => {
  //     const currentUser = ctx.userId;
  //     const activeJitId = input.id;

  //     // Check if the user has permission to update this activeJit
  //     const activeJit = await ctx.prisma.activeJit.findUnique({
  //       where: { id: activeJitId },
  //     });

  //     if (!activeJit) {
  //       throw new TRPCError({ code: "NOT_FOUND" });
  //     }

  //     if (activeJit.creatorId !== currentUser) {
  //       throw new TRPCError({ code: "FORBIDDEN" });
  //     }

  //     // Perform the update
  //     const softDeletedActiveJit = await ctx.prisma.activeJit.update({
  //       where: { id: activeJitId },
  //       data: {
  //         status: ActiveJitStatus.DELETED,
  //       },
  //     });

  //     return softDeletedActiveJit;
  //   }),
});
