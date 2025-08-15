import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getUserProfiles, getAvailableTags } from "@/lib/config"

export default function HomePage() {
  const userProfiles = getUserProfiles()
  const availableTags = getAvailableTags()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Personalized Newsletter Demo</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience personalized content delivery using JWT-based magic links. Built with free online services:
            Vercel + WordPress.com + Environment Variables.
          </p>
        </div>

        {/* Available Tags */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-center mb-6">📋 Available Topics</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {availableTags.map((tag) => (
              <span key={tag.slug} className={`topic-tag ${tag.slug}`}>
                {tag.label}
              </span>
            ))}
          </div>
        </div>

        {/* User Profiles */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {userProfiles.map((profile) => (
            <Card key={profile.key}>
              <CardHeader>
                <CardTitle>👤 {profile.name}</CardTitle>
                <CardDescription>
                  {profile.tier} Tier {profile.tier === "Gold" && "⭐"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Topics:{" "}
                  {profile.topics
                    .map((topic) => availableTags.find((t) => t.slug === topic)?.label || topic)
                    .join(", ")}
                </p>
                <div className="space-y-2">
                  {profile.topics.map((topic) => (
                    <div key={topic} className={`topic-tag ${topic}`}>
                      {availableTags.find((t) => t.slug === topic)?.label || topic}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="bg-white rounded-lg p-8 max-w-2xl mx-auto shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">🚀 How to Generate Links</h2>
            <div className="text-left space-y-4">
              <div className="bg-gray-100 p-4 rounded font-mono text-sm">
                {userProfiles.map((profile) => (
                  <div key={profile.key} className="mb-2">
                    <div># Generate link for {profile.name}</div>
                    <div>node scripts/generate-link.js {profile.key} https://your-app.vercel.app</div>
                    <br />
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-600">
                Replace <code>your-app.vercel.app</code> with your actual Vercel deployment URL.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold mb-8">⚙️ Configuration via Environment Variables</h2>
          <div className="bg-white p-6 rounded-lg shadow-sm max-w-4xl mx-auto">
            <p className="text-gray-600 mb-4">
              Tags and users are now configurable via environment variables in your Vercel dashboard!
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">🏷️ NEWSLETTER_TAGS</h3>
                <p className="text-gray-600 text-sm">Configure available topic tags</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">👥 NEWSLETTER_USERS</h3>
                <p className="text-gray-600 text-sm">Configure user profiles and their topics</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
