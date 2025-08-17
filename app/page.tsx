import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getUserProfiles, getAvailableTags } from "@/lib/config"
import { TopicTag } from "@/components/topic-tag"

export default async function HomePage() {
  const userProfiles = await getUserProfiles()
  const availableTags = await getAvailableTags()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Personalized Newsletter Demo</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience personalized content delivery using JWT-based magic links. Powered by your Google Sheet +
            WordPress.com + Vercel.
          </p>
        </div>

        {/* Available Tags with Hex Colors */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-center mb-6">📋 Available Topics</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {availableTags.map((tag) => (
              <TopicTag key={tag.slug} slug={tag.slug}>
                {tag.label}
              </TopicTag>
            ))}
          </div>
        </div>

        {/* User Profiles from Google Sheet */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {userProfiles.map((profile) => (
            <Card key={profile.key}>
              <CardHeader>
                <CardTitle>👤 {profile.name}</CardTitle>
                <CardDescription>
                  {profile.email} • {profile.tier} Tier
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">Topics: {profile.topics.join(", ")}</p>
                <div className="flex flex-wrap gap-2">
                  {profile.topics.map((topic) => (
                    <TopicTag key={topic} slug={topic}>
                      {availableTags.find((t) => t.slug.toLowerCase() === topic.toLowerCase())?.label || topic}
                    </TopicTag>
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
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold mb-8">🎨 Custom Color Palette</h2>
          <div className="bg-white p-6 rounded-lg shadow-sm max-w-4xl mx-auto">
            <p className="text-gray-600 mb-6">Your beautiful hex color palette from Google Sheets:</p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {availableTags.map((tag) => (
                <div key={tag.slug} className="text-center">
                  <div
                    className="w-full h-16 rounded-lg mb-2 flex items-center justify-center text-white font-medium text-sm"
                    style={{ backgroundColor: tag.color }}
                  >
                    {tag.label}
                  </div>
                  <div className="text-xs text-gray-500">{tag.color}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
