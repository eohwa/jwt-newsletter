// Updated RSS Feed Parser with multiple fallback methods
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
    // Try multiple methods to fetch the RSS feed
    const methods = [() => this.fetchWithAllOrigins(), () => this.fetchWithCorsAnywhere(), () => this.fetchDirect()]

    for (const method of methods) {
      try {
        const posts = await method()
        if (posts.length > 0) {
          console.log(`✅ RSS fetch successful with method`)
          return posts
        }
      } catch (error) {
        console.log(`❌ RSS fetch method failed:`, error)
        continue
      }
    }

    console.error("❌ All RSS fetch methods failed")
    return []
  }

  private async fetchWithAllOrigins(): Promise<RSSPost[]> {
    console.log("🔄 Trying AllOrigins proxy...")
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(this.feedUrl)}`
    const response = await fetch(proxyUrl)

    if (!response.ok) {
      throw new Error(`AllOrigins error: ${response.status}`)
    }

    const data = await response.json()
    return this.parseRSSXML(data.contents)
  }

  private async fetchWithCorsAnywhere(): Promise<RSSPost[]> {
    console.log("🔄 Trying CORS Anywhere proxy...")
    const proxyUrl = `https://cors-anywhere.herokuapp.com/${this.feedUrl}`
    const response = await fetch(proxyUrl)

    if (!response.ok) {
      throw new Error(`CORS Anywhere error: ${response.status}`)
    }

    const xmlText = await response.text()
    return this.parseRSSXML(xmlText)
  }

  private async fetchDirect(): Promise<RSSPost[]> {
    console.log("🔄 Trying direct fetch...")
    const response = await fetch(this.feedUrl)

    if (!response.ok) {
      throw new Error(`Direct fetch error: ${response.status}`)
    }

    const xmlText = await response.text()
    return this.parseRSSXML(xmlText)
  }

  private parseRSSXML(xmlText: string): RSSPost[] {
    try {
      console.log("🔍 Parsing RSS XML...")
      console.log("XML preview:", xmlText.substring(0, 500))

      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(xmlText, "text/xml")

      // Check for parsing errors
      const parserError = xmlDoc.querySelector("parsererror")
      if (parserError) {
        throw new Error("XML parsing error: " + parserError.textContent)
      }

      const items = xmlDoc.querySelectorAll("item")
      console.log(`📄 Found ${items.length} RSS items`)

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
        // Check partial match
        const partialMatch = post.categories.some((category) => category.includes(topic) || topic.includes(category))

        if (exactMatch || partialMatch) {
          console.log(`✅ Post "${post.title}" matches topic "${topic}"`)
          return true
        }
        return false
      })

      return matches
    })

    console.log(`🎯 Found ${matchingPosts.length} matching posts`)
    return matchingPosts
  }
}

export function createRSSParser(): RSSParser {
  const feedUrl = "https://theassemble.com/feed/"
  return new RSSParser(feedUrl)
}
