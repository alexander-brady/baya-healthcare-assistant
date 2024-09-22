/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
      if (!isServer) {
        // Fixes npm packages that depend on `fs` module
        config.resolve.fallback.fs = false;
      }
  
      config.module.rules.push({
        test: /\.node$/,
        use: 'node-loader',
      });
  
      return config;
    },
  rewrites: async () => {
    return [
      {
        source: '/flask/:path*',
        destination:
          process.env.NODE_ENV === 'development'
            ? 'http://127.0.0.1:5328/:path*'
            : '/',
      },
    ]
 },
}

export default nextConfig;