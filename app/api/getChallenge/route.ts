import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const rawType = searchParams.get("type")

    if (!rawType) {
      return NextResponse.json({ error: "Please provide a challenge type" }, { status: 400 })
    }

    let type = rawType
    if (rawType === "1") type = "action"
    if (rawType === "2") type = "veritee"

    const challenges = await prisma.challenge.findMany({
      where: { type },
    })

    if (challenges.length === 0) {
      return NextResponse.json({ value: "Aucun défi trouvé pour cette catégorie." })
    }

    const randomIndex = Math.floor(Math.random() * challenges.length)
    const selected = challenges[randomIndex]

    return NextResponse.json({ value: selected.value })
  } catch (error) {
    console.error("Error fetching challenge:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
