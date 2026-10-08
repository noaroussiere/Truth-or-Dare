import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export const dynamic = "force-dynamic"

export async function DELETE(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session || !session.user) {
      return NextResponse.json({ error: "Non autorisé. Veuillez vous connecter." }, { status: 401 })
    }

    const userRole = (session.user as any).role
    if (userRole !== "admin") {
      return NextResponse.json({ error: "Action réservée aux administrateurs." }, { status: 403 })
    }

    const url = new URL(request.url)
    const queryId = url.searchParams.get("id")

    let id: number | null = null

    if (queryId) {
      id = parseInt(queryId, 10)
    } else {
      const body = await request.json().catch(() => ({}))
      if (body.id) id = parseInt(body.id, 10)
    }

    if (!id || isNaN(id)) {
      return NextResponse.json({ error: "ID de défi invalide." }, { status: 400 })
    }

    await prisma.challenge.delete({
      where: { id },
    })

    return NextResponse.json({ status: "Success", message: "Défi supprimé avec succès." })
  } catch (error) {
    console.error("Error deleting challenge:", error)
    return NextResponse.json({ error: "Erreur serveur lors de la suppression." }, { status: 500 })
  }
}
