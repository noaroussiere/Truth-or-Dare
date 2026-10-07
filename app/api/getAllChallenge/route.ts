import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const challenges = await prisma.challenge.findMany({
      orderBy: { createdAt: "desc" },
    })

    const formatted = challenges.map((c) => ({
      id: c.id,
      TYPE: c.type,
      value: c.value,
      username: c.username,
      date: c.createdAt,
    }))

    return NextResponse.json(formatted)
  } catch (error) {
    console.error("Error fetching all challenges:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
