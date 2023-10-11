await import("./src/env.mjs");
import withPWA from "next-pwa";
const isProduction = process.env.NODE_ENV === "production";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
};

const fullConfig = withPWA({
  dest: "public",
  disable: !isProduction,
})(nextConfig);

export default fullConfig;
