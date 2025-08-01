const jwt = require("jsonwebtoken")

// Hardcoded secret key for development
const SECRET_KEY = "dev-secret"

// Test users configuration
const testUsers = {
  aaron: {
    sub: "123",
    first_name: "Aaron",
    topics: ["esg", "dei"],
    tier: "Standard",
  },
  sarah: {
    sub: "456",
    first_name: "Sarah",
    topics: ["dei", "exb"],
    tier: "Gold",
  },
}

function generateToken(userKey = "aaron") {
  const user = testUsers[userKey]

  if (!user) {
    console.error(`User '${userKey}' not found. Available users: ${Object.keys(testUsers).join(", ")}`)
    process.exit(1)
  }

  // Set expiration to 7 days from now
  const exp = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60

  const payload = {
    ...user,
    exp: exp,
  }

  try {
    const token = jwt.sign(payload, SECRET_KEY)
    const url = `http://localhost:8080/report?t=${token}`

    console.log("\n=== JWT Newsletter Link Generator ===")
    console.log(`User: ${user.first_name}`)
    console.log(`Topics: ${user.topics.join(", ")}`)
    console.log(`Tier: ${user.tier}`)
    console.log(`Expires: ${new Date(exp * 1000).toLocaleString()}`)
    console.log("\nGenerated URL:")
    console.log(url)
    console.log("\n=====================================\n")

    return url
  } catch (error) {
    console.error("Error generating token:", error)
    process.exit(1)
  }
}

// Check command line arguments
const userKey = process.argv[2] || "aaron"
generateToken(userKey)
