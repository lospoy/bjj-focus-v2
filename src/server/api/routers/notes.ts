import { TRPCError } from "@trpc/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(2000, "1 m"),
  analytics: true,
});

const NoteSchema = z.object({
  body: z.string().optional(),
  id: z.string().optional(),
  isFavorite: z.boolean().optional(),
});

const CreateNoteSchema = NoteSchema.extend({
  jitId: z.string(),
});

export const notesRouter = createTRPCRouter({
  getById: privateProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const note = await ctx.prisma.note.findUnique({
        where: {
          id: input.id,
        },
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          metadata: true,
          jitId: true,
          body: true,
          isFavorite: true,
        },
      });

      if (!note) throw new TRPCError({ code: "NOT_FOUND" });

      return note;
    }),

  updateById: privateProcedure
    .input(NoteSchema)
    .mutation(async ({ ctx, input }) => {
      const { success } = await ratelimit.limit(ctx.userId);

      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

      const updatedNote = await ctx.prisma.note.update({
        where: {
          id: input.id,
        },
        data: {
          isFavorite: input.isFavorite,
        },
      });

      if (!updatedNote) throw new TRPCError({ code: "NOT_FOUND" });

      return updatedNote;
    }),

  getNotesByJitId: privateProcedure
    .input(z.object({ jitId: z.string() }))
    .query(async ({ ctx, input }) => {
      const notesByJitId = await ctx.prisma.note.findMany({
        where: {
          jitId: input.jitId,
        },
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          metadata: true,
          jitId: true,
          body: true,
          isFavorite: true,
        },
      });

      if (!notesByJitId) throw new TRPCError({ code: "NOT_FOUND" });

      return notesByJitId;
    }),

  create: privateProcedure
    .input(CreateNoteSchema)
    .mutation(async ({ ctx, input }) => {
      const { success } = await ratelimit.limit(ctx.userId);

      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

      const newNote = await ctx.prisma.note.create({
        data: {
          jitId: input.jitId,
          body: input.body ?? "empty note",
        },
      });

      return newNote;
    }),
});
