import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ResumeForge AI - AI Resume Optimizer & Content Generator",
  description:
    "Optimize your resume with AI. Get ATS-compatible resumes tailored to specific job descriptions in seconds.",
  icons: {
    icon: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "ResumeForge AI",
    description: "AI-Powered Resume Optimizer",
    images: [{ url: "/logo-512.png", width: 512, height: 512 }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
