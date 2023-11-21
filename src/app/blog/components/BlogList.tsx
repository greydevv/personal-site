import "server-only";

import BlogItem, { BlogItemProps } from "src/app/blog/components/BlogItem";
import FeaturedBlogItem from "src/app/blog/components/FeaturedBlogItem";

interface BlogListProps {
  blogs: BlogItemProps[]
}

export default function BlogList(props: BlogListProps) {
  const blogsEmpty = props.blogs.length === 0;
  return (
    <div className="flex flex-col sm:gap-y-8">
      { blogsEmpty
        ? <p>NO BLOGS!</p>
        : props.blogs.map((blogItem, i) =>
            blogItem.featured
              ? <FeaturedBlogItem key={ i } { ...blogItem } />
              : <BlogItem key={ i } { ...blogItem } />
          )
      }
    </div>
  );
}
