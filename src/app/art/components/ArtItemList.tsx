import ArtItem, { ArtItemProps } from "./ArtItem";

interface ArtItemListProps {
  items: ArtItemProps[]
}

export default function ArtItemList(props: ArtItemListProps) {
  // Split items into two arrays to render in two columns.
  const firstHalfItems: ArtItemProps[] = [];
  const secondHalfItems: ArtItemProps[] = [];
  const halfIdx = Math.ceil(props.items.length / 2);
  console.log(halfIdx);
  for (const [idx, item] of props.items.entries()) {
    if (idx < halfIdx) {
      firstHalfItems.push(item);
    } else {
      secondHalfItems.push(item);
    }
  }

  // A pinterest-like layout for the items.
  const PinterestCol = (props: { items: ArtItemProps[] }) => {
    return (
      <div className="grid auto-rows-auto grid-cols-1 mb-auto gap-y-8">
        { props.items.map((item, i) =>
          <div key={ i } className={ `row-start-${i+1} row-end-${i+2} flex justify-center`}>
            <ArtItem { ...item } />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mx-auto grid grid-cols-1 auto-rows-auto sm:grid-cols-2 sm:grid-rows-1 gap-y-4 sm:gap-x-16">
      <PinterestCol items={ firstHalfItems } />
      <PinterestCol items={ secondHalfItems } />
    </div>
  );
}
