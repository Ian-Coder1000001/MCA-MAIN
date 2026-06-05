import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "Elphas Shilosio — MCA Murhanda Ward",
    template: "%s | Elphas Shilosio",
  },
  description:
    "Official campaign site for Elphas Shilosio, MCA candidate for Murhanda Ward, Kakamega County. Real projects in health, education, roads, and more.",
  keywords: ["Murhanda Ward", "MCA", "Elphas Shilosio", "Kakamega", "ward development"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
