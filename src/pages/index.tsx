// homePage

import { type NextPage } from "next";
import { SignIn, useUser } from "@clerk/nextjs";
import { Dashboard } from "../components/Dashboard";

const HomePage: NextPage = () => {
  const { isLoaded: userLoaded, isSignedIn } = useUser();

  return !isSignedIn ? (
    <div className="min-w-screen flex flex-col items-center bg-background">
      <main className="flex-grow md:w-1/3">
        <section className="md:min-w-xl mx-auto p-4">
          <SignIn />
        </section>
      </main>
      <footer className="fixed bottom-0 left-0 w-full bg-gray-100 p-3 text-center">
        <p className="text-xs text-gray-700">
          © 2024 BJJ Focus. All rights reserved.
        </p>
      </footer>
    </div>
  ) : (
    <Dashboard />
  );
};

export default HomePage;
