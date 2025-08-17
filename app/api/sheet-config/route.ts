// API endpoint that your Apps Script can call to get current config
import { NextResponse } from "next/server"
import { getSheetTags } from "@/lib/google-sheets"

export async function GET() {
  try {
    const tags = await getSheetTags()

    return NextResponse.json({
      tags: tags,
      success: true,
    })
  } catch (error) {
    console.error("Error fetching sheet config:", error)
    return NextResponse.json({ error: "Failed to fetch configuration", success: false }, { status: 500 })
  }
}
