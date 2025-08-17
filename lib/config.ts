// Simple config without Google Sheets dependency
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

// Static configuration - you can modify these as needed
const availableTags: TagConfig[] = [
  { slug: "supply-chain", label: "Supply Chain", color: "#035E66" },
  { slug: "talent-marketing", label: "Talent & Marketing", color: "#3AC6CD" },
  { slug: "dei", label: "Diversity & Inclusion", color: "#422147" },
  { slug: "esg", label: "ESG & Sustainability", color: "#002642" },
]

const userProfiles: UserProfile[] = [
  {
    key: "cale",
    name: "Cale",
    email: "cale.h.johnson@gmail.com",
    topics: ["supply-chain", "talent-marketing"],
    tier: "Standard",
  },
  {
    key: "pete",
    name: "Pete",
    email: "cale@board.org",
    topics: ["dei", "esg"],
    tier: "Standard",
  },
]

export async function getAvailableTags(): Promise<TagConfig[]> {
  return availableTags
}

export async function getUserProfiles(): Promise<UserProfile[]> {
  return userProfiles
}

export function getTagLabels(): Record<string, string> {
  const labels: Record<string, string> = {}
  availableTags.forEach((tag) => {
    labels[tag.slug.toLowerCase()] = tag.label
  })
  return labels
}
