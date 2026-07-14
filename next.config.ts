import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disabled so media players (video/audio) are not double-mounted in dev,
  // which otherwise tears down and restarts playback the moment a file opens.
  reactStrictMode: false,
};

export default nextConfig;

