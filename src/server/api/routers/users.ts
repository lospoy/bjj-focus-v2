import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

const ClerkUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  userName: z.string().optional(),
  role: z.enum(["USER", "COACH", "MANAGER", "ADMIN"]),
  DOB: z.date().optional(),
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
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          userName: true,
          role: true,
          DOB: true,
          metadata: true,
        },
      });

      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      return user;
    }),

  getAll: privateProcedure.query(async ({ ctx }) => {
    const users = await ctx.prisma.user.findMany({
      orderBy: [{ createdAt: "desc" }], //descending, newest first
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        userName: true,
        role: true,
        DOB: true,
        metadata: true,
      },
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
          firstName: input.firstName ?? null,
          lastName: input.lastName ?? null,
          userName: input.userName ?? null,
          role: input.role ?? "USER",
          DOB: input.DOB ?? null,
          metadata: input.metadata ?? { set: null },
        },
      });

      return user;
    }),
});
