"use client";

import { useState, useEffect } from "react";

import WorkTab, { Tab } from "src/app/work/components/WorkTab";
import WorkItem, { WorkItemProps } from  "src/app/work/components/WorkItem";

type WorkItemBuckets = [string | number, WorkItem[]][];

interface WorkItemListProps {
  readonly workItems: {experience: WorkItemBuckets, projects: WorkItemBuckets}
}
 
export default function WorkItemList(props: WorkItemListProps) {
  const [items, setItems] = useState<WorkItemListProps.workItems>(props.workItems.experience);
  const [tab, setTab] = useState<Tab>(props.initialTab);

  useEffect(() => {
    if (tab === Tab.Projects) {
      setItems(props.workItems.projects);
    } else {
      setItems(props.workItems.experience);
    }
  }, [tab, props.workItems]);

  return (
    <div>
      <WorkTab
        defaultTab={ Tab.Experience }
        onChangeTab={ (tab) => setTab(tab) }
        workItems={ {} }
      />
      <div className="flex flex-col gap-y-6 sm:gap-y-8">
        { items.map(([year, workItems], i) => {
          return (
            <div className="flex gap-x-4 sm:gap-x-6" key={ i }>
              <div className="border-r-2 border-red-10 w-7 sm:w-9">
                <h2 className="[writing-mode:vertical-rl] block transform text-red-10 rotate-180 text-xl sm:text-3xl">
                  { year }
                </h2>
              </div>
              <div className="flex flex-col gap-y-6 sm:gap-y-8">
                { workItems.map((item, j) => <WorkItem key={ j } { ...item } />) }
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
