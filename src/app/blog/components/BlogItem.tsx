import Link from "next/link";

import BlogTags from "src/app/blog/components/BlogTags";
import { formatDate } from "src/util";

interface BlogItemProps {
  readonly title: string
  readonly date: Date
  readonly slug: string
  readonly hook: string
  readonly tags: string[]
  readonly featured: boolean
  readonly thumbnailSrc?: string
  readonly thumbnailAlt?: string
}

export default function BlogItem(props: BlogItemProps) {
  const linkHref = `/blog/${props.slug}`;

  return (
    <Link href={ linkHref }>
      <div className="group cursor-pointer border border-red-10 px-4 py-2 sm:p-6 transition-all ease-in-out duration-250 md:hover:pl-12 hover:bg-red-10">
        <div>
          <p className="attribute text-grey group-hover:text-red transition-all ease-in-out duration-250">
            { formatDate(props.date) }
          </p>
          <h3>
            { props.title }
          </h3>
        </div>
        <p className="font-light max-w-xl mb-3">
          { props.hook }
        </p>
        { props.tags.length > 0 &&
          <div className="col-start-1 row-start-1 row-end-3 flex gap-x-2 mt-4">
            <BlogTags tags={ props.tags } />
          </div>
        }
      </div>
    </Link>
  );
}

export type { BlogItemProps };
