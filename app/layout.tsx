/*
 Copyright (C) 2023 Eddie Dover

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as
 published by the Free Software Foundation, either version 3 of the
 License, or (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public License for more details.

 You should have received a copy of the GNU Affero General Public License
 along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://notecrafter.app/"),
  title: "NoteCrafter",
  description:
    "A web-app that allows you to create layered imaged handouts, with custom fonts and overlays, for your TTRPG sessions, or anything else.",
  applicationName: "NoteCrafter",
  authors: [
    {
      name: "Eddie Dover",
      url: "https://www.eddiedover.dev",
    },
  ],
  keywords: ["handout", "handouts", "ttrpg", "generator", "5E", "D&D"],
  openGraph: {
    type: "website",
    url: "https://www.notecrafter.app",
    title: "NoteCrafter",
    description:
      "A web-app that allows you to create layered imaged handouts, with custom fonts and overlays, for your TTRPG sessions, or anything else.",
    images: [
      {
        url: "https://notecrafter.app/images/nclogo.jpg",
        width: 512,
        height: 512,
        alt: "NoteCrafter Logo",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full w-full">
      <body className={`w-full h-full ${inter.className}`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
