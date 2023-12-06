import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

type Json = {
  [key: string]: string | number | boolean | null | Json | Json[];
};

const ClerkUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  firstName: z.string() ?? null,
  lastName: z.string() ?? null,
  userName: z.string() ?? null,
  role: z.enum(["USER", "COACH", "MANAGER", "ADMIN"]),
  DOB: z.date() ?? null,
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
});

export const usersRouter = createTRPCRouter({
  getById: privateProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: input.id },
      });

      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      return user;
    }),

  getAll: privateProcedure.query(async ({ ctx }) => {
    const users = await ctx.prisma.user.findMany({
      orderBy: [{ createdAt: "desc" }], //descending, newest first
    });

    return users;
  }),

  create: privateProcedure
    .input(ClerkUserSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.create({
        data: {
          id: input.id,
          email: input.email,
          firstName: input.firstName,
          lastName: input.lastName,
          userName: input.userName,
          role: input.role,
          DOB: input.DOB,
          metadata: input.metadata as Json,
        },
      });

      return user;
    }),
});
