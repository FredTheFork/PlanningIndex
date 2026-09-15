/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  transpilePackages: ['mapbox-gl'],
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'images.pexels.com' }],
  },
  allowedDevOrigins: process.env.BASE44_PUBLIC_HOST_SUFFIX
    ? ['3000-' + process.env.BASE44_PUBLIC_HOST_SUFFIX]
    : [],
};

export default nextConfig;
