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

import { BiNotepad } from "react-icons/bi";

export const Changelog = () => {
  const closeModal = () => {
    const dialog: HTMLDialogElement | null = document?.getElementById(
      "changelog_modal"
    ) as HTMLDialogElement | null;
    dialog?.close();
  };

  return (
    <>
      <button
        title="View Changelog"
        onClick={() => {
          const dialog: HTMLDialogElement | null = document?.getElementById(
            "changelog_modal"
          ) as HTMLDialogElement | null;
          const changelogURL =
            "https://raw.githubusercontent.com/EddieDover/notecrafter/main/CHANGELOG.md";
          fetch(changelogURL)
            .then((response) => response.text())
            .then((data) => {
              //Converts the data from markdown to html
              const showdown = require("showdown");
              showdown.setOption("headerLevelStart", 3);
              const converter = new showdown.Converter();
              data = converter.makeHtml(data);

              const changelog = document.createElement("div");
              changelog.innerHTML = data;
              const modalBody = dialog?.querySelector(".modal-content");
              if (modalBody) {
                // Clear the children
                while (modalBody.firstChild) {
                  modalBody.removeChild(modalBody.firstChild);
                }
                modalBody.appendChild(changelog);
              }
            });
          dialog?.showModal();
        }}
      >
        <BiNotepad />
      </button>
      <dialog id="changelog_modal" className="modal" onClick={closeModal}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Changelog</h3>
          <div className="modal-action">
            <button className="btn btn-primary" onClick={closeModal}>
              Close
            </button>
          </div>
          <div className="modal-content prose"></div>
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
