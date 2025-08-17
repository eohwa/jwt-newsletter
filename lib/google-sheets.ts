// Simplified version that works with your Apps Script
interface SheetUser {
  firstName: string
  email: string
  topics: string[]
  lastNotified?: string
}

interface SheetTag {
  slug: string
  label: string
  color: string
}

// Since we're using Apps Script, we'll create a simple API endpoint
// that your Apps Script can call to get the current configuration

// For now, let's use the data structure that matches your sheet
export async function getSheetUsers(): Promise<SheetUser[]> {
  // This will be populated by your Apps Script or fallback data
  const fallbackUsers = [
    {
      firstName: "Cale",
      email: "cale.h.johnson@gmail.com",
      topics: ["supply-chain", "talent"],
      lastNotified: "8/14/2025",
    },
    {
      firstName: "Pete",
      email: "cale@board.org",
      topics: ["DEI", "EXB"],
      lastNotified: "8/12/2025",
    },
  ]

  return fallbackUsers
}

export async function getSheetTags(): Promise<SheetTag[]> {
  // This matches your Tags sheet structure
  const tags = [
    { slug: "finance", label: "Finance", color: "#002642" },
    { slug: "human-capital", label: "Human Capital", color: "#422147" },
    { slug: "manufacturing", label: "Manufacturing / Safety", color: "#BA2126" },
    { slug: "talent", label: "Marketing & Talent", color: "#3AC6CD" },
    { slug: "supply-chain", label: "Supply Chain", color: "#035E66" },
  ]

  return tags
}

export function convertSheetUsersToProfiles(sheetUsers: SheetUser[]): any[] {
  return sheetUsers.map((user) => ({
    key: user.firstName.toLowerCase(),
    name: user.firstName,
    email: user.email,
    topics: user.topics.map((topic) => topic.toLowerCase().replace(/\s+/g, "-")),
    tier: "Standard",
  }))
}
