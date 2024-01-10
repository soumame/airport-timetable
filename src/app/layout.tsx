import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@radix-ui/themes/styles.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "羽田時刻表 / Tokyo Int'l Timetable",
  description:
    "羽田空港の国際線出発情報をフライト案内表示器風に表示します。/ Flightboard-like Haneda International Airport Departure Timetable",
  keywords: [
    "時刻表",
    "羽田空港",
    "Timetable",
    "FlightBoard",
    "国際線",
    "空港",
  ],
  authors: [
    { name: "So Tokumaru" },
    { name: "So Tokumaru", url: "https://so-bean.work" },
  ],
  creator: "So Tokumaru",
  twitter: {
    card: "summary_large_image",
    title: "羽田国際線時刻表 / Tokyo Int'l Timetable",
    description:
      "羽田空港の国際線出発情報をフライト案内表示器風に表示します。/ Flightboard-like Haneda International Airport Departure Timetable",
    siteId: "1467726470533754880",
    creator: "@so_to9",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
