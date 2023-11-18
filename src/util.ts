import moment from "moment";

const makeCls = (staticCls: string, dynamicCls: [boolean, string, string?][]) => {
  let clsName = staticCls;
  for (var cls of dynamicCls) {
      if (cls[0]) {
        clsName = `${clsName} ${cls[1]}`;
      } else if (cls[2] !== undefined) {
        clsName = `${clsName} ${cls[2]}`;
      }
  }
  return clsName;
};

const awsUrl = (path: string) => {
  const baseUrl = `https://${process.env.NEXT_PUBLIC_S3_ORIGIN}`;
  if (!!path) {
    return `${baseUrl}/${path}`;
  }
  return baseUrl;
};

const formatDate = (date) => {
  return moment(date).format("MMM. DD, YYYY");
}

export {
  makeCls,
  awsUrl,
  formatDate,
};

