import Link from "next/link";
import type { RouterOutputs } from "~/utils/api";

type AimWithUser = RouterOutputs["aims"]["getAll"][number];

export const AimView = (props: AimWithUser) => {
  const { aim, creator } = props;
  return (
    <div key={aim.id} className="flex gap-3 border-b border-slate-400 p-4">
      <div className="flex flex-col">
        <div className="flex gap-1 text-slate-300">
          <Link href={`/aim/${aim.id}`}></Link>
        </div>
        <span className="text-2xl">{aim.title}</span>
      </div>
    </div>
  );
};
