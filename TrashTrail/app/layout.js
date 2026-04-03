import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import NavbarWrapper from "@/components/NavbarWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "TrashTrail - Waste Tracking Platform",
  description: "End-to-end tracking of urban waste from household to final processing.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#0A0A0A] text-white antialiased`}>
        <Providers>
          <NavbarWrapper />
          <main className="flex-1 w-full flex flex-col">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
