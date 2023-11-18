import Link from "next/link";

import BlogTags from "src/app/blog/components/BlogTags";
import { formatDate } from "src/util";

interface BlogItemProps {
  title: string
  date: Date
  slug: string
  hook: string
  tags: string[]
  featured: boolean
  thumbnailSrc?: string
}

export default function BlogItem(props: BlogItemProps) {
  const linkHref = `/blog/${props.slug}`

  return (
    <Link href={ linkHref }>
      <div className="group cursor-pointer border border-red-10 p-6 transition-all ease-in-out duration-250 md:hover:pl-12 hover:bg-red-10">
        <div className="flex md:flex-col justify-between md:start-center">
          <p className="text-grey text-base font-karla group-hover:text-red-30 transition-all ease-in-out duration-250">
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

export { BlogItemProps };
