"use client";

import React from "react";

import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

import renderer from "../rendering/renderer";

interface BlogBodyProps {
  readonly rawMarkdown: string
}

export default function BlogBody(props: BlogBodyProps) {
  return (
    <Markdown>
      { props.rawMarkdown }
    </Markdown>
  );
}

interface MarkdownProps {
  readonly children: string
}

const Markdown = (props: MarkdownProps) => (
  <ReactMarkdown
    remarkPlugins={ [remarkMath] }
    rehypePlugins={ [rehypeKatex] }
    components={ renderer }
  >
    { props.children }
  </ReactMarkdown>
);
