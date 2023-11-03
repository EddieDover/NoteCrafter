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
  title: "NoteCrafter",
  description:
    "An app for GMs, to create simple handout notes for their players.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full w-full">
      <head>
        <title>NoteCrafter</title>
        <meta name="title" content="NoteCrafter" />
        <meta
          name="description"
          content="A web-app that allows you to create layered imaged handouts, with custom fonts and overlays, for your TTRPG sessions, or anything else."
        />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.notecrafter.app/" />
        <meta property="og:title" content="NoteCrafter" />
        <meta
          property="og:description"
          content="A web-app that allows you to create layered imaged handouts, with custom fonts and overlays, for your TTRPG sessions, or anything else."
        />
        <meta
          property="og:image"
          content="https://notecrafter.app/images/nclogo.png"
        />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://www.notecrafter.app/" />
        <meta property="twitter:title" content="NoteCrafter" />
        <meta
          property="twitter:description"
          content="A web-app that allows you to create layered imaged handouts, with custom fonts and overlays, for your TTRPG sessions, or anything else."
        />
        <meta
          property="twitter:image"
          content="https://notecrafter.app/images/nclogo.png"
        />
      </head>
      <body className={`w-full h-full ${inter.className}`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
