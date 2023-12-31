import moment from "moment";

const makeCls = (staticCls: string, ...dynamicCls: [boolean | undefined | null, string, string?][]): string => {
  let clsName = staticCls;
  for (var cls of dynamicCls) {
      if (cls[0]) {
        clsName = `${clsName} ${cls[1]}`;
      } else if (!!cls[2]) {
        clsName = `${clsName} ${cls[2]}`;
      }
  }
  return clsName;
};

const awsUrl = (path: string): string => {
  const baseUrl = `https://${process.env.NEXT_PUBLIC_S3_ORIGIN}`;
  if (!!path) {
    if (process.env.NODE_ENV === "development") {
      // Trick to get around Next.js image cache (not used in production).
      return `${baseUrl}/${path}?${new Date().getTime()}`;
    }
    return `${baseUrl}/${path}`;
  }
  return baseUrl;
};

const formatDate = (date: Date): string => {
  return moment(date).format("MMM. DD, YYYY");
};

export {
  makeCls,
  awsUrl,
  formatDate,
};

