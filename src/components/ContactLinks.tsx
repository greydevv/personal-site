import Image from "next/image";
import Link from "next/link";

export default function ContactLinks() {
  return (
    <div className="flex gap-x-2">
      <ContactIcon
        name="mail"
        href="mailto:greyson.murray@gmail.com"
      />
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
    </div>
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
        alt=""
        height="24"
        width="24"
      />
    </Link>
  );
}
