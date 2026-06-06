/** @type {import('next').NextConfig} */
const repoName = "uae-car-showroom";
const isProd = process.env.NODE_ENV === "production";
const isGhPages = process.env.GITHUB_ACTIONS === "true";

const nextConfig = {
  output: "export",
  basePath: isProd && isGhPages ? `/${repoName}` : "",
  assetPrefix: isProd && isGhPages ? `/${repoName}/` : "",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
