"use client"
import React from "react";

interface LabelTailwindProps {
  title: string;
  value: React.ReactNode;
  width?: number;
}

const LabelTailwind = (props: LabelTailwindProps) => {
  const { title, value, width = 120 } = props;
  return (
    <div className="flex items-center">
      <div className={`font-semibold mr-2 min-w-[${width}px]`}>{title}: </div>
      <div>{value}</div>
    </div>
  )
}

export default LabelTailwind;
