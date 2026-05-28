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
};

export default nextConfig;
