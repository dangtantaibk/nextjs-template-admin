
import React, { useState } from "react";
import Editor from "./components/editor/Editor";
import exampleData from "./components/editor/data";


const EditorConfig = () => {
  const [data, setData] = useState();
  console.log("EditorConfig")
  return <Editor data={data} setData={setData} />
};

export default EditorConfig;
