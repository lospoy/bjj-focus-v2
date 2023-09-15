// AimView.js
import Link from "next/link";
import { useAimData } from "./aimWizard"; // Import the useAimData function

export const AimView = ({ aimId }: { aimId: string }) => {
  const aimData = useAimData(aimId);

  if (!aimData) {
    // Handle the case where aimData is not available (loading or error)
    return <div>Loading...</div>; // You can customize this message
  }

  const { aim } = aimData;
  return (
    <div key={aim.id} className="flex gap-3 p-2">
      <div className="flex flex-col">
        <div className="flex text-slate-300">
          <Link href={`/aim/${aim.id}`}></Link>{" "}
        </div>
        <span className="text-2xl">{aim.title}</span>
        <span className="text-sm">{aim.notes}</span>
      </div>
    </div>
  );
};
