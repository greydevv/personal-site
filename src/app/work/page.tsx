import "server-only";

import gql from "graphql-tag";

import { Tab } from "src/app/work/types";
import BaseLayout from "src/layouts/base";
import WorkItemList, { WorkItemBuckets } from "src/app/work/components/WorkItemList";
import { WorkItemProps } from "src/app/work/components/WorkItem";
import client from "src/apollo";
import { awsUrl } from "src/util";

export default async function Work() {
  const workItems = parseWorks(await getData());
  return (
    <BaseLayout>
      <div className="mr-auto">
        <WorkItemList
          initialTab={ Tab.Experience }
          workItems={ workItems }
        />
      </div>
    </BaseLayout>
  );
}

function parseWorks(rawWorks: WorkItemDB[]) {
  const separateIntoYears = (array: WorkItemProps[]): WorkItemBuckets => {
    const yearMap = array.reduce((map, obj) => {
      let year = "NOW";
      if (!!obj.year_end) {
        // If it's a finished project, don't add it to the "NOW" section.
        year = obj.year_begin.toString();
      }
      if (!map.has(year)) {
        map.set(year, []);
      }
      map.get(year)?.push(obj);
      return map;
    }, new Map<string, WorkItemProps[]>());

    const sortByPriority = (a: WorkItemProps, b: WorkItemProps) => b.priority - a.priority;
    return Array.from(yearMap, ([k, v]: [string, WorkItemProps[]]) => [k, v.sort(sortByPriority)]).sort().reverse() as WorkItemBuckets;
  };

  let experience = [];
  let projects = [];
  for (const work of rawWorks) {
    let logoSrc: string | undefined = undefined;
    let siteHref: string | undefined = undefined;
    if (!!work.logo) {
      logoSrc = awsUrl(`logos/${work.logo}.png`);
    } else if (!!work.github) {
      logoSrc = "/icons/github.svg";
      siteHref = `https://www.github.com/${work.github}`;
    }
    if (!!work.site) {
      if (!!!work.logo) {
        logoSrc = "/icons/url.svg";
      }
      siteHref = work.site;
    }

    let workItem: WorkItemProps = {
      tags: work.tags,
      title: work.title,
      desc: work.desc,
      logoSrc: logoSrc,
      siteHref: siteHref,
      year_begin: work.interval.year_begin,
      year_end: work.interval.year_end,
      priority: work.priority || 0,
      linkedArticle: work.linkedArticle,
    };

    if (work.isExperience) {
      experience.push(workItem);
    } else {
      projects.push(workItem);
    }
  }
  return {
    experience: separateIntoYears(experience),
    projects: separateIntoYears(projects)
  };
}

type WorkItemDB = {
  title: string
  logo: string | undefined
  github: string | undefined
  site: string | undefined
  desc: string
  tags: string[]
  isExperience: boolean | undefined
  priority: number | undefined
  linkedArticle: string | undefined
  interval: {
    year_begin: number
    year_end: number | undefined
    month_begin: number
    month_end: number | undefined
  }
};

async function getData() {
  const WORK_QUERY = gql`
    query {
      works {
        _id
        title
        github
        site
        logo
        desc
        tags
        isExperience
        priority
        linkedArticle
        interval {
          year_begin
          year_end
          month_begin
          month_end
        }
      }
    }
  `;
  const { error, data } = await client.query({
    query: WORK_QUERY,
  });

  if (error) {
    throw error;
  }

  return data.works;
}
