import Navbar, { NavItem } from "src/components/navigation/Navbar";

interface BaseLayoutProps {
  readonly children: ReactNode[]
}

export default function BaseLayout(props: BaseLayoutProps) {
  return (
    <main className="bg-light text-dark font-inter flex justify-center min-h-screen w-screen">
      <div className="grid grid-rows-[auto_1fr] gap-y-6 sm:gap-y-10 md:gap-y-20">
        <div className="w-screen border-box px-10 sm:px-32 sticky left-0 top-0 z-50 row-start-1 bg-light">
          <div className="max-w-4xl mx-auto">
            <Navbar>
              <NavItem
                labelText="about"
                href="/"
              />
              <NavItem
                labelText="work"
                href="/work"
              />
              <NavItem
                labelText="blog"
                href="/blog"
              />
            </Navbar>
          </div>
        </div>
        <div className="px-10 sm:px-32">
          <div className="max-w-4xl mx-auto row-start-2 mb-10 sm:mb-32">
            { props.children }
          </div>
        </div>
      </div>
    </main>
  );
}
