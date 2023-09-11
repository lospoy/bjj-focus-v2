import { type NextPage } from "next";

import { api } from "~/utils/api";
import { SignInButton, useUser } from "@clerk/nextjs";
import dayjs from "dayjs";
import Image from "next/image";
import { LoadingPage, LoadingSpinner } from "~/components/loading";
import { useState } from "react";
import toast from "react-hot-toast";
import { PageLayout } from "~/components/layout";
import { AimView } from "~/components/aimView";

const CreateAimWizard = () => {
  const { user } = useUser();
  // In a pro app we could use Zod and React Hook form to invalidate input in-client
  // Also we'd use React Hook form to manage the input state
  // Here we'll probably get a 'sticky key' behavior (since we're re-rendering on key press)
  const [input, setInput] = useState("");

  const ctx = api.useContext();
  const { mutate, isLoading: isAiming } = api.aims.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.aims.getAll.invalidate(); // adding void to tell TS we just want this to happen in the background
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.title;
      if (errorMessage?.[0]) {
        toast.error(errorMessage[0]);
      } else {
        toast.error("Failed to aim. Please try again later.");
      }
    },
  });

  if (!user) return null;

  return (
    <div className="flex w-full gap-3">
      <Image
        src={user.profileImageUrl}
        alt="profile-image"
        className="h-14 w-14 rounded-full"
        width={56}
        height={56}
      />
      <input
        placeholder="type some emojis!"
        className="grow bg-transparent outline-none"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (input !== "") {
              mutate({ title: input });
            }
          }
        }}
        disabled={isAiming}
      />
      {input !== "" && !isAiming && (
        <button onClick={() => mutate({ title: input })}>Aim</button>
      )}

      {isAiming && (
        <div className="flex items-center justify-center">
          <LoadingSpinner size={20} />
        </div>
      )}
    </div>
  );
};

const Feed = () => {
  const { data, isLoading: aimsLoading } = api.aims.getAll.useQuery();

  if (aimsLoading) return <LoadingPage />;
  if (!data) return <div>Something went wrong</div>;

  return (
    <div className="flex flex-col">
      {data.map((fullAim) => (
        <AimView {...fullAim} key={fullAim.aim.id} />
      ))}
    </div>
  );
};

const Home: NextPage = () => {
  const { isLoaded: userLoaded, isSignedIn } = useUser();

  // Start fetching asap
  // (React query will use cached data if the data doesn't change)
  api.aims.getAll.useQuery();

  // Return empty div if user isn't loaded yet
  if (!userLoaded) return <div />;

  return (
    <PageLayout>
      <div className="flex border-b border-slate-400 p-4">
        {!isSignedIn && (
          <div className="flex justify-center">
            <SignInButton />
          </div>
        )}
        {isSignedIn && <CreateAimWizard />}
      </div>

      <Feed />
    </PageLayout>
  );
};

export default Home;
