await import("./src/env.mjs");
import withPWA from "next-pwa";
const isProduction = process.env.NODE_ENV === "production";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ["js", "jsx", "ts", "tsx", "mdx"],
  experimental: {
    scrollRestoration: true,
  },
};

const fullConfig = withPWA({
  dest: "public",
  disable: !isProduction,
})(nextConfig);

export default withPWA(fullConfig);
