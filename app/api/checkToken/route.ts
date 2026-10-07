import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      return NextResponse.json({ error: "No active session" }, { status: 401 })
    }

    return NextResponse.json({ status: "Success", user: session.user })
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
