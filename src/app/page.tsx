import Image from "next/image";
import Link from "next/link";

import BaseLayout from "src/layouts/base";
import BoxGraphic from "src/components/BoxGraphic";
import { awsUrl } from "src/util";

export default function Home() {
  return (
    <BaseLayout>
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_300px] grid-rows-auto sm:grid-rows-1 gap-y-0 gap-x-0 sm:gap-x-8 mb-8 sm:mb-16">
        <div className="row-start-2 sm:row-start-1 col-start-1">
          <h1 className="mb-4 max-w-xl">
            I’m Greyson, an artist and computer science student. 
          </h1>
          <p className="max-w-sm mb-4">
            Hey! I was born in Baltimore, Maryland, and raised in Southern
            York, Pennsylvania. I’m currently a senior pursuing a degree in
            computer science at Penn State University. Outside of CS I spend my
            time playing soccer, cheffing up new recipes, and creating art.
          </p>
          <div className="flex gap-x-2">
            <ContactIcon
              name="linkedin"
              href="https://www.linkedin.com/in/greyson-murray/"
            />
            <ContactIcon
              name="github"
              href="https://github.com/greydevv"
            />
            <ContactIcon
              name="stackoverflow"
              href="https://stackoverflow.com/users/12326283/gmdev"
            />
            <ContactIcon
              name="mail"
              href="mailto:greyson.murray@gmail.com"
            />
          </div>
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
            alt="Headshot of younger me"
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
              with technology. Hours were spent programming simple video games on
              Scratch and listing them publicly for others to play.
            </p>
            <p>
              In high school, I picked up 3D modeling and VFX in Blender.
              Intrigued by the extensibility of Blender, I found myself motivated
              to enhance my experience and began learning Python with the intent
              of developing Blender plugins. For me, that was the catalyst into
              computer science. Since then, computer science has become my
              passion, study, and career.
            </p>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}

interface ContactIconProps {
  readonly name: string
  readonly href: string
}

function ContactIcon(props: ContactIconProps) {
  return (
    <Link href={ props.href } target="_blank">
      <Image
        src={ `/icons/${props.name}.svg` }
        height="24"
        width="24"
        alt={ `Icon for ${props.name}` }
      />
    </Link>
  );
}
