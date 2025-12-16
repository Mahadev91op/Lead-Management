/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  // अगर बाहरी Images use कर रहे हैं तो इसे add करें:
  /*
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
      },
    ],
  },
  */
};

export default nextConfig;