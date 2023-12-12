import { type AppType } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { Provider } from "react-redux";
import store from "~/store/store";
import Head from "next/head";
import TopNav from "~/components/TopNav";
import BottomNav from "~/components/BottomNav";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <Provider store={store}>
      <ClerkProvider>
        <Head>
          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content="#eb5683" />
        </Head>
        <TopNav />
        <Component {...pageProps} />
        <BottomNav />
      </ClerkProvider>
    </Provider>
  );
};

export default api.withTRPC(MyApp);
