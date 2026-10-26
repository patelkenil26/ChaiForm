/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  trailingSlash: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
        ],
      },
      {
        // Allow public conversational forms to be embedded in external iframes
        source: "/form/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors *;",
          },
        ],
      },
      {
        // Protect internal creator dashboard from clickjacking
        source: "/dashboard/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/form",
        destination: "/forms",
        permanent: false,
      },
      {
        source: "/submission",
        destination: "/submissions",
        permanent: false,
      },
      {
        source: "/dashboard/forms",
        destination: "/forms",
        permanent: true,
      },
      {
        source: "/dashboard/forms/:id",
        destination: "/forms/:id",
        permanent: true,
      },
      {
        source: "/dashboard/forms/:id/submissions",
        destination: "/forms/:id/submissions",
        permanent: true,
      },
      {
        source: "/dashboard/submissions",
        destination: "/submissions",
        permanent: true,
      },
      {
        source: "/dashboard/explore",
        destination: "/explore",
        permanent: true,
      },
      {
        source: "/sign-in",
        destination: "/login",
        permanent: true,
      },
      {
        source: "/signin",
        destination: "/login",
        permanent: true,
      },
      {
        source: "/register",
        destination: "/signup",
        permanent: true,
      },
      {
        source: "/sign-up",
        destination: "/signup",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    const rawApiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!rawApiUrl) return [];
    const apiTarget = rawApiUrl.endsWith("/trpc") ? rawApiUrl : `${rawApiUrl}/trpc`;

    return [
      {
        source: "/trpc/:path*",
        destination: `${apiTarget}/:path*`,
      },
    ];
  },
};

export default nextConfig;
