"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import jwt from "jsonwebtoken"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface UserData {
  sub: string
  first_name: string
  email: string
  topics: string[]
  tier: string
  exp: number
}

export default function DebugNewsletterContent() {
  const searchParams = useSearchParams()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [debugInfo, setDebugInfo] = useState<string[]>([])
  const [apiResponse, setApiResponse] = useState<any>(null)

  const addDebugLog = (message: string) => {
    console.log(message)
    setDebugInfo((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  useEffect(() => {
    const token = searchParams.get("token")

    if (!token) {
      addDebugLog("❌ No token provided")
      return
    }

    try {
      const decoded = jwt.decode(token) as UserData
      addDebugLog(`✅ JWT decoded successfully for user: ${decoded.first_name}`)
      addDebugLog(`📋 Topics: ${decoded.topics.join(", ")}`)
      setUserData(decoded)

      // Test WordPress API
      testWordPressAPI(decoded.topics)
    } catch (err) {
      addDebugLog(`❌ JWT decode error: ${err}`)
    }
  }, [searchParams])

  const testWordPressAPI = async (topics: string[]) => {
    const siteUrl = "theassemble.com"
    addDebugLog(`🔍 Testing WordPress API for: ${siteUrl}`)

    // Test basic posts endpoint
    const postsUrl = `https://${siteUrl}/wp-json/wp/v2/posts?_embed=wp:term&per_page=5`
    addDebugLog(`📡 Fetching: ${postsUrl}`)

    try {
      const response = await fetch(postsUrl)
      addDebugLog(`📊 Response status: ${response.status}`)

      if (!response.ok) {
        addDebugLog(`❌ API Error: ${response.status} ${response.statusText}`)
        return
      }

      const posts = await response.json()
      addDebugLog(`✅ Fetched ${posts.length} posts`)
      setApiResponse(posts)

      // Check tags in posts
      posts.forEach((post: any, index: number) => {
        if (post._embedded && post._embedded["wp:term"]) {
          const tags = post._embedded["wp:term"].flat().map((term: any) => term.slug)
          addDebugLog(`📄 Post ${index + 1}: "${post.title.rendered}" - Tags: [${tags.join(", ")}]`)
        } else {
          addDebugLog(`📄 Post ${index + 1}: "${post.title.rendered}" - No tags found`)
        }
      })

      // Check if any posts match user topics
      const matchingPosts = posts.filter((post: any) => {
        if (!post._embedded || !post._embedded["wp:term"]) return false
        const postTags = post._embedded["wp:term"].flat().map((term: any) => term.slug)
        return topics.some((topic) => postTags.includes(topic))
      })

      addDebugLog(`🎯 Found ${matchingPosts.length} posts matching topics: [${topics.join(", ")}]`)
    } catch (error) {
      addDebugLog(`❌ Fetch error: ${error}`)
    }
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <Card>
          <CardHeader>
            <CardTitle>🔍 Newsletter Debug Mode</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {debugInfo.map((log, index) => (
                <div key={index} className="text-sm font-mono bg-gray-100 p-2 rounded">
                  {log}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* User Info */}
        <Card>
          <CardHeader>
            <CardTitle>👤 User Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              <strong>Name:</strong> {userData.first_name}
            </p>
            <p>
              <strong>Email:</strong> {userData.email}
            </p>
            <p>
              <strong>Topics:</strong> {userData.topics.join(", ")}
            </p>
            <p>
              <strong>Tier:</strong> {userData.tier}
            </p>
          </CardContent>
        </Card>

        {/* Debug Logs */}
        <Card>
          <CardHeader>
            <CardTitle>🔍 Debug Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {debugInfo.map((log, index) => (
                <div key={index} className="text-sm font-mono bg-gray-100 p-2 rounded">
                  {log}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* API Response */}
        {apiResponse && (
          <Card>
            <CardHeader>
              <CardTitle>📡 WordPress API Response</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto max-h-96">
                {JSON.stringify(apiResponse, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
