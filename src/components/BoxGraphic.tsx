import { makeCls } from "src/util";

interface BoxGraphicProps {
  readonly leftAlign: boolean
  readonly className: string
  readonly children: ReactNode[]
  readonly extraBorderCls: boolean
  readonly extraBackdropCls: boolean
}

export default function BoxGraphic(props: BoxGraphicProps) {
  const borderCls = makeCls(
    "z-[-1] absolute w-full h-full border border-red top-5 pointer-events-none",
    [props.left, "right-5", "left-5"],
    [!!props.extraBorderCls, props.extraBorderCls]
  );

  const backdropCls = makeCls(
    "z-[-2] absolute w-full h-full bg-red-10 top-8 pointer-events-none",
    [props.left, "right-8", "left-8"],
    [!!props.extraBackdropCls, props.extraBackdropCls]
  );

  return (
    <div className={ `z-[1] relative ${props.className}` }>
      <div className="w-full h-full bg-dark">
        { props.children }
      </div>
      <div className={ borderCls } />
      <div className={ backdropCls } />
    </div>
  );
}
