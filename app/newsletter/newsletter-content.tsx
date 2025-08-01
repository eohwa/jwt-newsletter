"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import jwt from "jsonwebtoken"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { createWordPressAPI } from "@/lib/wordpress"

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

const deiData = [
  { name: "Leadership", value: 45 },
  { name: "Management", value: 52 },
  { name: "Individual Contributors", value: 48 },
  { name: "New Hires", value: 55 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

export default function NewsletterContent() {
  const searchParams = useSearchParams()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [error, setError] = useState<string>("")
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = searchParams.get("token")

    if (!token) {
      setError("No access token provided. Please use a valid newsletter link.")
      setLoading(false)
      return
    }

    try {
      // In production, verify with the same secret used in generation
      const decoded = jwt.decode(token) as UserData

      if (!decoded) {
        setError("Invalid token format. Please check your newsletter link.")
        setLoading(false)
        return
      }

      // Check expiration
      if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
        setError("This newsletter link has expired. Please request a new one.")
        setLoading(false)
        return
      }

      setUserData(decoded)

      // Fetch stories from WordPress.com
      fetchWordPressStories(decoded.topics)

      // Analytics logging
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

  const fetchWordPressStories = async (topics: string[]) => {
    try {
      const wp = createWordPressAPI()
      const allStories: Story[] = []

      // Fetch posts for each topic
      for (const topic of topics) {
        const posts = await wp.getPostsByTag(topic, 3)

        const topicStories = posts.map((post) => {
          const cleanPost = wp.extractContent(post)
          return {
            id: post.id.toString(),
            title: cleanPost.title,
            excerpt: cleanPost.excerpt || cleanPost.content.substring(0, 200) + "...",
            content: cleanPost.content,
            topic: topic,
            hasChart:
              cleanPost.content.toLowerCase().includes("chart") ||
              cleanPost.content.toLowerCase().includes("data") ||
              Math.random() > 0.7, // Random charts for demo
            hasPoll:
              cleanPost.content.toLowerCase().includes("poll") ||
              cleanPost.content.toLowerCase().includes("survey") ||
              Math.random() > 0.6, // Random polls for demo
            publishedDate: cleanPost.publishedDate,
          }
        })

        allStories.push(...topicStories)
      }

      // Remove duplicates and sort by date
      const uniqueStories = allStories
        .filter((story, index, self) => index === self.findIndex((s) => s.id === story.id))
        .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime())

      setStories(uniqueStories)
      setLoading(false)

      console.log(`Fetched ${uniqueStories.length} stories from WordPress.com`)
    } catch (error) {
      console.error("Error fetching WordPress stories:", error)

      // Fallback to sample data if WordPress fetch fails
      const sampleStories: Story[] = [
        {
          id: "sample-1",
          title: "Sample ESG Story - Connect Your WordPress.com Site",
          excerpt: "This is sample content. Connect your WordPress.com site to see real posts...",
          content:
            "To see your real WordPress.com content here, add your site URL to the environment variables. Create posts with tags 'esg', 'dei', and 'exb' to populate this newsletter.",
          topic: topics.includes("esg") ? "esg" : topics[0],
          hasChart: true,
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
          <p>Loading your personalized newsletter from WordPress.com...</p>
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

  const topicLabels: Record<string, string> = {
    esg: "ESG & Sustainability",
    dei: "Diversity & Inclusion",
    "social-media": "Social Media & Digital",
    senior: "Senior Leadership",
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
        {/* Premium Block for Gold tier */}
        {userData.tier === "Gold" && (
          <div className="premium-block mb-8">
            <div className="inline-block bg-yellow-800 text-yellow-100 px-4 py-2 rounded-full text-sm font-bold mb-4">
              🌟 GOLD MEMBER
            </div>
            <h2 className="text-2xl font-bold mb-2">Exclusive Premium Content</h2>
            <p className="text-lg">
              As a Gold member, you have access to exclusive insights, detailed analytics, and premium research reports.
            </p>
          </div>
        )}

        {/* WordPress.com Connection Status */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <h3 className="font-semibold text-blue-900 mb-2">📝 WordPress.com Integration</h3>
          <p className="text-blue-800 text-sm">
            {stories.length > 0 && !stories[0].id.includes("sample")
              ? `✅ Successfully connected! Showing ${stories.length} posts from your WordPress.com site.`
              : `⚠️ Using sample data. Set WORDPRESS_SITE_URL environment variable to connect your WordPress.com site.`}
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
                      <CardTitle className="text-xl">{story.title}</CardTitle>
                      <CardDescription>Published {new Date(story.publishedDate).toLocaleDateString()}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{story.excerpt}</p>

                      {/* Chart Integration */}
                      {story.hasChart && (
                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                          <h4 className="font-semibold mb-3 flex items-center">📊 Data Visualization</h4>
                          {topic === "esg" && (
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
                          )}
                          {topic === "dei" && (
                            <ResponsiveContainer width="100%" height={200}>
                              <PieChart>
                                <Pie
                                  data={deiData}
                                  cx="50%"
                                  cy="50%"
                                  outerRadius={80}
                                  fill="#8884d8"
                                  dataKey="value"
                                  label
                                >
                                  {deiData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                                </Pie>
                                <Tooltip />
                              </PieChart>
                            </ResponsiveContainer>
                          )}
                          {topic === "social-media" && (
                            <ResponsiveContainer width="100%" height={200}>
                              <BarChart
                                data={[
                                  { name: "LinkedIn", engagement: 85, reach: 120 },
                                  { name: "Twitter", engagement: 92, reach: 180 },
                                  { name: "Instagram", engagement: 78, reach: 95 },
                                  { name: "Facebook", engagement: 65, reach: 140 },
                                ]}
                              >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="engagement" fill="#3b82f6" />
                                <Bar dataKey="reach" fill="#8b5cf6" />
                              </BarChart>
                            </ResponsiveContainer>
                          )}
                          {topic === "senior" && (
                            <ResponsiveContainer width="100%" height={200}>
                              <BarChart
                                data={[
                                  { name: "Strategy", importance: 95, satisfaction: 78 },
                                  { name: "Operations", importance: 88, satisfaction: 82 },
                                  { name: "Innovation", importance: 92, satisfaction: 71 },
                                  { name: "Culture", importance: 85, satisfaction: 79 },
                                ]}
                              >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="importance" fill="#f59e0b" />
                                <Bar dataKey="satisfaction" fill="#10b981" />
                              </BarChart>
                            </ResponsiveContainer>
                          )}
                        </div>
                      )}

                      {/* Poll Integration */}
                      {story.hasPoll && (
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-3 flex items-center">📋 Quick Poll</h4>
                          <div className="space-y-3">
                            <p className="font-medium">How important is this topic to your organization?</p>
                            <div className="space-y-2">
                              <label className="flex items-center space-x-2">
                                <input type="radio" name={`poll-${story.id}`} className="text-blue-600" />
                                <span>Very Important</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="radio" name={`poll-${story.id}`} className="text-blue-600" />
                                <span>Somewhat Important</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input type="radio" name={`poll-${story.id}`} className="text-blue-600" />
                                <span>Not Important</span>
                              </label>
                            </div>
                            <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
                              Submit Response
                            </button>
                          </div>
                        </div>
                      )}
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
            <p className="text-xs text-gray-400">Built with ▲ Vercel • 📝 WordPress.com • 🔐 JWT Authentication</p>
          </div>
        </footer>
      </div>

      {/* Analytics Script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Track story views
            document.addEventListener('DOMContentLoaded', function() {
              const storyCards = document.querySelectorAll('.story-card');
              console.log('Displaying ' + storyCards.length + ' personalized stories from WordPress.com');
              
              const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                  if (entry.isIntersecting) {
                    const title = entry.target.querySelector('h3')?.textContent;
                    console.log('Story viewed:', title);
                  }
                });
              });
              
              storyCards.forEach(card => observer.observe(card));
            });
          `,
        }}
      />
    </div>
  )
}
