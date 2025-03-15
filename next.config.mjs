import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "app/sw.js", // Source service worker file
  swDest: "public/sw.js", // Destination in the public directory
});

const nextConfig = {
  // Your Next.js config
  reactStrictMode: true,
  // Add any other Next.js configuration options here
};

export default withSerwist(nextConfig);
