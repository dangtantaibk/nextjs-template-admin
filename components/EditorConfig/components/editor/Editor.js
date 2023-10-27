import React, { useRef, useCallback } from "react";
import { EDITOR_JS_TOOLS } from "./tools";
import { createReactEditorJS } from "react-editor-js";

export default function Editor({ data, setData }) {
	const editorCore = useRef(null);
	const ReactEditorJS = createReactEditorJS();

	const handleInitialize = useCallback((instance) => {
		// await instance._editorJS.isReady;
		instance._editorJS.isReady
			.then(() => {
				// set reference to editor
        console.log("instance====", instance)
				editorCore.current = instance;
			})
			.catch((err) => console.log("An error occured", err));
	}, []);

	const handleSave = useCallback(async () => {
		// retrieve data inserted
		const savedData = await editorCore.current.save();
		// save data
    console.log("editorCore==============",await editorCore)
    console.log("editorCore==============", await editorCore.current.save())

		// setData(savedData);
	}, [setData]);

	return (
		<div className="editor-container">
			<ReactEditorJS
				onInitialize={handleInitialize}
				tools={EDITOR_JS_TOOLS}
				onChange={handleSave}
				defaultValue={data}
			/>
		</div>
	);
}
