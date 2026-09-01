import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/radar", destination: "/editais", permanent: true },
      { source: "/radar/:id", destination: "/editais/:id", permanent: true },
      { source: "/oportunidades", destination: "/vagas", permanent: true },
    ];
  },
};

export default nextConfig;
