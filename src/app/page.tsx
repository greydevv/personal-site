import Image from "next/image";

import BaseLayout from "src/layouts/base";
import BoxGraphic from "src/components/BoxGraphic";
import ContactLinks from "src/components/ContactLinks";
import { PageProps } from "src/types";
import { awsUrl } from "src/util";

export default function Home(props: PageProps) {
  return (
    <BaseLayout>
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_300px] grid-rows-auto sm:grid-rows-1 gap-y-0 gap-x-0 sm:gap-x-8 mb-8 sm:mb-16">
        <div className="row-start-2 sm:row-start-1 col-start-1">
          <h1 className="mb-4 max-w-xl">
            I’m Greyson, an artist and software engineer.
          </h1>
          <p className="mb-4 max-w-sm">
            Hey! I was born in Baltimore, Maryland, and raised in Southern
            York, Pennsylvania. I graduated from Penn State University with a
            bachelor's degree in Computer Sciences and am currently working at
            DraftKings as an iOS engineer. Outside of CS I spend my time playing
            soccer, guitar, cheffing up new recipes, and creating art.
          </p>
          <ContactLinks />
        </div>
        <BoxGraphic className="aspect-[4/5] mb-12 sm:mb-0 row-start-1 sm:col-start-2">
          <Image
            src={ awsUrl("me/me.jpg") }
            alt="Headshot of me"
            fill
            className="object-cover"
          />
        </BoxGraphic>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-[300px_1fr] grid-rows-auto sm:grid-rows-1 gap-y-0 gap-x-0 sm:gap-x-8 mb-8">
        <BoxGraphic
          className="aspect-square mb-12 sm:mb-0"
          left
        >
          <Image
            src={ awsUrl("me/kid_me.jpg") }
            alt="Headshot of a younger me"
            fill
            className="object-cover"
          />
        </BoxGraphic>
        <div>
          <h1 className="mb-4 max-w-xl">
            About Me
          </h1>
          <div className="flex flex-col gap-y-4 max-w-sm">
            <p>
              From a young age, I’ve always been fascinated by art. I spent much
              of my childhood drawing and painting, in and out of art classes.
              There is something about creating something from nothing that
              resonates with me.
            </p>
            <p>
              When I was introduced to my first computer, I was hooked – I
              instantly found ways to combine my love for art and new obsession
              with technology. I spent hours programming simple games
              on Scratch and listing them for others to play.
            </p>
            <p>
              In high school, I picked up 3D modeling and VFX as a hobby.
              Intrigued by the extensibility of Blender, I found myself
              motivated to enhance my experience and began learning Python with
              the intent of developing Blender plugins. For me, that was the
              catalyst into computer science. Since then, computer science has
              become my passion, study, and career.
            </p>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}

