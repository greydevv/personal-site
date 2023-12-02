import Image from "next/image";

import NavItems from "src/components/navigation/NavItems";
import { awsUrl } from "src/util";

export default function NotFound() {
  return (
    <main className="w-screen h-screen bg-gradient-to-br from-red-10 from-20% to-light to-50%">
      <div className="w-full h-full flex flex-col items-center justify-center">
        <div className="relative aspect-[5/4] w-[300px]">
          <Image
            src={ awsUrl("404.png") }
            alt="404 with an eye as the zero."
            fill
          />
        </div>
        <p className="max-w-sm font-normal">
          Looking for one of these?
        </p>
        <div className="w-full flex justify-center items-center gap-x-5 py-4">
          <NavItems />
        </div>
      </div>
    </main>
  );
}
