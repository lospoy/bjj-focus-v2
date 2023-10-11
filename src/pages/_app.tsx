import { type AppType } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { Provider } from "react-redux";
import store from "~/store/store";
import Navbar from "~/components/ui/navbar";
import Head from "next/head";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <Provider store={store}>
      <ClerkProvider>
        <Head>
          <link rel="manifest" href="/manifest.json" />
        </Head>
        <Navbar />
        <Component {...pageProps} />
      </ClerkProvider>
    </Provider>
  );
};

export default api.withTRPC(MyApp);
