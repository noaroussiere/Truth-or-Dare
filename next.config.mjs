import dotenv from 'dotenv';
import { expand } from 'dotenv-expand';

// Load and expand variables from .env
const myEnv = dotenv.config();
expand(myEnv);

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
