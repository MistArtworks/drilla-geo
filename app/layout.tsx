import type { Metadata } from "next";
import { Baloo_2, Inter } from "next/font/google";
import "./globals.css";
import SiteBackground from "@/components/SiteBackground";
import NavBar from "@/components/NavBar";

const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Mist x Monarch // GeoGuessr Contest",
  description:
    "A followers-only GeoGuessr duo bracket contest hosted by Mist and Monarch. Register your team, climb the bracket, win the prize.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${baloo.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-surface text-foreground relative overflow-x-hidden">
        <SiteBackground />
        <NavBar />
        <main className="relative z-10 flex-1">{children}</main>
        <footer className="relative z-10 border-t border-line py-6 text-center text-sm text-ink/50 font-body">
          Mist x Monarch GeoGuessr Contest — followers only, no pros allowed.
        </footer>
      </body>
    </html>
  );
}
