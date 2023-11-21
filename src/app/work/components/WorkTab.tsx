"use client";

import { useState } from "react";
import Image from "next/image";

import { makeCls } from "src/util";

enum Tab {
  Experience = "EXPERIENCE",
  Projects = "PROJECTS",
}

interface WorkTabProps {
  readonly defaultTab: Tab
  readonly onChangeTab: (tab: Tab) => void
}

export default function WorkTab(props: WorkTabProps) {
  const [tab, setTab] = useState<Tab>(props.defaultTab);

  const userClickedTab = (tab: Tab) => {
    setTab(tab);
    props.onChangeTab(tab);
  };

  interface TabIconProps { iconSrc: string }

  const TabIcon = (props: TabIconProps) => {
    return (
        <div className="absolute -left-4 -bottom-2 w-12 h-10 sm:h-12 z-[1]">
          <Image
            src={ props.iconSrc }
            alt=""
            className="relative"
            fill
          />
        </div>
    );
  };

  return (
      <div className="flex justify-center sm:justify-start gap-x-8 mb-10">
        <div className="relative">
          <button
            className="relative z-[2]"
            onClick={ () => { userClickedTab(Tab.Experience); } }
            disabled={ tab === Tab.Experience }
          >
            <h2 className={ makeCls("pointer-events-none", [tab === Tab.Experience, "pointer-default", "pointer-cursor text-red-20"]) }>
              { Tab.Experience }
            </h2>
          </button>
          { tab === Tab.Experience &&
            <TabIcon iconSrc={ "/icons/bookmark.svg" } />
          }
        </div>
        <div className="relative">
          <button
            className="relative z-[2]"
            onClick={ () => { userClickedTab(Tab.Projects); } }
            disabled={ tab === Tab.Projects }
          >
            <h2 className={ makeCls("pointer-events-none", [tab === Tab.Projects, "pointer-default", "pointer-cursor text-red-20"]) }>
              { Tab.Projects }
            </h2>
          </button>
          { tab === Tab.Projects &&
            <TabIcon iconSrc={ "/icons/document.svg" } />
          }
        </div>
      </div>
  );
}

export { Tab };
