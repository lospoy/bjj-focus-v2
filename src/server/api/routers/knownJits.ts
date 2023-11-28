import { clerkClient } from "@clerk/nextjs";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
} from "~/server/api/trpc";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// const knownJitSchema = z
//   .object({
//     startDate: z.date().refine(
//       (date) => {
//         const serverTime = new Date();
//         const fiveMinutesAgo = new Date(serverTime);
//         fiveMinutesAgo.setMinutes(serverTime.getMinutes() - 5);

//         return date >= fiveMinutesAgo;
//       },
//       {
//         message: "Start date cannot be more than 5 minutes in the past.",
//       },
//     ),

//     endDate: z.date(),
//     status: z.enum(["ACTIVE", "PAUSED", "DELETED", "COMPLETED"]),
//     reminders: z.array(reminderSchema),
//     jitId: z.string(),
//   })
//   .refine((data) => data.endDate > data.startDate, {
//     message: "End date cannot be earlier than start date.",
//     path: ["endDate"],
//   });

// const ratelimit = new Ratelimit({
//   redis: Redis.fromEnv(),
//   limiter: Ratelimit.slidingWindow(3, "1 m"),
//   analytics: true,
// });

export const knownJitsRouter = createTRPCRouter({

  getByJitId: privateProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.userId
      const jitId = input.id

      const knownJit = await ctx.prisma.knownJit.findUnique({
        where: { userId_jitId: { userId, jitId } },
      });

      if (!knownJit) throw new TRPCError({ code: "NOT_FOUND" });

      return knownJit;
    }),

  getAllKnownByThisUser: privateProcedure
    .query(async ({ ctx }) => {
      const knownJits = await ctx.prisma.knownJit.findMany({
        where: { userId: ctx.userId },
        take: 200,
        orderBy: [{ activatedOn: "desc" }], //descending, newest first
      });

      return knownJits;
  }),

  // create: privateProcedure
  //   .input(knownJitSchema)
  //   .mutation(async ({ ctx, input }) => {
  //     const currentUser = ctx.userId;

  //     const { success } = await ratelimit.limit(currentUser);

  //     if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

  //     const knownJit = await ctx.prisma.knownJit.create({
  //       data: {
  //         creatorId: currentUser,
  //         startDate: new Date(input.startDate),
  //         endDate: new Date(input.endDate),
  //         status: input.status,
  //         reminders: input.reminders,
  //         jitId: input.jitId,
  //       },
  //     });

  //     return knownJit;
  //   }),

  // // *******GET ALL (this user's knownJits)

  // // *******SOFT DELETE
  // softDelete: privateProcedure
  //   .input(z.object({ id: z.string() }))
  //   .mutation(async ({ ctx, input }) => {
  //     const currentUser = ctx.userId;
  //     const knownJitId = input.id;

  //     // Check if the user has permission to update this knownJit
  //     const knownJit = await ctx.prisma.knownJit.findUnique({
  //       where: { id: knownJitId },
  //     });

  //     if (!knownJit) {
  //       throw new TRPCError({ code: "NOT_FOUND" });
  //     }

  //     if (knownJit.creatorId !== currentUser) {
  //       throw new TRPCError({ code: "FORBIDDEN" });
  //     }

  //     // Perform the update
  //     const softDeletedKnownJit = await ctx.prisma.knownJit.update({
  //       where: { id: knownJitId },
  //       data: {
  //         status: KnownJitStatus.DELETED,
  //       },
  //     });

  //     return softDeletedKnownJit;
  //   }),
});
