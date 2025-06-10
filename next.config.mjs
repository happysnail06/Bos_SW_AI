/** @type {import('next').NextConfig} */
const nextConfig = {
  // Netlify specific configuration
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};

export default nextConfig; 