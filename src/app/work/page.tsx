import "server-only";

import gql from "graphql-tag";

import BaseLayout from "src/layouts/base";
import WorkItemList from "src/app/work/components/WorkItemList";
import client from "src/apollo";
import { awsUrl } from "src/util";

export default async function Work() {
  const workItems = parseWorks(await getData());
  return (
    <BaseLayout>
      <div className="mr-auto">
        <WorkItemList workItems={ workItems } />
      </div>
    </BaseLayout>
  );
}

function parseWorks(rawWorks: object[]) {
  const separateIntoYears = (array) => {
    const yearMap = array.reduce((map, obj) => {
      let year = "NOW";
      if (!!obj.year_end) {
        // If it's a finished project, don't add it to the "NOW" section.
        year = obj.year_begin;
      }
      if (!map.has(year)) {
        map.set(year, []);
      }
      map.get(year).push(obj);
      return map;
    }, new Map());
    const sortByPriority = (a, b) => b.priority - a.priority;
    return Array.from(yearMap, ([k, v]) => [k, v.sort(sortByPriority)]).sort().reverse();
  };

  let experience = [];
  let projects = [];
  for (const work of rawWorks) {
    let workItem = {};
    workItem.tags = work.tags;
    workItem.title = work.title;
    workItem.desc = work.desc;
    if (!!work.logo) {
      workItem.logoSrc = awsUrl(`logos/${work.logo}.png`);
    } else if (!!work.github) {
      workItem.logoSrc = "/icons/github.svg";
      workItem.siteHref = work.github;
    }
    if (!!work.site) {
      if (!!!work.logo) {
        workItem.logoSrc = "/icons/url.svg";
      }
      workItem.siteHref = work.site;
    }
    workItem.year_begin = work.interval.year_begin;
    workItem.year_end = work.interval.year_end;
    workItem.priority = work.priority || 0;
    workItem.linkedArticle = work.linkedArticle;

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
