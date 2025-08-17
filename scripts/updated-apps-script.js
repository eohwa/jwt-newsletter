// Updated Google Apps Script for your sheet
const SECRET_KEY = "dev-secret-change-in-production" // Make sure this matches your JWT_SECRET in Vercel
const BASE_URL = "https://your-app.vercel.app/newsletter" // Update with your actual Vercel URL
const WORDPRESS_API_URL = "https://public-api.wordpress.com/wp/v2/sites/theassemble.com/posts"
const POST_THRESHOLD = 1 // set to 1 for testing; increase for production

// Declare necessary variables
const Logger = Logger
const UrlFetchApp = UrlFetchApp
const MailApp = MailApp
const SpreadsheetApp = SpreadsheetApp
const Utilities = SpreadsheetApp.getUi().Utilities

function encodeJWT(payload, secret) {
  const header = {
    alg: "HS256",
    typ: "JWT",
  }

  const base64UrlEncode = (obj) => Utilities.base64EncodeWebSafe(JSON.stringify(obj)).replace(/=+$/, "")

  const headerEncoded = base64UrlEncode(header)
  const payloadEncoded = base64UrlEncode(payload)

  const message = `${headerEncoded}.${payloadEncoded}`

  const signatureBytes = Utilities.computeHmacSha256Signature(message, secret)
  const signatureBase64 = Utilities.base64EncodeWebSafe(signatureBytes)
  const signatureEncoded = signatureBase64.replace(/=+$/, "")

  return `${message}.${signatureEncoded}`
}

function parseTopics(text) {
  return text.split(",").map((t) => t.trim().toLowerCase().replace(/\s+/g, "-")) // Convert to slug format
}

function getTagMapping() {
  // Get the current tag configuration from your Tags sheet
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Tags")
  const data = sheet.getDataRange().getValues()
  const tagMap = {}

  // Skip header row
  for (let i = 1; i < data.length; i++) {
    const [slug, label, color] = data[i]
    if (slug && label) {
      tagMap[slug.toLowerCase()] = {
        slug: slug.toLowerCase(),
        label: label,
        color: color || "#6B7280",
      }
    }
  }

  Logger.log("Tag mapping loaded: " + JSON.stringify(tagMap))
  return tagMap
}

function fetchNewPosts(topics) {
  try {
    // Convert topics to the format used in WordPress tags
    const tagSlugs = topics.join(",")
    const url = `${WORDPRESS_API_URL}?_embed=wp:term&per_page=10&orderby=date&order=desc`

    Logger.log("Fetching posts from: " + url)
    const response = UrlFetchApp.fetch(url)
    const posts = JSON.parse(response.getContentText())

    const matchingPosts = posts.filter((post) => {
      if (!post._embedded || !post._embedded["wp:term"]) return false

      // Extract tag slugs from the post
      const postTags = post._embedded["wp:term"].flat().map((term) => term.slug.toLowerCase())

      // Check if any of the user's topics match the post tags
      return topics.some((topic) => postTags.includes(topic))
    })

    Logger.log(`Found ${matchingPosts.length} matching posts for topics: ${topics.join(", ")}`)
    return matchingPosts
  } catch (error) {
    Logger.log("Error fetching WordPress posts: " + error)
    return []
  }
}

function checkAndSend() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1")
  const data = sheet.getDataRange().getValues()
  const tagMapping = getTagMapping()

  Logger.log("Starting newsletter check for " + (data.length - 1) + " users")

  for (let i = 1; i < data.length; i++) {
    const [firstName, email, topicString, lastNotified] = data[i]

    if (!firstName || !email) {
      Logger.log(`Skipping row ${i + 1}: missing name or email`)
      continue
    }

    const topics = parseTopics(topicString)
    const newPosts = fetchNewPosts(topics)

    Logger.log(`${firstName} (${email}) has ${newPosts.length} matching posts for topics: ${topics.join(", ")}`)

    if (newPosts.length >= POST_THRESHOLD) {
      const payload = {
        sub: `${i}`,
        first_name: firstName,
        email: email,
        topics: topics,
        tier: "Standard", // You could add a tier column to your sheet
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days
      }

      const token = encodeJWT(payload, SECRET_KEY)
      const fullLink = `${BASE_URL}?token=${token}`

      const subject = "Your peer intelligence report is ready"
      const body = `Hi ${firstName},

Good news! Your personalized peer intelligence report is now ready with ${newPosts.length} new articles matching your interests: ${topics.map((t) => tagMapping[t]?.label || t).join(", ")}.

View your personalized report here: ${fullLink}

This link will expire in 7 days.

— The Assemble Team`

      Logger.log(`Sending email to ${email}: ${fullLink}`)

      try {
        MailApp.sendEmail(email, subject, body)
        sheet.getRange(i + 1, 4).setValue(new Date()) // update "Last Notified"
        Logger.log(`✅ Email sent successfully to ${firstName}`)
      } catch (emailError) {
        Logger.log(`❌ Failed to send email to ${firstName}: ${emailError}`)
      }
    } else {
      Logger.log(`⏭️ Skipping ${firstName}: only ${newPosts.length} new posts (threshold: ${POST_THRESHOLD})`)
    }
  }

  Logger.log("Newsletter check completed")
}

// Test function to generate a single link
function generateTestLink() {
  const testPayload = {
    sub: "test",
    first_name: "Test User",
    email: "test@example.com",
    topics: ["supply-chain", "talent"],
    tier: "Gold",
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
  }

  const token = encodeJWT(testPayload, SECRET_KEY)
  const fullLink = `${BASE_URL}?token=${token}`

  Logger.log("Test link generated: " + fullLink)
  return fullLink
}

// Function to test WordPress API connection
function testWordPressAPI() {
  const testTopics = ["supply-chain", "talent"]
  const posts = fetchNewPosts(testTopics)
  Logger.log(`Test: Found ${posts.length} posts for topics: ${testTopics.join(", ")}`)

  if (posts.length > 0) {
    Logger.log("Sample post: " + posts[0].title.rendered)
  }
}
