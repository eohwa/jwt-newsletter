// Using Pages Router API instead of App Router
import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    console.log("🔄 Server-side RSS fetch starting...")

    const response = await fetch("https://theassemble.com/feed/", {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Newsletter Bot)",
        Accept: "application/rss+xml, application/xml, text/xml",
      },
    })

    console.log(`📡 RSS response status: ${response.status}`)

    if (!response.ok) {
      console.error(`❌ RSS fetch failed: ${response.status} ${response.statusText}`)
      return res.status(response.status).json({
        error: `RSS fetch failed: ${response.status}`,
        success: false,
      })
    }

    const xmlText = await response.text()
    console.log("✅ RSS feed fetched successfully")
    console.log("📄 Content length:", xmlText.length)
    console.log("🔍 XML preview:", xmlText.substring(0, 500))

    // Set CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Methods", "GET")
    res.setHeader("Cache-Control", "s-maxage=300")

    return res.status(200).json({
      success: true,
      xmlContent: xmlText,
      contentType: response.headers.get("content-type"),
      contentLength: xmlText.length,
    })
  } catch (error) {
    console.error("❌ Server-side RSS fetch error:", error)
    return res.status(500).json({
      error: "Failed to fetch RSS feed",
      details: String(error),
      success: false,
    })
  }
}
