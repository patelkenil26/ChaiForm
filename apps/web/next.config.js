/** @type {import('next').NextConfig} */
const nextConfig = {
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
    ];
  },
  async rewrites() {
    return [
      {
        source: "/trpc/:path*",
        destination: "http://localhost:8000/trpc/:path*",
      },
    ];
  },
};

export default nextConfig;
