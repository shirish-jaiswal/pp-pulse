const nextConfig = {
  basePath: "/portal",

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://pp-pulse-backend.onrender.com/api/:path*",
      },
    ];
  },
};

export default nextConfig;