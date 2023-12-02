import "server-only";

import gql from "graphql-tag";

import BaseLayout from "src/layouts/base";
import { PageProps } from "src/types";
import ArtItemList from "src/app/art/components/ArtItemList";
import client from "src/apollo";

export default async function Art(props: PageProps) {
  const artItems = await getData();
  return (
      <BaseLayout>
        <div className="mb-16">
          <h1 className="mb-4 max-w-xl">
            Art
          </h1>
          <div className="flex flex-col gap-y-4 max-w-xl">
            <p>
              This page is dedicated to some of the art pieces I’ve created
              throughout the years. My primary mediums are pencil/pen & ink on
              paper and acrylic on canvas. I’ll also find myself working in
              graphic design here and there. As I gather some more pictures of
              previous works, I’ll throw em’ into this page.
            </p>
            <p>
              Please enjoy :)
            </p>
          </div>
        </div>
        <ArtItemList items={ artItems } />
      </BaseLayout>
  );
} 

async function getData() {
  const ART_QUERY = gql`
    query {
      arts {
        _id
        title
        thumbnailSrc
        thumbnailAlt
        date
        stats {
          hours
          medium
        }
      }
    }
  `;

  const { error, data } = await client.query({
    query: ART_QUERY,
  });

  if (error) {
    throw error;
  }

  const sortByDate = (a: { date: Date }, b: { date: Date }) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  };
  return [...data.arts].sort(sortByDate);
}
