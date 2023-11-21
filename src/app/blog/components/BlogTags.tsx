interface BlogTagsProps {
  readonly tags: string[]
}

export default function BlogTags(props: BlogTagsProps) {
  return (
    <div className="flex gap-x-2 text-light">
      { props.tags.map((tag, i) => <p key={ i } className="py-1 px-4 bg-dark font-karla text-base">{ tag.toUpperCase() }</p>)}
    </div>
  );
}
