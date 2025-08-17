"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { getAvailableTags } from "@/lib/config"

interface TopicTagProps {
  slug: string
  children: React.ReactNode
  className?: string
}

export function TopicTag({ slug, children, className = "" }: TopicTagProps) {
  const [tagColor, setTagColor] = useState<string>("#6B7280") // Default gray
  const [textColor, setTextColor] = useState<string>("#FFFFFF")

  useEffect(() => {
    const loadTagColor = async () => {
      try {
        const tags = await getAvailableTags()
        const tag = tags.find((t) => t.slug.toLowerCase() === slug.toLowerCase())

        if (tag?.color) {
          setTagColor(tag.color)
          // Calculate contrasting text color
          setTextColor(getContrastColor(tag.color))
        }
      } catch (error) {
        console.error("Error loading tag color:", error)
      }
    }

    loadTagColor()
  }, [slug])

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${className}`}
      style={{
        backgroundColor: tagColor,
        color: textColor,
      }}
    >
      {children}
    </span>
  )
}

// Helper function to determine if text should be white or black based on background
function getContrastColor(hexColor: string): string {
  // Remove # if present
  const hex = hexColor.replace("#", "")

  // Convert to RGB
  const r = Number.parseInt(hex.substr(0, 2), 16)
  const g = Number.parseInt(hex.substr(2, 2), 16)
  const b = Number.parseInt(hex.substr(4, 2), 16)

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

  // Return white for dark backgrounds, black for light backgrounds
  return luminance > 0.5 ? "#000000" : "#FFFFFF"
}
