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
import type { Intent } from "@prisma/client";

const addUserDataToIntents = async (intents: Intent[]) => {
  const users = (
    await clerkClient.users.getUserList({
      userId: intents.map((intent) => intent.creatorId),
      limit: 100,
    })
  ).map(filterUserForClient);

  return intents.map((intent) => {
    const creator = users.find((user) => user.id === intent.creatorId);
    if (!creator?.username)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "creator for intent not found",
      });

    return {
      intent,
      creator: {
        ...creator,
        username: creator.username,
      },
    };
  });
};

// Create a new ratelimiter, that allows 3 requests per 1 minute
// const ratelimit = new Ratelimit({
//   redis: Redis.fromEnv(),
//   limiter: Ratelimit.slidingWindow(3, "1 m"),
//   analytics: true,
// });

export const intentsRouter = createTRPCRouter({
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const intent = await ctx.prisma.intent.findUnique({
        where: { id: input.id },
      });

      if (!intent) throw new TRPCError({ code: "NOT_FOUND" });

      return (await addUserDataToIntents([intent]))[0];
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const intents = await ctx.prisma.intent.findMany({
      take: 100,
      orderBy: [{ createdOn: "desc" }], //descending, newest first
    });

    return addUserDataToIntents(intents);
  }),

  getIntentsByUserId: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(({ ctx, input }) =>
      ctx.prisma.intent
        .findMany({
          where: {
            creatorId: input.userId,
          },
          take: 100,
          orderBy: [{ createdOn: "desc" }],
        })
        .then(addUserDataToIntents),
    ),

  create: privateProcedure
    .input(
      z.object({
        // Zod Validator - www.github.com/colinhacks/zod
        // Type definition inferred from the validator.
        // "Only emojis are allowed" error message comes from the server
        // title: z.string().emoji("Only emojis are allowed").min(1).max(280),
        title: z.string().min(3).max(120),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const creatorId = ctx.userId;

      // const { success } = await ratelimit.limit(creatorId);

      // if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

      const intent = await ctx.prisma.intent.create({
        data: {
          creatorId,
          title: input.title,
          helpfulnessLow: 0,
          helpfulnessMid: 0,
          helpfulnessHigh: 0,
        },
      });

      return intent;
    }),
});
