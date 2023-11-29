import Image from "next/image";

import moment from "moment";

import { awsUrl } from "src/util";

export interface ArtItemProps {
  title: string
  date: Date
  thumbnailSrc: string
  thumbnailAlt: string
  stats: {
    hours?: number
    medium: string
  }
}

export default function ArtItem(props: ArtItemProps) {
  const formatApproxDate = (date: Date): string => {
    return moment(date).format("MMMM YYYY");
  };

  return (
    // <div className="grid grid-rows-[auto_auto] sm:grid-rows-1 grid-cols-1 sm:grid-cols-[300px_1fr] sm:gap-x-8 gap-y-2">
    <div className="flex flex-col gap-y-2 w-full">
      <Image
        className="row-start-1 col-start-1 h-auto w-auto"
        src={ awsUrl(`art/${props.thumbnailSrc}`) }
        alt={ props.thumbnailAlt }
        width={ 432 }
        height={ 768 }
      />
      <div className="sm:mt-auto row-start-2 sm:row-start-1">
        <p className="attribute text-grey">
          { formatApproxDate(props.date) }
        </p>
        <h2>{ props.title }</h2>
        <p>
          { props.stats.medium }
        </p>
      </div>
    </div>
  );
}
