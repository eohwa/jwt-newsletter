const jwt = require("jsonwebtoken")

// Use environment variable or fallback for development
const SECRET_KEY = process.env.JWT_SECRET || "dev-secret-change-in-production"

const testUsers = {
  aaron: {
    sub: "123",
    first_name: "Aaron",
    email: "aaron@example.com",
    topics: ["esg", "dei"],
    tier: "Standard",
  },
  sarah: {
    sub: "456",
    first_name: "Sarah",
    email: "sarah@example.com",
    topics: ["social-media", "senior"],
    tier: "Gold",
  },
  demo: {
    sub: "789",
    first_name: "Demo User",
    email: "demo@example.com",
    topics: ["esg", "dei", "social-media", "senior"],
    tier: "Gold",
  },
  executive: {
    sub: "101",
    first_name: "Executive",
    email: "exec@example.com",
    topics: ["senior", "esg"],
    tier: "Gold",
  },
  social: {
    sub: "202",
    first_name: "Social Manager",
    email: "social@example.com",
    topics: ["social-media", "dei"],
    tier: "Standard",
  },
}

function generateLink(userKey = "aaron", baseUrl = "https://your-app.vercel.app") {
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
const userKey = process.argv[2] || "aaron"
const baseUrl = process.argv[3] || "http://localhost:3000"
generateLink(userKey, baseUrl)
