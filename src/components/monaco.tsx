import type { editor } from "monaco-editor";
import Editor, { EditorProps } from "@monaco-editor/react";
import { forwardRef } from "react";

type Props = EditorProps;

export type Editor = editor.IStandaloneCodeEditor;

const defaultOptions = {
  bracketPairColorization: {
    enabled: true,
  },
  matchBrackets: "always" as const,
  scrollBeyondLastLine: false,
  minimap: {
    enabled: false,
  },
} as EditorProps["options"];

export const Monaco = forwardRef<editor.IStandaloneCodeEditor, Props>(
  ({ value, onMount, options, ...rest }, ref) => {
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
          onMount && onMount(editor, monaco);
        }}
        {...rest}
        options={{
          ...defaultOptions,
          ...options,
        }}
      />
    );
  }
);
