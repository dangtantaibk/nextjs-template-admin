"use client"
import React, { memo } from "react";
import { Editor } from "novel";

interface EditorNovelProps {
  handleUpdateEditor: Function;
}

const EditorNovel = (props: EditorNovelProps) => {
  const { handleUpdateEditor } = props;

  return (
    <Editor
      defaultValue={{}}
      completionApi={'abc/uploadv1'}
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

export default memo(EditorNovel);
