import type { Metadata } from "next";
import "src/app/globals.css";

export const metadata: Metadata = {
  title: "Greyson Murray",
  description: "Personal website for Greyson Murray.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
