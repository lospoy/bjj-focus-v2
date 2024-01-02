import type * as z from "zod";
import { type RouterOutputs } from "~/utils/api";
import type { JitCreate } from "~/server/api/routers/jits";

export type JitRecord = RouterOutputs["jits"]["create"];
export type Jits = RouterOutputs["jits"]["getAll"];
export type JitCreate = z.infer<typeof JitCreate>;
export type Positions = RouterOutputs["positions"]["getAll"];
export type Moves = RouterOutputs["moves"]["getAll"];
