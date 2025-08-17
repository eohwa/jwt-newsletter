// Truly Clean Google Apps Script - Newsletter Sender
// Domain: https://jwt-newsletter.vercel.app/
// Secret: my-super-secret-newsletter-key-2024

const SECRET_KEY = "my-super-secret-newsletter-key-2024"
const BASE_URL = "https://jwt-newsletter.vercel.app/newsletter"

const Utilities = SpreadsheetApp.newUtilities()
const Logger = Utilities.newLogger()
const MailApp = Utilities.newMailApp()
const SpreadsheetApp = Utilities.newSpreadsheetApp()

function encodeJWT(payload, secret) {
  const header = {
    alg: "HS256",
    typ: "JWT",
  }

  const base64UrlEncode = (obj) => {
    return Utilities.base64EncodeWebSafe(JSON.stringify(obj)).replace(/=+$/, "")
  }

  const headerEncoded = base64UrlEncode(header)
  const payloadEncoded = base64UrlEncode(payload)
  const message = `${headerEncoded}.${payloadEncoded}`

  const signatureBytes = Utilities.computeHmacSha256Signature(message, secret)
  const signatureBase64 = Utilities.base64EncodeWebSafe(signatureBytes)
  const signatureEncoded = signatureBase64.replace(/=+$/, "")

  return `${message}.${signatureEncoded}`
}

function parseTopics(topicString) {
  if (!topicString) return []
  return topicString.split(",").map((t) => t.trim().toLowerCase())
}

function sendNewsletterLinks() {
  try {
    Logger.log("🚀 Starting newsletter link generation...")

    // Get the main sheet (assumes your data is in the first sheet)
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet()
    const data = sheet.getDataRange().getValues()

    Logger.log(`Found ${data.length - 1} recipients in sheet`)

    // Skip header row, process each recipient
    for (let i = 1; i < data.length; i++) {
      const [firstName, email, topics] = data[i]

      // Skip empty rows
      if (!firstName || !email) {
        Logger.log(`Skipping row ${i + 1}: missing name or email`)
        continue
      }

      // Create JWT payload
      const payload = {
        sub: `user_${i}`,
        first_name: firstName,
        email: email,
        topics: parseTopics(topics),
        tier: "Standard",
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
      }

      // Generate JWT token and link
      const token = encodeJWT(payload, SECRET_KEY)
      const personalizedLink = `${BASE_URL}?token=${token}`

      // Create email
      const subject = "Your Personalized Newsletter is Ready"
      const body = `Hi ${firstName},

Your personalized newsletter is ready! 

Topics: ${parseTopics(topics).join(", ")}

View your newsletter: ${personalizedLink}

This link expires in 7 days.

Best regards,
The Newsletter Team`

      // Send email
      try {
        MailApp.sendEmail(email, subject, body)
        Logger.log(`✅ Email sent to ${firstName} (${email})`)
        Logger.log(`   Link: ${personalizedLink}`)
      } catch (emailError) {
        Logger.log(`❌ Failed to send email to ${firstName}: ${emailError}`)
      }
    }

    Logger.log("🎉 Newsletter sending completed!")
  } catch (error) {
    Logger.log(`❌ Error in sendNewsletterLinks: ${error}`)
  }
}

function generateTestLink() {
  try {
    Logger.log("🔗 Generating test link...")

    const testPayload = {
      sub: "test_user",
      first_name: "Test User",
      email: "test@example.com",
      topics: ["supply-chain", "talent"],
      tier: "Gold",
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
    }

    const token = encodeJWT(testPayload, SECRET_KEY)
    const testLink = `${BASE_URL}?token=${token}`

    Logger.log("✅ Test link generated:")
    Logger.log(testLink)

    return testLink
  } catch (error) {
    Logger.log(`❌ Error generating test link: ${error}`)
  }
}

function testScript() {
  try {
    Logger.log("🧪 Testing script functionality...")

    // Test 1: Check spreadsheet access
    const sheet = SpreadsheetApp.getActiveSpreadsheet()
    Logger.log(`✅ Spreadsheet access: ${sheet.getName()}`)

    // Test 2: Check data
    const activeSheet = sheet.getActiveSheet()
    const data = activeSheet.getDataRange().getValues()
    Logger.log(`✅ Found ${data.length} rows of data`)

    if (data.length > 1) {
      Logger.log(`✅ Sample row: ${data[1].join(" | ")}`)
    }

    // Test 3: Generate test JWT
    const testToken = encodeJWT({ test: "data" }, SECRET_KEY)
    Logger.log(`✅ JWT generation: ${testToken ? "Working" : "Failed"}`)

    // Test 4: Generate test link
    generateTestLink()

    Logger.log("🎉 All tests passed!")
  } catch (error) {
    Logger.log(`❌ Test failed: ${error}`)
  }
}
