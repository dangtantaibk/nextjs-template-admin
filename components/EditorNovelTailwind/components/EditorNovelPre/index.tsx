"use client"
import React, { memo } from "react";
import { Editor } from "novel";

interface EditorNovelProps {
  contentAdmin: any;
  handleUpdateEditor: Function;
}

const EditorNovelPre = (props: EditorNovelProps) => {
  const { contentAdmin, handleUpdateEditor } = props;

  if (Object?.keys(contentAdmin).length === 0) {
    return;
  }

  console.log("contentAdmin", contentAdmin)
  return (
    <Editor
      defaultValue={contentAdmin}
      disableLocalStorage={true}
      className="border-stroke min-h[300px] max-h[500px]"
      onDebouncedUpdate={(editor) => {
        const view = editor?.getJSON();
        const content = editor?.getHTML();
        console.log("onDebouncedUpdate", content)
        handleUpdateEditor(content, view);
      }}
    />
  );
};

export default memo(EditorNovelPre);
