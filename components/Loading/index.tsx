"use client"
import React from "react";

const Loading = () => {

  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-row space-x-4">
        <div className="w-8 h-8 rounded-full animate-spin border-y border-solid border-yellow-500 border-t-transparent" style={{ borderTopColor: "#0005ff" }}></div>
      </div>
    </div>
  );
};

export default Loading;
