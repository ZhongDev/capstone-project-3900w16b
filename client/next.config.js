/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["localhost", "plateholder-server"],
  },
};

module.exports = nextConfig;
