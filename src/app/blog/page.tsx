import "server-only";

import gql from "graphql-tag";

import BaseLayout from "src/layouts/base";
import BlogList from "src/app/blog/components/BlogList";
import { BlogItemProps } from "src/app/blog/components/BlogItem";
import client from "src/apollo";
import { awsUrl } from "src/util";

export default async function Blog() {
  const blogs = await getData();

  return (
    <BaseLayout>
      <BlogList blogs={ blogs } />
    </BaseLayout>
  );
}

async function getData() {
  const BLOG_POSTS_QUERY = gql`
    query ($public: Boolean!) {
      blogs (query: { public: $public }) {
        _id
        slug
        title
        hook
        date
        tags
        featured
      }
    }
  `;

  const { error, data } = await client.query({
    query: BLOG_POSTS_QUERY,
    variables: {
      public: true,
    },
  });

  if (error) {
    throw error;
  }
  
  const sortByFeatured = (a: BlogItemProps, b: BlogItemProps): number => {
    // Need to instantiate date again to make compiler happy.
    // See: https://stackoverflow.com/a/52931503/12326283
    const dateComparison = new Date(a.date).getTime() - new Date(b.date).getTime();

    if (dateComparison === 0) {
      if (a.featured && !b.featured) {
        return -1;
      } else if (!a.featured && b.featured) {
        return 1;
      }
    }
    return dateComparison;
  };
  return [...data.blogs].sort(sortByFeatured);
}
