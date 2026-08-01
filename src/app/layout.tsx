import type { Metadata } from "next";
import "./globals.css";
import "leaflet/dist/leaflet.css";

export const metadata: Metadata = {
  title: "Hanuman Travels | Ultra Luxury Intercity Cabs & Fleet Experience",
  description:
    "Experience safe, comfortable and premium intercity travel with Hanuman Travels. Professional drivers, well-maintained 4 & 7 seater luxury fleet serving Rajahmundry, Andhra Pradesh & Telangana.",
  keywords: [
    "Hanuman Travels",
    "Luxury Intercity Cabs",
    "Rajahmundry Cabs",
    "Andhra Pradesh Cabs",
    "Telangana Premium Taxi",
    "Luxury Travel",
  ],
  authors: [{ name: "Hanuman Travels" }],
  openGraph: {
    title: "Hanuman Travels | Every Journey Begins Here",
    description:
      "Ultra-luxury intercity cab service connecting Rajahmundry to Andhra Pradesh & Telangana.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-[#030304] text-white antialiased selection:bg-brand-orange selection:text-white overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
