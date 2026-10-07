import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      return NextResponse.json({ error: "Unauthorized. Please log in first." }, { status: 401 })
    }

    const body = await request.json()
    const { challenge, type: rawType } = body

    if (!challenge || !rawType) {
      return NextResponse.json({ error: "Please fill all inputs" }, { status: 400 })
    }

    let type = rawType
    if (rawType === "1") type = "action"
    if (rawType === "2") type = "veritee"

    const username = session.user.name || session.user.email || "Anonymous"

    await prisma.challenge.create({
      data: {
        type,
        value: challenge,
        username,
      },
    })

    return NextResponse.json({ status: "Success" })
  } catch (error) {
    console.error("Error adding challenge:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
