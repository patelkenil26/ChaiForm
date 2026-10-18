import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { GlobalProviders } from "~/providers/global";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://chaiform.kenilpatel.in"),
  title: "ChaiForm • Next-Gen Conversational Form Builder",
  description: "Build beautiful, high-converting conversational forms with ease.",
  openGraph: {
    title: "ChaiForm • Next-Gen Conversational Form Builder",
    description: "Build beautiful, high-converting conversational forms with ease.",
    url: "https://chaiform.kenilpatel.in",
    siteName: "ChaiForm",
    type: "website",
  },
  icons: {
    icon: { url: "/chaiform-logo-transparent-for-dark-bg (3).svg", type: "image/svg+xml" },
    shortcut: "/chaiform-logo-transparent-for-dark-bg (3).svg",
    apple: "/chaiform-logo-transparent-for-dark-bg (3).svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
        <GlobalProviders>{children}</GlobalProviders>
      </body>
    </html>
  );
}
