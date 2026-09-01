import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/radar", destination: "/editais", permanent: true },
      { source: "/radar/:id", destination: "/editais/:id", permanent: true },
      { source: "/oportunidades", destination: "/vagas", permanent: true },

      // canonicaliza para https://patrinu.com
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.patrinu.com" }],
        destination: "https://patrinu.com/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "(www\\.)?patrinu\\.com\\.br" }],
        destination: "https://patrinu.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
