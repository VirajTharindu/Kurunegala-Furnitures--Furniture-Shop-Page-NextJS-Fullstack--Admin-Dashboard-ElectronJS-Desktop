import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kurunegala Furnitures | Immersive 3D Experience",
  description: "Legacy craftsmanship meets futuristic 3D immersion. Explore our high-end furniture collections with real-time customization.",
  openGraph: {
    title: "Kurunegala Furnitures | Immersive 3D Experience",
    description: "Experience the future of furniture shopping with our live 3D configurator.",
    url: "https://kurunegala-furnitures.com",
    siteName: "Kurunegala Furnitures",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kurunegala Furnitures | Immersive 3D Experience",
    description: "Experience the future of furniture shopping with our live 3D configurator.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
