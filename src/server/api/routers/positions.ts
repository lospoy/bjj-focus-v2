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

export const positionsRouter = createTRPCRouter({
  getAll: privateProcedure.query(async ({ ctx }) => {
    const positions = await ctx.prisma.position.findMany({
      orderBy: [{ name: "asc" }],
      select: {
        id: true,
        name: true,
        customNames: true,
        metadata: true,
        categoryType: { select: { name: true } },
      },
    });

    return positions;
  }),
});
