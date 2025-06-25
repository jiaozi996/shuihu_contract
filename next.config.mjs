// /** @type {import('next').NextConfig} */
// const nextConfig = {};
import createNextIntlPlugin from "next-intl/plugin";
import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";
const withNextIntl = createNextIntlPlugin();
if (process.env.NODE_ENV === "development") {
  await setupDevPlatform();
}
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // 关闭严格模式
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        // 你可以在这里添加其他需要忽略的模块
      };
    }
    return config;
  },
};

// export default nextConfig;
export default withNextIntl(nextConfig);
