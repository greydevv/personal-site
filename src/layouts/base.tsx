import Navbar, { NavItem } from "src/components/navigation/Navbar";

interface BaseLayoutProps {
  readonly children: ReactNode[]
}

export default function BaseLayout(props: BaseLayoutProps) {
  return (
    <main className="bg-light text-dark font-inter flex justify-center min-h-screen overflow-y-scroll">
      <div className="mx-10 sm:mx-32 mb-10 sm:mb-32 max-w-6xl border-box">
        <div className="grid grid-rows-[auto_1fr] gap-y-6 sm:gap-y-10 md:gap-y-20">
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
          { props.children }
        </div>
      </div>
    </main>
  )
}

