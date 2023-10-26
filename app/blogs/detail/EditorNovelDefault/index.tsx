"use client"
import React, { memo } from "react";
import { Editor } from "novel";
import { defaultEditorProps } from '../props';

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
      editorProps={{...defaultEditorProps}}
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

export default memo(EditorNovelDefault);
