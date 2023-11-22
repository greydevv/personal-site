"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Children } from "src/types";
import { makeCls } from "src/util";

interface NavbarProps {
  readonly children: Children
}

export default function Navbar(props: NavbarProps) {
  return (
    <div className="flex justify-center sm:justify-start border-box gap-x-5 items-center py-8">
      { props.children }
    </div>
  );
}

interface NavbarItemProps {
  readonly labelText: string
  readonly href: string
  readonly graphic: JSX.Element
}

export function NavItem(props: NavbarItemProps) {
  const pathname = usePathname();
  const isActive = pathname === props.href;

  const cls = makeCls("text-lg text-center font-karla",
      [isActive, "text-dark", "text-grey"]
  );

  return (
    <div className="relative">
      <Link
        href={ props.href }
        className={ cls }
      >
        { props.labelText }
      </Link>
      { isActive &&
        props.graphic
      }
    </div>
  );
}
