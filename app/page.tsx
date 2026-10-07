"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useSession, signOut } from "@/lib/auth-client"
import { Flame, Play, LogIn, UserPlus, ListPlus, BookOpen, LogOut, User } from "lucide-react"

export default function Home() {
  const { data: session, isPending } = useSession()

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-rose-700 to-amber-800 text-white flex flex-col items-center justify-between p-6">
      {/* Top Navbar */}
      <header className="w-full max-w-xl flex items-center justify-between py-4 border-b border-white/10 mb-8">
        <div className="flex items-center space-x-2">
          <Flame className="w-8 h-8 text-amber-300 animate-pulse" />
          <span className="text-2xl font-black tracking-wider uppercase">Truth or Dare</span>
        </div>

        <div>
          {!isPending && session ? (
            <div className="flex items-center space-x-3 bg-white/10 px-3 py-1.5 rounded-full text-sm backdrop-blur-sm">
              <User className="w-4 h-4 text-amber-300" />
              <span className="font-semibold">{session.user.name || session.user.email}</span>
              <button
                onClick={() => signOut()}
                className="text-red-200 hover:text-white transition-colors p-1"
                title="Déconnexion"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : null}
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-md my-auto flex flex-col items-center text-center space-y-6 bg-white/10 backdrop-blur-lg p-8 rounded-3xl border border-white/20 shadow-2xl">
        <div className="space-y-2">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight drop-shadow-md">
            🔥 Action ou Vérité 🔥
          </h1>
          <p className="text-red-100 text-base max-w-xs mx-auto">
            Le jeu ultime entre amis. Oserez-vous révéler la vérité ou accomplir le défi ?
          </p>
        </div>

        <div className="w-full space-y-3 pt-4">
          <Link href="/game" className="block w-full">
            <Button className="w-full h-14 text-lg font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg hover:shadow-emerald-500/30 transition-all rounded-xl">
              <Play className="w-5 h-5 mr-2 fill-current" />
              Lancer la partie
            </Button>
          </Link>

          {!isPending && !session ? (
            <div className="grid grid-cols-2 gap-3">
              <Link href="/login" className="block">
                <Button className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all rounded-xl">
                  <LogIn className="w-4 h-4 mr-2" />
                  Connexion
                </Button>
              </Link>

              <Link href="/register" className="block">
                <Button className="w-full h-12 text-base font-semibold bg-purple-600 hover:bg-purple-700 text-white shadow-md transition-all rounded-xl">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Inscription
                </Button>
              </Link>
            </div>
          ) : (
            <Link href="/add-question" className="block w-full">
              <Button className="w-full h-12 text-base font-semibold bg-amber-500 hover:bg-amber-600 text-white shadow-md transition-all rounded-xl">
                <ListPlus className="w-4 h-4 mr-2" />
                Ajouter un défi
              </Button>
            </Link>
          )}

          <Link href="/all-challenges" className="block w-full">
            <Button variant="outline" className="w-full h-12 text-base font-semibold bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm transition-all rounded-xl">
              <BookOpen className="w-4 h-4 mr-2" />
              Tous les Défis
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-8 text-sm text-red-200/80 text-center">
        Créé par{" "}
        <a
          href="https://github.com/nduboi"
          target="_blank"
          rel="noopener noreferrer"
          className="underline font-semibold hover:text-white transition-colors"
        >
          @nduboi
        </a>{" "}
        • v0.5.1 Next.js Edition
      </footer>
    </div>
  )
}
