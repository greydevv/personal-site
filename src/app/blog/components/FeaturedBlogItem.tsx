import Link from "next/link";
import Image from "next/image";

import { BlogItemProps } from "src/app/blog/components/BlogItem";
import BoxGraphic from "src/components/BoxGraphic";
import BlogTags from "src/app/blog/components/BlogTags";
import { awsUrl, formatDate } from "src/util";

export default function FeaturedBlogItem(props: BlogItemProps) {
  const linkHref = `/blog/${props.slug}`;
  return (
    <Link href={ linkHref } className="mb-8">
      <div className="cursor-pointer grid md:grid-cols-[1fr_300px] md:grid-rows-1 grid-cols-1 grid-rows-[300px_1fr] gap-x-8 gap-y-8 group">
        <div className="col-start-1 md:row-start-1 row-start-2 py-5 transition-all duration-250 md:group-hover:pl-4">
          <p className="attribute text-grey">
            { formatDate(props.date) }
          </p>
          <h2 className="max-w-lg">
            { props.title }
          </h2>
          <p className="font-light max-w-sm mb-4">
            { props.hook }
          </p>
          { props.tags.length > 0 &&
            <BlogTags tags={ props.tags } />
          }
        </div>
        <BoxGraphic
          className="md:col-start-2 row-start-1 col-start-1 md:aspect-square w-full md:h-auto h-full"
          extraBorderCls="transition-all duration-250 group-hover:left-2 group-hover:top-4"
          extraBackdropCls="transition-all duration-250 group-hover:left-4 group-hover:top-6"
        >
          <div className="relative h-full bg-dark aspect-square mx-auto">
            <Image
              src={ awsUrl(`blogs/${props.slug}.png`) }
              fill
              alt={ props.thumbnailAlt }
            />
          </div>
        </BoxGraphic>
      </div>
    </Link>
  );
}
