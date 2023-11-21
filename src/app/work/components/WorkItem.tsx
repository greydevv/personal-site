import Image from "next/image";
import Link from "next/link";

import { makeCls, awsUrl } from "src/util";

interface WorkItemProps {
  readonly title: string
  readonly description: string
  readonly tags: string[]
  readonly siteHref?: string
  readonly logoSrc?: string
  readonly year_begin: number
  readonly year_end?: number
  readonly priority: number
  readonly linkedArticle?: string
}

export default function WorkItem(props: WorkItemProps) {
  const showTags = props.tags && props.tags.length > 0;
  const hasLink = !!props.siteHref;
  const hasLogoSrc = !!props.logoSrc;
  const hasLinkedArticle = !!props.linkedArticle;
  return (
    <div className="flex flex-col max-w-lg">
      { showTags &&
        <p className="attribute text-grey">
          { props.tags.join(" • ") }
        </p>
      }
      <div className={ makeCls("relative flex gap-x-2 mb-2 mr-auto items-center", [hasLink, "group"])}>
        { hasLogoSrc &&
          <Image
            className="static z-[2] w-6 h-6"
            src={ props.logoSrc }
            width="24"
            height="24"
            alt=""
          />
        }
        <WorkItemLink
          title={ props.title }
          href={ props.siteHref }
        />
        <div className="absolute z-[1] h-2.5 bg-red-10 bottom-1 transition-all duration-300 w-0 group-hover:w-full"/>
      </div>
      <p>
        { props.desc }
        { hasLinkedArticle &&
          <Link
            href={ props.linkedArticle }
            className="text-red-30 font-normal"
            target="_blank"
          >
            &nbsp;Read more.
          </Link>
        }
      </p>
    </div>
  );
}

interface WorkItemLinkProps {
  title: string
  href?: string
}

function WorkItemLink(props: WorkItemLinkProps) {
  if (props.href !== undefined) {
    return (
      <Link
        className="static z-[2]"
        href={ props.href }
        target="_blank"
      >
        <h3>{ props.title }</h3>
      </Link>
    );
  } else {
    return <h3 className="static-z-[2]">{ props.title }</h3>;
  }
}

export { WorkItemProps };
