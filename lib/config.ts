export interface TagConfig {
  slug: string
  label: string
  color: string
}

export interface UserProfile {
  key: string
  name: string
  email: string
  topics: string[]
  tier: string
}

// Parse environment variables for tags
export function getAvailableTags(): TagConfig[] {
  const tagsEnv = process.env.NEWSLETTER_TAGS || process.env.NEXT_PUBLIC_NEWSLETTER_TAGS

  if (!tagsEnv) {
    // Fallback to default tags if not configured
    return [
      { slug: "talent-marketing", label: "Talent & Marketing", color: "purple" },
      { slug: "supply-chain", label: "Supply Chain", color: "orange" },
      { slug: "esg", label: "ESG & Sustainability", color: "green" },
      { slug: "dei", label: "Diversity & Inclusion", color: "blue" },
      { slug: "social-media", label: "Social Media & Digital", color: "pink" },
      { slug: "senior", label: "Senior Leadership", color: "amber" },
    ]
  }

  try {
    // Parse JSON from environment variable
    return JSON.parse(tagsEnv)
  } catch (error) {
    console.error("Error parsing NEWSLETTER_TAGS:", error)
    // Return default tags on parse error
    return [
      { slug: "talent-marketing", label: "Talent & Marketing", color: "purple" },
      { slug: "supply-chain", label: "Supply Chain", color: "orange" },
    ]
  }
}

// Parse environment variables for user profiles
export function getUserProfiles(): UserProfile[] {
  const usersEnv = process.env.NEWSLETTER_USERS || process.env.NEXT_PUBLIC_NEWSLETTER_USERS

  if (!usersEnv) {
    // Fallback to default users
    return [
      {
        key: "aaron",
        name: "Aaron",
        email: "aaron@example.com",
        topics: ["talent-marketing", "supply-chain"],
        tier: "Standard",
      },
      {
        key: "demo",
        name: "Demo User",
        email: "demo@example.com",
        topics: ["talent-marketing", "supply-chain", "esg", "dei"],
        tier: "Gold",
      },
    ]
  }

  try {
    return JSON.parse(usersEnv)
  } catch (error) {
    console.error("Error parsing NEWSLETTER_USERS:", error)
    return [
      {
        key: "aaron",
        name: "Aaron",
        email: "aaron@example.com",
        topics: ["talent-marketing"],
        tier: "Standard",
      },
    ]
  }
}

export function getTagLabels(): Record<string, string> {
  const tags = getAvailableTags()
  const labels: Record<string, string> = {}

  tags.forEach((tag) => {
    labels[tag.slug] = tag.label
  })

  return labels
}

export function getTagColors(): Record<string, string> {
  const tags = getAvailableTags()
  const colors: Record<string, string> = {}

  tags.forEach((tag) => {
    colors[tag.slug] = tag.color
  })

  return colors
}
