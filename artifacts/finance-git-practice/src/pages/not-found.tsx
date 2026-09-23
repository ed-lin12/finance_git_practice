import * as React from "react"
import { FileQuestion } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex h-[80vh] w-full flex-col items-center justify-center space-y-4 text-center">
      <FileQuestion className="h-16 w-16 text-muted-foreground/50" />
      <h2 className="text-3xl font-bold tracking-tight">Page Not Found</h2>
      <p className="text-muted-foreground">
        The page you are looking for does not exist or has been moved.
      </p>
    </div>
  )
}
