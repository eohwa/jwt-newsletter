import { NextResponse } from "next/server"

export async function GET() {
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
      return NextResponse.json(
        {
          error: `RSS fetch failed: ${response.status}`,
          success: false,
        },
        { status: response.status },
      )
    }

    const xmlText = await response.text()
    console.log("✅ RSS feed fetched successfully")
    console.log("📄 Content length:", xmlText.length)
    console.log("🔍 XML preview:", xmlText.substring(0, 500))

    return NextResponse.json(
      {
        success: true,
        xmlContent: xmlText,
        contentType: response.headers.get("content-type"),
        contentLength: xmlText.length,
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET",
          "Cache-Control": "s-maxage=300",
        },
      },
    )
  } catch (error) {
    console.error("❌ Server-side RSS fetch error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch RSS feed",
        details: String(error),
        success: false,
      },
      { status: 500 },
    )
  }
}
