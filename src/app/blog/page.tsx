import "server-only";

import gql from "graphql-tag";

import BaseLayout from "src/layouts/base";
import BlogList from "src/app/blog/components/BlogList";
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
  
  const sortByFeatured = (a, b) => {
    const dateComparison = a.date - b.date;

    if (dateComparison === 0) {
      if (a.featured && !b.featured) {
        return -1;
      } else if (!a.featured && b.featured) {
        return 1;
      }
    } else {
      return dateComparison;
    }
  };
  return [...data.blogs].sort(sortByFeatured);
}
