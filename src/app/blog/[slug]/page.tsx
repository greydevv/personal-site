import "server-only";

import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

import gql from "graphql-tag";

import BaseLayout from "src/layouts/base";
import BlogTags from "src/app/blog/components/BlogTags";
import BlogBody from "src/app/blog/[slug]/components/BlogBody";
import client from "src/apollo";
import { formatDate } from "src/util";

interface BlogPostProps {
  readonly params: object
  readonly searchParams: object
}

export default async function BlogPost(serverProps: BlogPostProps) {
  const props = await getData(serverProps.params.slug);
  if (!props) {
    return notFound();
  }

  return (
    <div className="mb-8 sm:mb-16">
      <div className="mb-4 sm:mb-10 bg-red-10 pb-4 pt-10 sm:py-10">
        <div className="max-w-[700px] mx-auto px-4">
          <Link href="/blog">
            <Image
              src="/icons/back_arrow.svg"
              alt="Back arrow"
              height="13"
              width="26"
            />
          </Link>
          <div className="mb-4 mt-4">
            <h1 className="text-4xl sm:text-5xl font-semibold">
              { props.title }
            </h1>
            <p className="attribute text-red">
              { formatDate(props.date) }
            </p>
          </div>
          <BlogTags tags={ props.tags } />
        </div>
      </div>
      <div className="max-w-[700px] mx-auto px-4">
        <BlogBody rawMarkdown={ props.body.replace("\\n", "  \n") }/>
        <div className="relative h-16 sm:h-20 aspect-[20/9] mx-auto mt-10 sm:mt-20">
          <Image
            src="/signature.svg"
            alt=""
            fill
          />
        </div>
      </div>
    </div>
  );
}

async function getData(slug: string): BlogPostProps {
  const BLOG_POST_QUERY = gql`
    query ($slug: String!, $public: Boolean!)  {
      blog (query: { slug: $slug, public: $public } ) {
        _id
        title
        body
        date
        public
        tags
      }
    }
  `;
  const { error, data } = await client.query({
    query: BLOG_POST_QUERY,
    variables: {
      slug: slug,
      public: true,
    },
  });

  if (error) {
    throw error;
  }

  if (!data.blog) {
    return null;
  }

  return {
    ...data.blog,
    body: data.blog.body.replace(/\\n/g, "  \n")
  };
}
