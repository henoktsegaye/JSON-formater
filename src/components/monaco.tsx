import type { editor } from "monaco-editor";
import Editor, { EditorProps } from "@monaco-editor/react";
import { forwardRef } from "react";

type Props = EditorProps;

export type Editor = editor.IStandaloneCodeEditor;

export const Monaco = forwardRef<editor.IStandaloneCodeEditor, Props>(
  ({ value, ...rest }, ref) => {
    return (
      <Editor
        height="70vh"
        defaultLanguage="json"
        value={value}
        onMount={(editor, monaco) => {
          editor.getModel()?.updateOptions({ tabSize: 2 });
          typeof ref === "function" && ref(editor);
          if (!(typeof ref === "function") && ref) {
            ref.current = editor;
          }
          rest.onMount && rest.onMount(editor, monaco);
        }}
        options={{
          bracketPairColorization: {
            enabled: true,
          },
          matchBrackets: "always",
          scrollBeyondLastLine: false,
          minimap: {
            enabled: false,
          },
        }}
        {...rest}
      />
    );
  }
);
