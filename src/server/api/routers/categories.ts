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

export const categoriesRouter = createTRPCRouter({
  getAll: privateProcedure.query(async ({ ctx }) => {
    const categories = await ctx.prisma.category.findMany({
      orderBy: [{ name: "asc" }],
      select: {
        id: true,
        name: true,
        metadata: true,
      },
    });

    return categories;
  }),
});
