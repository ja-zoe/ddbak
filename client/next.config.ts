import type { NextConfig } from "next";
import { getServerURL } from "@/lib/utils";

const nextConfig: NextConfig = {
  images: {
    domains: [getServerURL()],
  },
};

export default nextConfig;
