import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

// const CategorySchema = z.object({
//   metadata: z
//     .record(
//       z.union([
//         z.string(),
//         z.number(),
//         z.boolean(),
//         z.null(),
//         z.array(z.any()),
//         z.record(z.any()),
//       ]),
//     )
//     .optional(),
//   id: z.string(),
//   name: z.string(),
// });

export const movesRouter = createTRPCRouter({
  getAll: privateProcedure.query(async ({ ctx }) => {
    const moves = await ctx.prisma.move.findMany({
      orderBy: [{ name: "asc" }],
      select: {
        id: true,
        name: true,
        customNames: true,
        metadata: true,
      },
    });

    return moves;
  }),
});
