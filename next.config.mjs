/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Serve originals from Supabase with zero compression or downscaling.
    // This ensures 100% original quality on ALL devices — desktop and mobile.
    // Enable Next.js optimization now that source images are reasonably sized.
    unoptimized: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lusvuwwlcdgowauvdpoh.supabase.co',
        port: '',
        pathname: '/**',
      },
    ],
    // Full deviceSizes list ensures high-res variants on all screen sizes
    // if optimization is ever re-enabled in future.
    deviceSizes: [320, 420, 640, 750, 828, 1080, 1200, 1440, 1920, 2560, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512, 720, 1080],
  },
}

export default nextConfig
