import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/theme-provider";
import BackgroundMusic from "@/components/BackgroundMusic";
import CookieBanner from "@/components/CookieBanner";
import "./globals.css"; 

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap", 
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sangamkunwar.com.np"),

  title: {
    default: "Sangam Kunwar – Full Stack Developer",
    template: "%s | Sangam Kunwar",
  },

  description:
    "Official portfolio of Sangam Kunwar – Full Stack Developer, programmer and tech creator.",

  generator: "sangamkunwar",

  // ✅ AdSense verification meta
  other: {
    "google-adsense-account": "ca-pub-5849186110366340",
  },

  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },

  manifest: "/manifest.json",

  openGraph: {
    title: "Sangam Kunwar – Full Stack Developer",
    description:
      "Official portfolio of Sangam Kunwar – Full Stack Developer and tech creator.",
    url: "https://sangamkunwar.com.np",
    siteName: "Sangam Kunwar",
    images: [
      {
        url: "/sangamkunwarphoto.png",
        width: 1200,
        height: 630,
        alt: "Sangam Kunwar Photo",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Sangam Kunwar – Full Stack Developer",
    description:
      "Official portfolio of Sangam Kunwar – Full Stack Developer and tech creator.",
    images: ["/sangamkunwarphoto.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#7b3fe4" />

        {/* ✅ FIXED: Use RAW script (NO next/script) */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5849186110366340"
          crossOrigin="anonymous"
        ></script>
      </head>

      <body className={`${inter.className} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <BackgroundMusic />

          {children}

          <CookieBanner />
        </ThemeProvider>

        <Analytics />
      </body>
    </html>
  );
}