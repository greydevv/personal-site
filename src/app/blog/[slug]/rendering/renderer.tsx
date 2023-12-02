import Image from "next/image";

import { ExtraProps } from "react-markdown";

import Code from "src/app/blog/[slug]/components/Code";
import { awsUrl } from "src/util";

declare namespace IntrinsicProps {
  type UnorderedListProps = JSX.IntrinsicElements["ul"] & ExtraProps;
  type OrderedListProps = JSX.IntrinsicElements["ol"] & ExtraProps;
  type HeadingThreeProps = JSX.IntrinsicElements["h3"] & ExtraProps;
  type CodeProps = JSX.IntrinsicElements["code"] & ExtraProps;
  type ImageProps = JSX.IntrinsicElements["img"] & ExtraProps;
  type PreProps = JSX.IntrinsicElements["pre"] & ExtraProps;
  type ParagraphProps = JSX.IntrinsicElements["p"] & ExtraProps;
}

const renderer = {
  ol(props: IntrinsicProps.OrderedListProps) {
    return (<ol className="list-decimal ml-4">{ props.children }</ol>);
  },
  ul(props: IntrinsicProps.UnorderedListProps) {
    return (<ul className="list-disc ml-4">{ props.children }</ul>);
  },
  h3(props: IntrinsicProps.HeadingThreeProps) {
    return (<h3 className="mt-4 sm:mt-8">{ props.children }</h3>);
  },
  code(props: IntrinsicProps.CodeProps) {
    const match = /language-(\w+)/.exec(props.className || "");
    return match ? (
      <Code
        language={match[1]}
        code={ props.children as (string | string[]) }
      />
    ) : (
      <code className="px-2 py-[2px] bg-red-10 text-dark font-dm-mono font-medium">
        { props.children }
      </code>
    );
  },
  img(props: IntrinsicProps.ImageProps) {
    const metaWidth = props.alt?.match(/{([^}]+)x/);
    const metaHeight = props.alt?.match(/x([^}]+)}/);
    const width = metaWidth ? Number(metaWidth[1]) : 768;
    const height = metaHeight ? Number(metaHeight[1]) : 432;
    const imgProps = {
      alt: props.alt || "",
      src: awsUrl(`blogs/${props.src}`),
      width: width,
      height: height,
    };
    return (<Image { ...imgProps } />); // eslint-disable-line
  },
  pre(props: IntrinsicProps.PreProps) {
    return (
      <pre className="my-4 text-red-10 p-2 sm:p-4 rounded-sm bg-dark box-border overflow-hidden">
        { props.children }
      </pre>
    );
  },
  p(props: IntrinsicProps.ParagraphProps) {
    return (
      <div className="flex flex-col gap-y-4">
        { separateParagraphs(props) }
      </div>
    );
  },
};

function separateParagraphs(props: IntrinsicProps.ParagraphProps): JSX.Element {
  let elements = [[]];
  // @ts-ignore: Compiler complains props.children is not an array type. 
  for (const el of props.children) {
    const last_idx = elements.length - 1;
    if (el === "\n" && elements[last_idx].length > 0) {
      elements.push([]);
    // @ts-ignore: Compiler complains type does not exist on string type. 
    } else if (el.type === "br") {
      continue;
    } else {
      // @ts-ignore: Compiler complains el is never type. 
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
