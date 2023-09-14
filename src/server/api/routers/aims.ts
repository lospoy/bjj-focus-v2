import { clerkClient } from "@clerk/nextjs";

import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";
import { filterUserForClient } from "~/server/helpers/filterUserForClient";
import type { Aim } from "@prisma/client";

const addUserDataToAims = async (aims: Aim[]) => {
  const users = (
    await clerkClient.users.getUserList({
      userId: aims.map((aim) => aim.creatorId),
      limit: 100,
    })
  ).map(filterUserForClient);

  return aims.map((aim) => {
    const creator = users.find((user) => user.id === aim.creatorId);
    if (!creator?.username)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "creator for aim not found",
      });

    return {
      aim,
      creator: {
        ...creator,
        username: creator.username,
      },
    };
  });
};

// Create a new ratelimiter, that allows 3 requests per 1 minute
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 m"),
  analytics: true,
});

export const aimsRouter = createTRPCRouter({
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const aim = await ctx.prisma.aim.findUnique({
        where: { id: input.id },
      });

      if (!aim) throw new TRPCError({ code: "NOT_FOUND" });

      const [aimWithUserData] = await addUserDataToAims([aim]);
      return aimWithUserData;
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const aims = await ctx.prisma.aim.findMany({
      take: 100,
      orderBy: [{ createdOn: "desc" }], //descending, newest first
    });

    return addUserDataToAims(aims);
  }),

  getAimsByUserId: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(({ ctx, input }) =>
      ctx.prisma.aim
        .findMany({
          where: {
            creatorId: input.userId,
          },
          take: 100,
          orderBy: [{ createdOn: "desc" }],
        })
        .then(addUserDataToAims),
    ),

  create: privateProcedure
    .input(
      z.object({
        // Zod Validator - www.github.com/colinhacks/zod
        // Type definition inferred from the validator
        title: z.string().min(3).max(120),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const creatorId = ctx.userId;

      const { success } = await ratelimit.limit(creatorId);

      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

      const aim = await ctx.prisma.aim.create({
        data: {
          creatorId,
          title: input.title,
          helpfulnessLow: 0,
          helpfulnessMid: 0,
          helpfulnessHigh: 0,
        },
      });

      return aim;
    }),
});
