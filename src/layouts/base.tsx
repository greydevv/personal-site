import Navbar from "src/components/navigation/Navbar";
import { Children } from "src/types";
import { makeCls } from "src/util";

interface BaseLayoutProps {
  readonly hideNavbar?: boolean
  readonly children: Children
}

export default function BaseLayout(props: BaseLayoutProps) {
  const showNavbar = !!!props.hideNavbar;
  return (
    <main className="bg-light text-dark font-inter flex justify-center min-h-screen w-full">
      <div className="grid grid-rows-[auto_1fr] gap-y-6 sm:gap-y-10 md:gap-y-20 w-full">
        { showNavbar &&
          <div className="w-full border-box px-10 sm:px-32 sticky left-0 top-0 z-50 row-start-1 bg-light">
            <div className="max-w-4xl mx-auto">
              <Navbar />
            </div>
          </div>
        }
        <div className="px-10 sm:px-32">
          <div className={ makeCls("max-w-4xl mx-auto row-start-2 mb-10 sm:mb-32", [!showNavbar, "mt-10 sm:mt-32"]) }>
            { props.children }
          </div>
        </div>
      </div>
    </main>
  );
}
