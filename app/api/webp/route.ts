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

const sharp = require("sharp");

async function convertImageToWebp(
  image: Buffer,
  transparentColor?: [number, number, number, number]
) {
  if (transparentColor) {
    const webPData = await sharp(image)
      .flatten({ background: transparentColor, alpha: 0 })
      .removeAlpha(transparentColor)
      .webp()
      .toBuffer();
    return webPData;
  } else {
    const webPData = await sharp(image)
      .webp({ background: "transparent" })
      .toBuffer();
    return webPData;
  }
}

export async function POST(request: Request, response: Response) {
  const data = await request.json();
  if (!data) return;
  const cleanstringvalue = data.replace(/^data:image\/\w+;base64,/, "");
  const imageBuffer = Buffer.from(cleanstringvalue, "base64");

  const webpData = await convertImageToWebp(imageBuffer);

  return new Response(webpData, {
    headers: {
      "Content-Type": "image/webp",
    },
  });
}
