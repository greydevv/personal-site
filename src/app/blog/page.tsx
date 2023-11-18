import "server-only";

import BaseLayout from "src/layouts/base";
import BlogList from "src/app/blog/components/BlogList";
import { awsUrl } from "src/util";

export default function Blog() {
  const blogs = [
    {
      title: "Test Post 1",
      date: new Date(),
      slug: "test-post-1",
      hook: "Here's the hook!",
      tags: ["Tag 1", "Tag 2"],
      featured: true,
      thumbnailSrc: awsUrl("me/me_kid.jpg"),
    },
    {
      title: "Test Post 2",
      date: new Date(),
      slug: "test-post-2",
      hook: "Here's the hook!",
      tags: ["Tag 3"],
      featured: false,
    }
  ];

  return (
    <BaseLayout>
      <BlogList blogs={ blogs } />
    </BaseLayout>
  );
}
