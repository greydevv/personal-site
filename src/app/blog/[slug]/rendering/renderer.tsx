import Image from "next/image"

import Code from "src/app/blog/[slug]/components/Code"
import { awsUrl } from "src/util";

const renderer = {
  ul(props) {
    return <ul className="list-disc ml-4">{ props.children }</ul>
  },
  h3(props) {
    return <h3 className="mt-4 sm:mt-8">{ props.children }</h3>
  },
  code(props) {
    const {children, className, node } = props
    const match = /language-(\w+)/.exec(className || '')
    return match ? (
      <Code
        language={match[1]}
        code={ children }
      />
    ) : (
      <code className="px-2 py-[2px] bg-red-10 text-dark font-dm-mono font-medium">
        { children }
      </code>
    )
  },
  img(props) {
    const metaWidth = props.alt.match(/{([^}]+)x/)
    const metaHeight = props.alt.match(/x([^}]+)}/)
    const width = metaWidth ? metaWidth[1] : "768"
    const height = metaHeight ? metaHeight[1] : "432"
    const imgProps = {
      ...props,
      src: awsUrl(`blogs/${props.src}`),
      width: width,
      height: height,
    };
    return (
      <Image { ...imgProps } />
    );
  },
  pre(props) {
    return (
      <pre className="my-4 text-red-10 p-2 sm:p-4 rounded-sm bg-dark box-border overflow-hidden">
        { props.children }
      </pre>
    );
  },
  p(props) {
    return (
      <div className="flex flex-col gap-y-4">
        { separateParagraphs(props) }
      </div>
    );
  },
};

function separateParagraphs(props) {
  let elements = [[]];
  for (const el of props.children) {
    const last_idx = elements.length - 1;
    if (el === "\n" && elements[last_idx].length > 0) {
      elements.push([]);
    } else if (el.type === "br") {
      continue;
    } else {
      elements[last_idx].push(el);
    }
  }
  return (
    <>
      { elements.map((children, i) => <p key={ i } className="leading-7 font-normal">{ children }</p>) }
    </>
  );
}

export default renderer;
