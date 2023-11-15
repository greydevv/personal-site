"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { makeCls } from "src/util";

interface NavbarProps {
  readonly children: NavItem[]
}

export default function Navbar(props: NavbarProps) {
  return (
    <div className="z-50 left-0 top-0 w-full row-start-1 col-start-1 sticky bg-light w-full">
      <div className="flex justify-center md:justify-start border-box gap-x-5 items-center py-8">
        { props.children }
      </div>
    </div>
  )
}

interface NavbarItemProps {
  readonly labelText: string
  readonly href: string
}

export function NavItem(props: NavbarItemProps) {
  const pathname = usePathname();
  const isActive = pathname === props.href;

  const cls = makeCls("text-lg text-center font-karla",
    [
      [isActive, "text-dark", "text-grey"]
    ]
  );

  return (
    <Link
      href={ props.href }
      className={ cls }
    >
      { props.labelText }
    </Link>
  )
}
