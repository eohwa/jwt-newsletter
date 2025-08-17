"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import jwt from "jsonwebtoken"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { createRSSParser } from "@/lib/rss-parser"

interface UserData {
  sub: string
  first_name: string
  email: string
  topics: string[]
  tier: string
  exp: number
}

interface Story {
  id: string
  title: string
  excerpt: string
  content: string
  topic: string
  link: string
  hasChart?: boolean
  hasPoll?: boolean
  publishedDate: string
}

// Sample chart data
const esgData = [
  { name: "Carbon Reduction", value: 85, target: 90 },
  { name: "Renewable Energy", value: 72, target: 80 },
  { name: "Waste Reduction", value: 68, target: 75 },
  { name: "Water Conservation", value: 91, target: 85 },
]

export default function NewsletterContent() {
  const searchParams = useSearchParams()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [error, setError] = useState<string>("")
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)

  // Topic labels
  const topicLabels: Record<string, string> = {
    "supply-chain": "Supply Chain",
    "talent-marketing": "Talent & Marketing",
    dei: "Diversity & Inclusion",
    esg: "ESG & Sustainability",
  }

  useEffect(() => {
    const token = searchParams.get("token")

    if (!token) {
      setError("No access token provided. Please use a valid newsletter link.")
      setLoading(false)
      return
    }

    try {
      const decoded = jwt.decode(token) as UserData

      if (!decoded) {
        setError("Invalid token format. Please check your newsletter link.")
        setLoading(false)
        return
      }

      if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
        setError("This newsletter link has expired. Please request a new one.")
        setLoading(false)
        return
      }

      setUserData(decoded)
      fetchRSSStories(decoded.topics)

      console.log("Newsletter View:", {
        user: decoded.first_name,
        topics: decoded.topics,
        tier: decoded.tier,
        timestamp: new Date().toISOString(),
      })
    } catch (err) {
      console.error("JWT decode error:", err)
      setError("Invalid or corrupted token. Please check your newsletter link.")
      setLoading(false)
    }
  }, [searchParams])

  const fetchRSSStories = async (topics: string[]) => {
    try {
      console.log("Fetching RSS stories for topics:", topics)

      const rssParser = createRSSParser()
      const allPosts = await rssParser.getPosts()

      console.log(`Fetched ${allPosts.length} total posts from RSS`)

      // Filter posts by user topics
      const matchingPosts = rssParser.getPostsByTopics(allPosts, topics)
      console.log(`Found ${matchingPosts.length} posts matching topics:`, topics)

      // Convert to Story format
      const stories: Story[] = matchingPosts.map((post, index) => ({
        id: `rss-${index}`,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        topic: topics.find((topic) => post.categories.some((cat) => cat.includes(topic))) || topics[0],
        link: post.link,
        hasChart: Math.random() > 0.7,
        hasPoll: Math.random() > 0.6,
        publishedDate: post.publishedDate,
      }))

      setStories(stories)
      setLoading(false)

      console.log(`Displaying ${stories.length} personalized stories`)
    } catch (error) {
      console.error("Error fetching RSS stories:", error)

      // Fallback to sample data
      const sampleStories: Story[] = [
        {
          id: "sample-1",
          title: "RSS Feed Connection Issue",
          excerpt: "Unable to fetch from RSS feed. Check console for details...",
          content: "There was an issue connecting to the RSS feed.",
          topic: topics[0],
          link: "#",
          publishedDate: new Date().toISOString(),
        },
      ]

      setStories(sampleStories)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading your personalized newsletter from RSS feed...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Access Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{error}</p>
            <a href="/" className="text-blue-600 hover:underline">
              Return to homepage
            </a>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="newsletter-gradient text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome back, {userData.first_name}! 👋</h1>
          <p className="text-xl opacity-90">
            Your personalized content for: {userData.topics.map((topic) => topicLabels[topic] || topic).join(" • ")}
          </p>
          <div className="mt-4 text-sm opacity-75">
            {userData.tier} Tier • Expires {new Date(userData.exp * 1000).toLocaleDateString()}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* RSS Connection Status */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
          <h3 className="font-semibold text-green-900 mb-2">📡 RSS Feed Integration</h3>
          <p className="text-green-800 text-sm">
            {stories.length > 0 && !stories[0].id.includes("sample")
              ? `✅ Successfully connected! Showing ${stories.length} posts from theassemble.com RSS feed.`
              : `⚠️ Using sample data. Check console for RSS feed errors.`}
          </p>
        </div>

        {/* Stories by Topic */}
        {userData.topics.map((topic) => {
          const topicStories = stories.filter((story) => story.topic === topic)

          if (topicStories.length === 0) return null

          return (
            <section key={topic} className="mb-12">
              <div className="flex items-center mb-6">
                <span className={`topic-tag ${topic} text-lg font-semibold`}>{topicLabels[topic] || topic}</span>
                <span className="ml-4 text-gray-500">
                  {topicStories.length} {topicStories.length === 1 ? "story" : "stories"}
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {topicStories.map((story) => (
                  <Card key={story.id} className="story-card">
                    <CardHeader>
                      <CardTitle className="text-xl">
                        <a href={story.link} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                          {story.title}
                        </a>
                      </CardTitle>
                      <CardDescription>Published {new Date(story.publishedDate).toLocaleDateString()}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{story.excerpt}</p>

                      {/* Chart Integration */}
                      {story.hasChart && (
                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                          <h4 className="font-semibold mb-3 flex items-center">📊 Data Visualization</h4>
                          <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={esgData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" fontSize={12} />
                              <YAxis />
                              <Tooltip />
                              <Bar dataKey="value" fill="#10b981" />
                              <Bar dataKey="target" fill="#6b7280" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      )}

                      <div className="mt-4">
                        <a
                          href={story.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          Read full article →
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )
        })}

        {/* Footer */}
        <footer className="bg-white rounded-lg p-8 text-center shadow-sm mt-12">
          <h3 className="font-semibold text-lg mb-2">Your Personalized Newsletter</h3>
          <p className="text-gray-600 mb-4">
            Generated for {userData.first_name} • Topics: {userData.topics.join(", ")} • Tier: {userData.tier}
          </p>
          <p className="text-sm text-gray-500">This link expires on {new Date(userData.exp * 1000).toLocaleString()}</p>
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-400">Built with ▲ Vercel • 📡 RSS Feed • 🔐 JWT Authentication</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
