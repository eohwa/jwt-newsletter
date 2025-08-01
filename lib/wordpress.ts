// WordPress.com REST API integration
interface WordPressPost {
  id: number
  title: {
    rendered: string
  }
  excerpt: {
    rendered: string
  }
  content: {
    rendered: string
  }
  date: string
  tags: number[]
  _embedded?: {
    "wp:term"?: Array<
      Array<{
        id: number
        name: string
        slug: string
      }>
    >
  }
}

interface WordPressTag {
  id: number
  name: string
  slug: string
}

export class WordPressAPI {
  private baseUrl: string
  private siteUrl: string

  constructor(siteUrl: string) {
    this.siteUrl = siteUrl
    // WordPress.com sites can use either format
    this.baseUrl = siteUrl.includes(".wordpress.com")
      ? `https://public-api.wordpress.com/wp/v2/sites/${siteUrl}/`
      : `${siteUrl}/wp-json/wp/v2/`
  }

  async getPosts(
    options: {
      tags?: string[]
      per_page?: number
      orderby?: string
      order?: "asc" | "desc"
    } = {},
  ): Promise<WordPressPost[]> {
    try {
      const params = new URLSearchParams()

      if (options.per_page) params.append("per_page", options.per_page.toString())
      if (options.orderby) params.append("orderby", options.orderby)
      if (options.order) params.append("order", options.order)

      // Add embed parameter to get tag information
      params.append("_embed", "wp:term")

      const url = `${this.baseUrl}posts?${params.toString()}`

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`WordPress API error: ${response.status}`)
      }

      const posts: WordPressPost[] = await response.json()

      // Filter by tags if specified
      if (options.tags && options.tags.length > 0) {
        return posts.filter((post) => {
          const postTags = this.extractTagSlugs(post)
          return options.tags!.some((tag) => postTags.includes(tag))
        })
      }

      return posts
    } catch (error) {
      console.error("Error fetching WordPress posts:", error)
      return []
    }
  }

  async getPostsByTag(tagSlug: string, limit = 5): Promise<WordPressPost[]> {
    return this.getPosts({
      tags: [tagSlug],
      per_page: limit,
      orderby: "date",
      order: "desc",
    })
  }

  private extractTagSlugs(post: WordPressPost): string[] {
    if (!post._embedded || !post._embedded["wp:term"]) {
      return []
    }

    // wp:term contains arrays for different taxonomies (categories, tags, etc.)
    // Tags are usually in the second array (index 1), but we'll check all
    const allTerms = post._embedded["wp:term"].flat()
    return allTerms.map((term) => term.slug)
  }

  // Helper method to extract clean content
  extractContent(post: WordPressPost): {
    title: string
    excerpt: string
    content: string
    tags: string[]
    publishedDate: string
  } {
    return {
      title: this.stripHtml(post.title.rendered),
      excerpt: this.stripHtml(post.excerpt.rendered),
      content: this.stripHtml(post.content.rendered),
      tags: this.extractTagSlugs(post),
      publishedDate: post.date,
    }
  }

  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, "").trim()
  }
}

// Create a singleton instance
export function createWordPressAPI(siteUrl?: string): WordPressAPI {
  const wpSiteUrl = siteUrl || process.env.WORDPRESS_SITE_URL || "demo.wordpress.com"
  return new WordPressAPI(wpSiteUrl)
}
