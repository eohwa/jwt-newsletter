import { Suspense } from "react"
import DebugNewsletterContent from "../newsletter/debug-content"

export default function DebugPage() {
  return (
    <Suspense fallback={<div>Loading debug...</div>}>
      <DebugNewsletterContent />
    </Suspense>
  )
}
