/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better dev experience
  reactStrictMode: true,

  // Allow images from external domains (for project screenshots if hosted externally)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // Webpack config for Three.js GLSL shader imports (if needed later)
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      type: "asset/source",
    });
    return config;
  },

  // Suppress Three.js SSR warnings
  transpilePackages: ["three"],
};

export default nextConfig;
