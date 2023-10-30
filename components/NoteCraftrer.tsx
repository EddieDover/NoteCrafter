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

"use client";

import { FONT_LIST } from "@/data/fonts";
import { PAPER_LIST } from "@/data/papers";
import { MAX_FONT_SIZE } from "@/data/constants";
import download from "downloadjs";
import * as htmlToImage from "html-to-image";
import { useCallback, useState } from "react";
import {
  BiBug,
  BiDownload,
  BiLogoGithub,
  BiQuestionMark,
} from "react-icons/bi";
import NextImage from "next/image";
import { FormElement } from "./FormElement";
import { Changelog } from "./Changelog";
import { NoteImage } from "./NoteImage";
import { Info } from "./Info";

interface NoteCrafterProps {}

export const NoteCrafter = (props: NoteCrafterProps) => {
  const [noteText, setNoteText] = useState("This is a note");
  const [backgroundImage, setBackgroundImage] = useState(PAPER_LIST[0].file);
  const [customBackgroundImage, setCustomBackgroundImage] = useState<File>();
  const [fontFamily, setFontFamily] = useState("Verdana");
  const [fontColor, setFontColor] = useState("#000000");
  const [fontOpacity, setFontOpacity] = useState("1");
  const [fontSize, setFontSize] = useState("16px");
  const [backgroundImageWidth, setBackgroundImageWidth] = useState(
    PAPER_LIST[0].size?.x ?? "auto"
  );
  const [backgroundImageHeight, setBackgroundImageHeight] = useState(
    PAPER_LIST[0].size?.y ?? "auto"
  );
  const [imagePadding, setImagePadding] = useState({
    left: PAPER_LIST[0].defaults?.left ?? 0,
    right: PAPER_LIST[0].defaults?.right ?? 0,
    top: PAPER_LIST[0].defaults?.top ?? 0,
    bottom: PAPER_LIST[0].defaults?.bottom ?? 0,
  });
  const [backgroundAttribution, setBackgroundAttribution] = useState(
    PAPER_LIST[0].source
  );
  const [fontAttribution, setFontAttribution] = useState(FONT_LIST[0].source);
  const [marginsVisible, setMarginsVisible] = useState(true);
  const [outputFormat, setOutputFormat] = useState<
    "webp" | "png" | "svg" | "jpeg"
  >("webp");
  const [selfCaptureMode, setSelfCaptureMode] = useState(false);

  const formSetNoteText = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNoteText(event.target.value);
  };

  const formSetFont = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFontFamily(event.target.value);
    const fontSource = FONT_LIST.find(
      (font) => font.name === event.target.value
    )?.source;
    if (fontSource) {
      setFontAttribution(`${fontSource}`);
    } else {
      setFontAttribution("");
    }
  };

  const formSetFontColor = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFontColor(event.target.value);
  };

  const formSetFontOpacity = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFontOpacity(event.target.value);
  };

  const formSetFontSize = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFontSize(event.target.value);
  };

  const formSetBackgroundImage = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const backgroundImageData = PAPER_LIST.find(
      (paper) => paper.file === event.target.value
    );

    if (!backgroundImageData) return;

    clearCustomImage();
    setBackgroundImage(backgroundImageData.file);
    setBackgroundImageWidth(backgroundImageData.size.x);
    setBackgroundImageHeight(backgroundImageData.size.y);

    if (backgroundImageData.source) {
      setBackgroundAttribution(
        `Background image from ${backgroundImageData.source}`
      );
    } else {
      setBackgroundAttribution("");
    }
  };

  const fontFinalColor = useCallback(() => {
    const hex = fontColor.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return `rgba(${r},${g},${b},${fontOpacity})`;
  }, [fontColor, fontOpacity]);

  const makeImage = async () => {
    const note = document.getElementById("note");

    if (note) {
      setMarginsVisible(false);
      switch (outputFormat) {
        case "png":
          htmlToImage.toPng(note).then(function (dataUrl) {
            download(dataUrl, "my-note.png");
            setMarginsVisible(true);
          });
          break;
        case "jpeg":
          htmlToImage.toJpeg(note).then(function (dataUrl) {
            download(dataUrl, "my-note.jpeg");
            setMarginsVisible(true);
          });
          break;
        case "svg":
          htmlToImage.toSvg(note).then(function (dataUrl) {
            download(dataUrl, "my-note.svg");
            setMarginsVisible(true);
          });
          break;
        case "webp":
          htmlToImage.toJpeg(note).then(function (dataUrl) {
            const resdata = fetch("/api/webp", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(dataUrl),
            })
              .then((response) => response.blob())
              .then((blob) => {
                download(blob, "my-note.webp");
              })
              .finally(() => {
                setMarginsVisible(true);
              });
          });
          break;
        default:
          break;
      }
    }
  };

  const setCustomFont = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
      const fontdatastring = e.target?.result as string;
      const fontdata = fontdatastring.split("base64,")[1].split(",")[0];
      const fontbuffer = Buffer.from(fontdata, "base64");
      const font = new FontFace("custom", fontbuffer);

      font.load().then((loadedFont) => {
        document.fonts.add(loadedFont);
        setFontFamily("custom");
        setFontAttribution("Custom font");
      });
    };
    reader.readAsDataURL(file);
  };

  const clearCustomFont = () => {
    setFontFamily(FONT_LIST[0].name);
    setFontAttribution(FONT_LIST[0].source);

    const selectedFont = document.getElementById(
      "custom_font_select"
    ) as HTMLInputElement;
    selectedFont.value = "";
  };

  const setCustomImage = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = new Image();
      img.src = e.target?.result as string;
      img.onload = function () {
        const imageHeight = img.height;
        const imageWidth = img.width;
        setCustomBackgroundImage(file);
        setBackgroundImageWidth(imageWidth);
        setBackgroundImageHeight(imageHeight);
        setBackgroundAttribution("Custom background image");
      };
    };
    reader.readAsDataURL(file);
  };

  const clearCustomImage = () => {
    setCustomBackgroundImage(undefined);
    const selectedBackgroundImage = document.getElementById(
      "background_image"
    ) as HTMLSelectElement;
    selectedBackgroundImage.value = PAPER_LIST[0].file;
    setBackgroundImage(PAPER_LIST[0].file);
    setBackgroundImageWidth(PAPER_LIST[0].size?.x ?? "auto");
    setBackgroundImageHeight(PAPER_LIST[0].size?.y ?? "auto");
    setBackgroundAttribution(PAPER_LIST[0].source);
  };

  const toggleSelfCaptureMode = () => {
    setSelfCaptureMode(!selfCaptureMode);
    setMarginsVisible(selfCaptureMode);
  };

  const closeWarningModal = (event: any) => {
    const dialog: HTMLDialogElement | null = document?.getElementById(
      "cfw_modal"
    ) as HTMLDialogElement | null;
    dialog?.close();
  };

  return (
    <div className="h-full flex flex-row flex-nowrap items-center">
      <div className="flex flex-col border h-full">
        <div className="flex flex-col flex-nowrap">
          <NextImage
            className="mx-auto mt-2"
            src="/images/nclogo.webp"
            width="300"
            height="100"
            alt="Note Creator Logo"
          />
          <span className="text-3xl flex flex-row flex-nowrap justify-around">
            <Info />
            <a
              href="https://www.github.com/eddiedover/notecrafter"
              target="_blank"
              rel="noreferrer noopener"
            >
              <BiLogoGithub />
            </a>
            <a
              href="https://github.com/EddieDover/notecrafter/issues/new?labels=bug&template=bug_report.md"
              target="_blank"
              rel="noreferrer noopener"
            >
              <BiBug />
            </a>
            <Changelog />
          </span>
        </div>
        <div className="divider my-0"></div>
        <form className="my-auto flex flex-col px-2 gap-2">
          <FormElement
            id="font_select"
            label="Font: "
            onChange={formSetFont}
            style={{ fontFamily: fontFamily }}
            type="select"
            classNameOverride="select select-primary w-full max-w-xs"
          >
            {FONT_LIST.map((font) => {
              return (
                <option
                  key={font.name}
                  style={{ fontFamily: font.name }}
                  value={font.name}
                >
                  {font.name}
                </option>
              );
            })}
          </FormElement>
          <FormElement
            id="custom_font_select"
            label={`Custom Font:`}
            labelIcon={
              <button
                onClick={(event) => {
                  event.preventDefault();
                  const dialog: HTMLDialogElement | null =
                    document?.getElementById(
                      "cfw_modal"
                    ) as HTMLDialogElement | null;
                  dialog?.showModal();
                }}
              >
                <BiQuestionMark />
              </button>
            }
            type="upload"
            onChange={setCustomFont}
            classNameOverride="file-input file-input-bordered file-input-primary w-full max-w-xs"
            onClear={() => {
              clearCustomFont();
            }}
          />
          <FormElement
            id="font_color_picker"
            label="Font Color: "
            type="color"
            classNameOverride="max-w-[100px] max-h-[100px]"
            onChange={formSetFontColor}
          />
          <FormElement
            id="font_opacity"
            label="Font Opacity: "
            type="range"
            min="0"
            max="1"
            step="0.01"
            classNameOverride="range range-primary"
            value={fontOpacity}
            onChange={formSetFontOpacity}
          />
          <FormElement
            id="font_size"
            label="Font Size: "
            type="select"
            classNameOverride="select select-primary w-full max-w-xs"
            onChange={formSetFontSize}
          >
            {Array.from({ length: MAX_FONT_SIZE - 16 + 1 }, (_, i) => {
              if ((16 + i) % 2 === 0)
                return (
                  <option key={i} value={`${16 + i}px`}>
                    {16 + i}px
                  </option>
                );
            })}
          </FormElement>
          <div className="divider"></div>
          <FormElement
            id="background_image"
            label="Background Texture: "
            type="select"
            classNameOverride="select select-primary w-full max-w-xs"
            value={backgroundImage}
            onChange={formSetBackgroundImage}
          >
            {PAPER_LIST.map((paper, idx) => {
              return (
                <option key={paper.name} value={paper.file}>
                  {paper.name}
                </option>
              );
            })}
          </FormElement>
          <FormElement
            id="custom_background_image"
            label="Custom Background Texture: "
            type="upload"
            classNameOverride="file-input file-input-bordered file-input-primary w-full max-w-xs"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setCustomImage(event.target.files?.[0]);
            }}
            onClear={() => {
              clearCustomImage();
            }}
          />
          <div className="divider"></div>
          <FormElement
            id="text_area"
            label="Text: "
            classNameOverride="input input-bordered input-primary w-full max-w-xs"
            onChange={formSetNoteText}
            type="textarea"
          ></FormElement>
          <div className="divider"></div>
          <FormElement
            id="image_padding_left"
            label="Margin Left: "
            type="range"
            min="0"
            max="200"
            step="5"
            classNameOverride="range range-primary"
            value={imagePadding.left}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setImagePadding({
                ...imagePadding,
                left: parseInt(event.target.value),
              });
            }}
          ></FormElement>
          <FormElement
            id="image_padding_right"
            label="Margin Right: "
            type="range"
            min="0"
            max="200"
            step="5"
            classNameOverride="range range-primary"
            value={imagePadding.right}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setImagePadding({
                ...imagePadding,
                right: parseInt(event.target.value),
              });
            }}
          ></FormElement>
          <FormElement
            id="image_padding_top"
            label="Margin Top: "
            type="range"
            min="0"
            max="200"
            step="5"
            classNameOverride="range range-primary"
            value={imagePadding.top}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setImagePadding({
                ...imagePadding,
                top: parseInt(event.target.value),
              });
            }}
          ></FormElement>
          <FormElement
            id="image_padding_bottom"
            label="Margin Bottom: "
            type="range"
            min="0"
            max="200"
            step="5"
            classNameOverride="range range-primary"
            value={imagePadding.bottom}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setImagePadding({
                ...imagePadding,
                bottom: parseInt(event.target.value),
              });
            }}
          ></FormElement>
          <div className="divider"></div>
          <div className="flex flex-row">
            <p>Self Capture Mode</p>
            <input
              type="checkbox"
              checked={selfCaptureMode}
              onChange={toggleSelfCaptureMode}
            />
          </div>
          <div className="flex flex-row flex-nowrap mx-auto">
            <FormElement
              id="output_format"
              label=""
              type="select"
              classNameOverride="select select-primary w-full max-w-xs"
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                setOutputFormat(
                  event.target.value as "webp" | "png" | "svg" | "jpeg"
                );
              }}
            >
              <option value="webp">WEBP</option>
              <option value="png">PNG</option>
              <option value="jpeg">JPEG</option>
              <option value="svg">SVG</option>
            </FormElement>
            <button
              id="make_image"
              type="button"
              className="btn btn-primary"
              onClick={() => makeImage()}
            >
              <span className="pr-1 text-2xl">
                <BiDownload />
              </span>
              Download
            </button>
          </div>
        </form>
      </div>
      <div className="relative w-full h-full flex flex-col">
        <div className="w-full h-fit-content">
          {backgroundAttribution || fontAttribution ? (
            <div className="w-full text-center">
              <h2>Attributions:</h2>
              {backgroundAttribution ? (
                <p className="text-xs">
                  Background from: {backgroundAttribution}
                </p>
              ) : null}
              {fontAttribution ? (
                <p className="text-xs">Font from: {fontAttribution}</p>
              ) : null}
            </div>
          ) : null}
        </div>
        <div id="results" className="relative mx-auto">
          <NoteImage
            {...{
              noteText,
              fontFamily,
              fontFinalColor,
              fontSize,
              backgroundImage,
              customBackgroundImage,
              backgroundImageWidth,
              backgroundImageHeight,
              imagePadding,
              selfCaptureMode,
            }}
          >
            {Object.keys(imagePadding).map((key) => {
              const val = imagePadding[key as keyof typeof imagePadding];
              return (
                <div
                  key={key}
                  style={{
                    position: "absolute",
                    ...(["left"].includes(key) && { left: 0 }),
                    ...(["right", "top", "bottom"].includes(key) && {
                      right: 0,
                    }),
                    ...(["left", "top", "right"].includes(key) && { top: 0 }),
                    ...(["bottom"].includes(key) && { bottom: 0 }),
                    ...(["left", "right"].includes(key) && {
                      width: `${val}px`,
                      height: "100%",
                    }),
                    ...(["top", "bottom"].includes(key) && {
                      height: `${val}px`,
                      width: "100%",
                    }),
                    backgroundColor: "rgba(255,0,0,0.25)",
                    visibility: marginsVisible ? "visible" : "hidden",
                    display: marginsVisible ? "block" : "none",
                  }}
                  className="h-full"
                ></div>
              );
            })}
          </NoteImage>
        </div>
      </div>
      <dialog id="cfw_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">A Warning about Custom Fonts</h3>
          <div className="modal-content whitespace-pre-line">
            <div className="flex flex-wrap w-[400px] prose">
              <p>
                The library I&apos;m using to capture images from HTML
                isn&apos;t exactly well maintained, so custom fonts don&apos;t
                work.
              </p>
              As it stands, until things are fixed, you have two options:
              <ol>
                <li>
                  <p>
                    <b>Take a sceenshot yourself</b> - Toggling the &quot;Self
                    Capture Mode&quot; checkbox will remove the margins and
                    allow you to manually screenshot the image. Then you can use
                    an image editor of your choice to paste the sceenshot in and
                    save it to whatever format you desire.
                  </p>
                </li>
                <li>
                  <p>
                    <b>Add the font to the site</b> - File a feature/font
                    request on the{" "}
                    <a
                      href="https://github.com/EddieDover/notecrafter/issues/new?labels=bug&template=font_request.md"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      REPOSITORY
                    </a>{" "}
                    and include information about the font you want me to add.
                    They don&apos;t take very long to add, so as long as your
                    font is licensed properly, I can get it done within a few
                    minutes if I&apos;m available.
                  </p>
                </li>
              </ol>
            </div>
          </div>
          <div className="modal-action">
            <div className="btn btn-primary" onClick={closeWarningModal}>
              Close
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default NoteCrafter;
