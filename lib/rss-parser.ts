// Updated RSS Parser using server-side API route
interface RSSPost {
  title: string
  excerpt: string
  content: string
  link: string
  publishedDate: string
  categories: string[]
}

export class RSSParser {
  private feedUrl: string

  constructor(feedUrl: string) {
    this.feedUrl = feedUrl
  }

  async getPosts(): Promise<RSSPost[]> {
    try {
      console.log("🔄 Fetching RSS via server-side API...")

      // Use our Vercel API route instead of direct fetch
      const response = await fetch("/api/rss-feed")

      if (!response.ok) {
        throw new Error(`API route error: ${response.status}`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(`RSS API error: ${data.error}`)
      }

      console.log("✅ RSS data received from API route")
      console.log("Content type:", data.contentType)

      return this.parseRSSXML(data.xmlContent)
    } catch (error) {
      console.error("❌ Error fetching RSS via API:", error)
      return []
    }
  }

  private parseRSSXML(xmlText: string): RSSPost[] {
    try {
      console.log("🔍 Parsing RSS XML...")
      console.log("XML preview:", xmlText.substring(0, 500))

      // Check if we got HTML instead of XML
      if (xmlText.trim().toLowerCase().startsWith("<!doctype html") || xmlText.includes("<html")) {
        throw new Error("Received HTML instead of RSS XML - check if feed URL is correct")
      }

      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(xmlText, "text/xml")

      // Check for parsing errors
      const parserError = xmlDoc.querySelector("parsererror")
      if (parserError) {
        throw new Error("XML parsing error: " + parserError.textContent)
      }

      const items = xmlDoc.querySelectorAll("item")
      console.log(`📄 Found ${items.length} RSS items`)

      if (items.length === 0) {
        console.log("⚠️ No RSS items found. XML structure:")
        console.log(xmlDoc.documentElement?.outerHTML?.substring(0, 1000))
      }

      const posts: RSSPost[] = []

      items.forEach((item, index) => {
        const title = item.querySelector("title")?.textContent || ""
        const link = item.querySelector("link")?.textContent || ""
        const description = item.querySelector("description")?.textContent || ""
        const pubDate = item.querySelector("pubDate")?.textContent || ""

        // Extract categories (WordPress uses <category> tags)
        const categoryElements = item.querySelectorAll("category")
        const categories: string[] = []
        categoryElements.forEach((cat) => {
          const catText = cat.textContent?.trim()
          if (catText) {
            categories.push(catText.toLowerCase())
          }
        })

        console.log(`📄 Post ${index + 1}: "${title}" - Categories: [${categories.join(", ")}]`)

        posts.push({
          title: this.stripHtml(title),
          excerpt: this.stripHtml(description).substring(0, 200) + "...",
          content: this.stripHtml(description),
          link: link,
          publishedDate: pubDate,
          categories: categories,
        })
      })

      console.log(`✅ Parsed ${posts.length} posts successfully`)
      return posts
    } catch (error) {
      console.error("❌ Error parsing RSS XML:", error)
      throw error
    }
  }

  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, "").trim()
  }

  // Filter posts by topics with better matching
  getPostsByTopics(posts: RSSPost[], topics: string[]): RSSPost[] {
    console.log("🎯 Filtering posts by topics:", topics)

    const matchingPosts = posts.filter((post) => {
      const matches = topics.some((topic) => {
        // Check exact match
        const exactMatch = post.categories.includes(topic)
        // Check partial match (e.g., "talent-marketing" matches "talent")
        const partialMatch = post.categories.some((category) => category.includes(topic) || topic.includes(category))

        if (exactMatch || partialMatch) {
          console.log(
            `✅ Post "${post.title}" matches topic "${topic}" via categories: [${post.categories.join(", ")}]`,
          )
          return true
        }
        return false
      })

      return matches
    })

    console.log(`🎯 Found ${matchingPosts.length} matching posts out of ${posts.length} total`)
    return matchingPosts
  }
}

export function createRSSParser(): RSSParser {
  const feedUrl = "https://theassemble.com/feed/"
  return new RSSParser(feedUrl)
}
