import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/radar", destination: "/editais", permanent: true },
      { source: "/radar/:id", destination: "/editais/:id", permanent: true },
      { source: "/cadastro", destination: "/pro", permanent: false },
    ];
  },
};

export default nextConfig;
