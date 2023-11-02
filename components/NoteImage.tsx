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

import { PropsWithChildren } from "react";

interface NoteImageProps extends PropsWithChildren {
  noteText: string;
  fontFamily: string;
  fontFinalColor: () => string;
  fontSize: string;
  backgroundImage: string;
  customBackgroundImage?: File;
  backgroundImageWidth: number;
  backgroundImageHeight: number;
  imagePadding: { left: number; right: number; top: number; bottom: number };
  hideMargins: boolean;
}

export const NoteImage = (props: NoteImageProps) => {
  const {
    noteText,
    fontFamily,
    fontFinalColor,
    fontSize,
    backgroundImage,
    customBackgroundImage,
    backgroundImageWidth,
    backgroundImageHeight,
    imagePadding,
    hideMargins,
    children,
  } = props;

  const color = fontFinalColor();

  const getImageSource = () => {
    if (customBackgroundImage) {
      return URL.createObjectURL(customBackgroundImage);
    } else return `/images/${backgroundImage}`;
  };

  return (
    <div
      className="relative"
      id="note"
      style={{
        fontFamily: fontFamily,
        fontSize: fontSize,
        color: color,
        height: `${backgroundImageHeight}px`,
        width: `${backgroundImageWidth}px`,
        whiteSpace: "pre-wrap",
        maxWidth: "100%",
        maxHeight: "90%",
        padding: `${imagePadding.top}px ${imagePadding.right}px ${imagePadding.bottom}px ${imagePadding.left}px`,
      }}
    >
      <img
        className="absolute top-0 left-0 w-full h-full z-0"
        alt={`Paper image from ${backgroundImage} `}
        // width={backgroundImageWidth}
        // height={backgroundImageHeight}
        src={getImageSource()}
      />
      <p className="relative">{noteText}</p>
      {children}
    </div>
  );
};
