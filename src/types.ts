interface PageProps {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

type Children = JSX.Element | JSX.Element[] | undefined;

export type { PageProps, Children };
