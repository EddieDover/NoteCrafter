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

import { ReactNode } from "react";

interface FormElementProps extends React.PropsWithChildren {
  id: string;
  label: string;
  labelIcon?: ReactNode;
  className?: string;
  classNameOverride?: string;
  type:
    | "text"
    | "color"
    | "range"
    | "textarea"
    | "select"
    | "richtextarea"
    | "number"
    | "upload";
  [key: string]: any;
  onClear?: () => void;
}

export const FormElement = (props: FormElementProps) => {
  const {
    label,
    labelIcon,
    id,
    children,
    type,
    classNameOverride,
    onClear,
    ...otherProps
  } = props;
  return (
    <div className="flex flex-col">
      {label ? (
        <label
          className="whitespace-nowrap block text-sm font-medium"
          htmlFor={id}
        >
          {label} {labelIcon}
        </label>
      ) : null}

      {props.type === "text" ? (
        <input
          type="text"
          name={id}
          id={id}
          {...otherProps}
          className={classNameOverride}
        />
      ) : null}
      {props.type === "number" ? (
        <input
          type="number"
          name={id}
          id={id}
          {...otherProps}
          className={classNameOverride}
        />
      ) : null}
      {props.type === "color" ? (
        <input
          type="color"
          name={id}
          id={id}
          className={classNameOverride}
          {...otherProps}
        />
      ) : null}
      {props.type === "range" ? (
        <input
          type="range"
          name={id}
          id={id}
          className={classNameOverride}
          {...otherProps}
        />
      ) : null}
      {props.type === "textarea" ? (
        <textarea
          name={id}
          id={id}
          className={classNameOverride}
          {...otherProps}
        ></textarea>
      ) : null}
      {props.type === "select" ? (
        <select name={id} id={id} className={classNameOverride} {...otherProps}>
          {children}
        </select>
      ) : null}
      {props.type === "upload" ? (
        <div className="flex flex-row flex-nowrap">
          <input
            type="file"
            name={id}
            id={id}
            className={classNameOverride}
            {...otherProps}
          />
          <button
            type="button"
            className="w-[50px] mx-1 text-white transition duration-500 ease-in-out transform bg-red-600 rounded-xl hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            onClick={() => {
              const input = document.getElementById(id) as HTMLInputElement;
              input.value = "";
              if (onClear) {
                onClear();
              }
            }}
          >
            X
          </button>
        </div>
      ) : null}
    </div>
  );
};
