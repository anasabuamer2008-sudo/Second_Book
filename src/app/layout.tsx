import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "الكتاب الثاني | Second Book",
  description: "كتب قرأتها واستعرضها لكم لتعم الفائدة",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
