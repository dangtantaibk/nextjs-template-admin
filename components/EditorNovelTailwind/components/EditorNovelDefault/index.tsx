"use client"
import React, { memo } from "react";
import { Editor } from "novel";

interface EditorNovelProps {
  contentAdmin: any;
  handleUpdateEditor: Function;
}

const EditorNovelDefault = (props: EditorNovelProps) => {
  const { contentAdmin, handleUpdateEditor } = props;

  if (Object?.keys(contentAdmin).length === 0) {
    return;
  }

  return (
    <Editor
      defaultValue={contentAdmin}
      disableLocalStorage={true}
      className="border-stroke min-h[300px] max-h[500px]"
      onDebouncedUpdate={(editor) => {
        const view = editor?.getJSON();
        const content = editor?.getHTML();
        handleUpdateEditor(content, view);
      }}
    />
  );
};

export default memo(EditorNovelDefault);
