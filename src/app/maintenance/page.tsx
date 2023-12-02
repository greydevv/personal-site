import Image from "next/image";

import BaseLayout from "src/layouts/base";
import ContactLinks from "src/components/ContactLinks";
import type { PageProps } from "src/types";

export default function MaintenancePage(props: PageProps) {
  return (
    <main className="bg-light text-dark font-inter flex justify-center h-screen w-screen">
      <div className="px-10 sm:px-32 flex flex-col justify-center gap-y-4">
        <h1 className="max-w-md">
          This site is currently under maintenance!
        </h1>
        <p className="max-w-sm">
          I apologize for the inconvenience - please check back again later!
          In the meantime, feel free to reach out using any of the contact links below.
        </p>
        <div className="flex items-center justify-between max-w-md">
          <ContactLinks />
          <div className="relative h-8 sm:h-16 aspect-[20/9] kt-10">
            <Image
              src="/signature.svg"
              alt=""
              fill
            />
          </div>
        </div>
      </div>
    </main>
  );
}
