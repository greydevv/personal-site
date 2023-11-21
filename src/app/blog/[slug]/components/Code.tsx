"use client";

import SyntaxHighlighter from "react-syntax-highlighter";
import { ocean as HLJS_THEME } from "react-syntax-highlighter/dist/cjs/styles/hljs";

interface CodeProps {
  readonly language?: string,
  readonly code: string
}

export default function Code(props: CodeProps) {
  // Need an empty pre tag because the markdown parser already wraps code in a `pre` tag.
  const emptyPreTag = ({ children }) => <>{ children }</>;
  
  return (
    <SyntaxHighlighter
      language={ props.language || "text" }
      PreTag={ emptyPreTag }
      style={ HLJS_THEME }
    >
      { props.code }
    </SyntaxHighlighter>
  );
}
