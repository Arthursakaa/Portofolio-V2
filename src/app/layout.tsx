import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const pressStart2P = localFont({
  src: "../fonts/PressStart2P.woff2",
  variable: "--font-pixel",
  display: "swap",
});

const vt323 = localFont({
  src: "../fonts/VT323.woff2",
  variable: "--font-vt",
  display: "swap",
});

export const metadata: Metadata = {
  title: "I Gede Arthur Saka Dewantara | Computer Science @ BINUS & Full-Stack Developer",
  description:
    "Portfolio of I Gede Arthur Saka Dewantara — Computer Science undergraduate at BINUS University. Building full-stack web applications, AI systems, and retro-infused digital interfaces.",
  keywords: [
    "Arthur Saka",
    "I Gede Arthur Saka Dewantara",
    "BINUS University",
    "Computer Science",
    "Full-Stack Developer",
    "Software Engineer",
    "FitnessVals",
    "EduBot",
    "React",
    "Next.js",
    "Laravel",
    "Go",
    "Tailwind CSS",
  ],
  authors: [{ name: "I Gede Arthur Saka Dewantara" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${pressStart2P.variable} ${vt323.variable} h-full antialiased scroll-smooth`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-[#f4efe6] text-[#2b2723]"
      >
        {/* Scroll-reveal needs JS; without it, show every section as-is */}
        <noscript>
          <style>{`[data-reveal-item]{opacity:1!important;translate:none!important}.pixel-wipe{clip-path:none!important}.boot-line{opacity:1!important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
