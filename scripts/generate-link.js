const jwt = require("jsonwebtoken")

// Use environment variable or fallback for development
const SECRET_KEY = process.env.JWT_SECRET || "dev-secret-change-in-production"

// For the script, we'll use the fallback users since we can't easily access Google Sheets from Node.js script
// In production, you might want to create a separate API endpoint for this
const testUsers = {
  cale: {
    sub: "123",
    first_name: "Cale",
    email: "cale.h.johnson@gmail.com",
    topics: ["supply-chain", "talent"],
    tier: "Standard",
  },
  pete: {
    sub: "456",
    first_name: "Pete",
    email: "cale@board.org",
    topics: ["dei", "exb"],
    tier: "Standard",
  },
  demo: {
    sub: "789",
    first_name: "Demo User",
    email: "demo@example.com",
    topics: ["finance", "human-capital", "manufacturing", "talent", "supply-chain"],
    tier: "Gold",
  },
}

function generateLink(userKey = "cale", baseUrl = "https://your-app.vercel.app") {
  const user = testUsers[userKey]

  if (!user) {
    console.error(`User '${userKey}' not found. Available: ${Object.keys(testUsers).join(", ")}`)
    process.exit(1)
  }

  // Set expiration to 30 days from now (longer for demo purposes)
  const exp = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60

  const payload = {
    ...user,
    exp: exp,
    iat: Math.floor(Date.now() / 1000),
  }

  try {
    const token = jwt.sign(payload, SECRET_KEY)
    const url = `${baseUrl}/newsletter?token=${token}`

    console.log("\n🔗 JWT Newsletter Link Generator")
    console.log("================================")
    console.log(`👤 User: ${user.first_name}`)
    console.log(`📧 Email: ${user.email}`)
    console.log(`🏷️  Topics: ${user.topics.join(", ")}`)
    console.log(`⭐ Tier: ${user.tier}`)
    console.log(`⏰ Expires: ${new Date(exp * 1000).toLocaleString()}`)
    console.log("\n🌐 Generated URL:")
    console.log(url)
    console.log("\n📋 Copy this URL to test your personalized newsletter!")
    console.log("================================\n")

    return url
  } catch (error) {
    console.error("❌ Error generating token:", error)
    process.exit(1)
  }
}

// Command line usage
const userKey = process.argv[2] || "cale"
const baseUrl = process.argv[3] || "http://localhost:3000"
generateLink(userKey, baseUrl)
