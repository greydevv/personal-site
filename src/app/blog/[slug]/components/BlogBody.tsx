"use client";

import React from "react";

import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

import renderer from "src/app/blog/[slug]/rendering/renderer";

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

const Markdown = ({ children }) => (
  <ReactMarkdown
    remarkPlugins={ [remarkMath] }
    rehypePlugins={ [rehypeKatex] }
    components={ renderer }
  >
    { children }
  </ReactMarkdown>
);
