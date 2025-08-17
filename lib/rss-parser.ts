// RSS Feed Parser for theassemble.com
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
      console.log("Fetching RSS feed:", this.feedUrl)

      // Use a CORS proxy to fetch the RSS feed
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(this.feedUrl)}`
      const response = await fetch(proxyUrl)

      if (!response.ok) {
        throw new Error(`RSS fetch error: ${response.status}`)
      }

      const data = await response.json()
      const xmlText = data.contents

      // Parse XML (simple parsing for RSS)
      const posts = this.parseRSSXML(xmlText)
      console.log(`Parsed ${posts.length} posts from RSS feed`)

      return posts
    } catch (error) {
      console.error("Error fetching RSS feed:", error)
      return []
    }
  }

  private parseRSSXML(xmlText: string): RSSPost[] {
    try {
      // Create a DOM parser
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(xmlText, "text/xml")

      const items = xmlDoc.querySelectorAll("item")
      const posts: RSSPost[] = []

      items.forEach((item) => {
        const title = item.querySelector("title")?.textContent || ""
        const link = item.querySelector("link")?.textContent || ""
        const description = item.querySelector("description")?.textContent || ""
        const pubDate = item.querySelector("pubDate")?.textContent || ""

        // Extract categories
        const categoryElements = item.querySelectorAll("category")
        const categories: string[] = []
        categoryElements.forEach((cat) => {
          const catText = cat.textContent?.trim()
          if (catText) categories.push(catText.toLowerCase())
        })

        posts.push({
          title: this.stripHtml(title),
          excerpt: this.stripHtml(description).substring(0, 200) + "...",
          content: this.stripHtml(description),
          link: link,
          publishedDate: pubDate,
          categories: categories,
        })
      })

      return posts
    } catch (error) {
      console.error("Error parsing RSS XML:", error)
      return []
    }
  }

  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, "").trim()
  }

  // Filter posts by topics
  getPostsByTopics(posts: RSSPost[], topics: string[]): RSSPost[] {
    return posts.filter((post) => {
      return topics.some((topic) =>
        post.categories.some((category) => category.includes(topic) || topic.includes(category)),
      )
    })
  }
}

export function createRSSParser(): RSSParser {
  const feedUrl = "https://theassemble.com/feed/"
  return new RSSParser(feedUrl)
}
