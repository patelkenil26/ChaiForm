import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { GlobalProviders } from "~/providers/global";
import { rootMetadata, OrganizationJsonLd, PersonAuthorJsonLd, WebSiteJsonLd } from "~/seo";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = rootMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <meta
          name="google-site-verification"
          content="nK49TVdG5f6Pt7-HortuxiuJZS3FSCk9MUnfLBzjE9I"
        />
        <OrganizationJsonLd />
        <PersonAuthorJsonLd />
        <WebSiteJsonLd />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
        <GlobalProviders>{children}</GlobalProviders>
      </body>
    </html>
  );
}
