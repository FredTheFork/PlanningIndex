/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'foundationary.vercel.app',
      },
      {
        hostname: '*.supabase.co',
      },
    ],
  },
  webpack: (config, { defaultLoaders }) => {
    // Exclude src directory from webpack compilation
    config.module.rules.push({
      test: /\.jsx?$/,
      exclude: /src/,
    });
    return config;
  },
};

export default nextConfig;
