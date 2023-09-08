import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import type { RouterOutputs } from "~/utils/api";

type AimWithUser = RouterOutputs["aims"]["getAll"][number];

export const AimView = (props: AimWithUser) => {
  const { aim, creator } = props;
  return (
    <div key={aim.id} className="flex gap-3 border-b border-slate-400 p-4">
      <Image
        src={creator.profileImageURL}
        className="h-14 w-14 rounded-full"
        alt={`@${creator.username}'s-profile-picture`}
        width={56}
        height={56}
      />
      <div className="flex flex-col">
        <div className="flex gap-1 text-slate-300">
          <Link href={`/@${creator.username}`}>
            <span>{`@${creator.username}`}</span>
          </Link>
          <Link href={`/aim/${aim.id}`}>
            <span className="font-thin">{`· ${dayjs(aim.createdAt)}`}</span>
          </Link>
        </div>
        <span className="text-2xl">{aim.content}</span>
      </div>
    </div>
  );
};
