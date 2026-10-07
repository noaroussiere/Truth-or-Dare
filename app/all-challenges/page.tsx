"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Flame, ArrowLeft, User, Search, RefreshCw, Sparkles } from "lucide-react"

type Challenge = {
  id: number | string
  TYPE: string
  value: string
  username: string
  date: string
}

export default function AllChallenges() {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [filter, setFilter] = useState("all")
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    setLoading(true)
    fetch("/api/getAllChallenge")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) setChallenges(data)
      })
      .catch((error) => console.error("Error fetching challenges:", error))
      .finally(() => setLoading(false))
  }, [])

  const filteredChallenges = challenges.filter((challenge) => {
    const matchesFilter = filter === "all" || challenge.TYPE === filter
    const matchesSearch = challenge.value.toLowerCase().includes(search.toLowerCase()) ||
                          challenge.username.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-rose-700 to-amber-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-xl bg-white/95 backdrop-blur-md shadow-2xl border-0 rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-red-600 to-rose-700 text-white p-6 flex flex-row items-center justify-between">
          <div className="flex items-center space-x-3">
            <Flame className="w-7 h-7 text-amber-300 animate-pulse" />
            <div>
              <CardTitle className="text-2xl font-bold">Tous les Défis</CardTitle>
              <CardDescription className="text-red-100 text-xs">
                Explorez la liste complète des actions et vérités
              </CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/")}
            className="text-white hover:bg-white/20 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
            <Input
              type="text"
              placeholder="Rechercher un défi ou un auteur..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-11 border-gray-300 rounded-xl"
            />
          </div>

          {/* Filter radio group */}
          <RadioGroup value={filter} onValueChange={setFilter} className="flex justify-center space-x-6 py-1">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all" className="cursor-pointer font-medium">Tous</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="veritee" id="truth" />
              <Label htmlFor="truth" className="cursor-pointer font-medium text-emerald-700">Vérité</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="action" id="dare" />
              <Label htmlFor="dare" className="cursor-pointer font-medium text-amber-700">Action</Label>
            </div>
          </RadioGroup>

          {/* List area */}
          <ScrollArea className="h-[420px] pr-3">
            {loading ? (
              <div className="flex items-center justify-center h-48 text-gray-500">
                <RefreshCw className="w-6 h-6 animate-spin mr-2" />
                Chargement des défis...
              </div>
            ) : filteredChallenges.length > 0 ? (
              <div className="space-y-3">
                {filteredChallenges.map((c) => (
                  <div
                    key={c.id}
                    className="p-4 rounded-xl border border-gray-200 bg-white hover:shadow-md transition-all space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <span
                        className={`text-xs font-extrabold uppercase px-2.5 py-1 rounded-full ${
                          c.TYPE === "action"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {c.TYPE === "action" ? "🔥 Action" : "💬 Vérité"}
                      </span>
                      <div className="flex items-center text-xs text-gray-500 font-medium">
                        <User className="w-3.5 h-3.5 mr-1" />
                        {c.username}
                      </div>
                    </div>
                    <p className="text-gray-800 font-medium text-base">{c.value}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-gray-400 gap-2">
                <Sparkles className="w-8 h-8 text-gray-300" />
                <p className="text-base font-medium">Aucun défi ne correspond à votre recherche.</p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
