import { notFound } from "next/navigation";

export default function EditPage() {
  if (process.node.env === "production") {
    return notFound()
  }
  return (
    <div className="grid-cols-2">
      <div className="col-start-1 col-end-2">
      </div>
      <div className="col-start-2 col-end-3">
      </div>
    </div>
  )
}
