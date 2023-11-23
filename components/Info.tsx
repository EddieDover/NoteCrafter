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

import { BiQuestionMark } from "react-icons/bi";

export const Info = () => {
  const closeModal = () => {
    const dialog: HTMLDialogElement | null = document?.getElementById(
      "info_modal"
    ) as HTMLDialogElement | null;
    dialog?.close();
  };

  return (
    <>
      <button
        title="View Info"
        onClick={() => {
          const dialog: HTMLDialogElement | null = document?.getElementById(
            "info_modal"
          ) as HTMLDialogElement | null;
          dialog?.showModal();
        }}
      >
        <BiQuestionMark />
      </button>
      <dialog id="info_modal" className="modal" onClick={closeModal}>
        <div className="modal-box">
          <h3 className="font-bold text-lg"></h3>
          <div className="modal-content prose">
            <h2>What is NoteCrafter?</h2>
            <p>Notecrafter creates images of notes on paper. That&apos;s it!</p>
            <h2>Why?</h2>
            <p>
              I needed a way to make handouts for the players in my TTRPG (D&D)
              sessions.
            </p>
            <h2>My Custom Font doesn&apos;t work.</h2>
            <p>
              Sadly, that&apos;s a limitation of the html-to-image library I
              decided to use and didn&apos;t discover until it was too late.
              Click the ? mark next to the Custom Font label for options.
            </p>
            <h2>I like this, can I donate/tip?</h2>
            <p className="text-2xl">
              <a href="https://ko-fi.com/U7U5QNR59" target="_blank">
                <img
                  height="36"
                  className="b-0 h-[36px]"
                  src="https://storage.ko-fi.com/cdn/kofi2.png?v=3"
                  alt="Buy Me a Coffee at ko-fi.com"
                />
              </a>
            </p>
          </div>
          <div className="modal-action">
            <button className="btn btn-primary" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};
