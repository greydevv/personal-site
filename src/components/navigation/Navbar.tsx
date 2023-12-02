"use client";

import NavItems from "src/components/navigation/NavItems";

export default function Navbar() {
  return (
    <div className="flex justify-center sm:justify-start border-box gap-x-5 items-center py-8">
      <NavItems />
    </div>
  );
}
