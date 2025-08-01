import { Suspense } from "react"
import NewsletterContent from "./newsletter-content"

export default function NewsletterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading your personalized newsletter...</p>
          </div>
        </div>
      }
    >
      <NewsletterContent />
    </Suspense>
  )
}
