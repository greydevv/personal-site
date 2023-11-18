"use client";

import { useState } from "react";

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

  return (
      <div className="flex justify-center sm:justify-start gap-x-8 relative mb-10">
        <button
          onClick={ () => { userClickedTab(Tab.Experience); } }
          disabled={ tab === Tab.Experience }
        >
          <h2 className={ makeCls("", [[tab === Tab.Experience, "pointer-default", "pointer-cursor text-red-20"]]) }>
            { Tab.Experience }
          </h2>
        </button>
        <button
          onClick={ () => { userClickedTab(Tab.Projects); } }
          disabled={ tab === Tab.Projects }
        >
          <h2 className={ makeCls("pointer-events-none", [[tab === Tab.Projects, "pointer-default", "pointer-cursor text-red-20"]]) }>
            { Tab.Projects }
          </h2>
        </button>
      </div>
  );
}

export { Tab };
