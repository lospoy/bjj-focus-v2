import { type AppType } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { Provider } from "react-redux";
import store from "~/store/store";
import Navbar from "~/components/ui/navbar";
import type { Metadata } from "next";
import Head from "next/head";

export const metadata: Metadata = {
  title: "PokePoke",
  viewport: "width=device-width, initial-scale=1.0",
  manifest: "/manifest.json",
  themeColor: "#ffffff",
};

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <Provider store={store}>
      <ClerkProvider>
        <Head>
          <metadata />
        </Head>
        <Navbar />
        <Component {...pageProps} />
      </ClerkProvider>
    </Provider>
  );
};

export default api.withTRPC(MyApp);
