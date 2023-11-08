/** @type {import('next').NextConfig} */
module.exports = {
  trailingSlash: true,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8501",
        // pathname: "/account123/**",
      },
    ],
  },
  webpack: (config) => {
    return config;
  },
};
