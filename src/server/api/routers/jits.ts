import { clerkClient } from "@clerk/nextjs";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
} from "~/server/api/trpc";
import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";

// Create a new ratelimiter, that allows 3 requests per 1 minute
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 m"),
  analytics: true,
});

export const jitsRouter = createTRPCRouter({

  getById: privateProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const jit = await ctx.prisma.jit.findUnique({
        where: { id: input.id },
      });

      if (!jit) throw new TRPCError({ code: "NOT_FOUND" });

      return jit;
    }),

  getAll: privateProcedure
    .query(async ({ ctx }) => {
      const jits = await ctx.prisma.jit.findMany({
        take: 200,
        orderBy: [{ createdOn: "desc" }], //descending, newest first
      });

    return jits;
  }),

  // Modify to create
  //  getJitsByPercentage
  //  getJitsByCategory
  //  etc.

  // getJitsByUserId: publicProcedure
  //   .input(
  //     z.object({
  //       userId: z.string(),
  //     }),
  //   )
  //   .query(({ ctx, input }) =>
  //     ctx.prisma.jit
  //       .findMany({
  //         where: {
  //           creatorId: input.userId,
  //         },
  //         take: 100,
  //         orderBy: [{ createdOn: "desc" }],
  //       })
  //       .then(addUserDataToJits),
  //   ),

  // create: privateProcedure
  //   .input(
  //     z.object({
  //       name: z.string().min(3).max(120),
  //     }),
  //   )
  //   .mutation(async ({ ctx, input }) => {
  //     const creatorId = ctx.userId;

  //     const { success } = await ratelimit.limit(creatorId);

  //     if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

  //     const jit = await ctx.prisma.jit.create({
  //       data: {
  //         name: input.name,
  //       },
  //     });

  //     return jit;
  //   }),
});