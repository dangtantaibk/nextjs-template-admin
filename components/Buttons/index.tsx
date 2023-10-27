"use client"
import React, { memo } from "react";

interface ButtonProps {
  children: React.ReactNode;
  tooltip?: String;
  type?: String;
  onClick?: Function | any;
  className?: string;
  isSubmit?: boolean;
}
const Buttons = (props: ButtonProps) => {

  const { children, tooltip, type, onClick, className, isSubmit = false } = props;

  const renderClass = (type) => {
    switch (type) {
      case 'link':
        return 'inline-flex text-base font-semibold text-white hover:text-primary'
      case 'primary':
        return 'bg-primary rounded py-2 px-[18px] inline-flex text-base font-semibold text-white hover:text-primary'
      default:
        return 'inline-flex text-base font-semibold text-white hover:text-primary'
    }
  }

  return (
    <div className="group relative inline-block">
      <button className={`${renderClass(type)} ${className}`} onClick={onClick} type={isSubmit ? "submit" : undefined} >
        {children}
      </button>
      {!!tooltip &&
        <div
          className="absolute bottom-full left-1/2 z-20 mb-3 -translate-x-1/2 whitespace-nowrap rounded bg-black py-[6px] px-4 text-sm font-semibold text-white opacity-0 group-hover:opacity-100"
        >
          <span
            className="absolute bottom-[-3px] left-1/2 -z-10 h-2 w-2 -translate-x-1/2 rotate-45 rounded-sm bg-black"
          ></span>
          {tooltip}
        </div>
      }
    </div>
  );
};

export default memo(Buttons);
