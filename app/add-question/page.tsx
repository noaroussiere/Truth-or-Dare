"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { useSession } from "@/lib/auth-client"
import { Flame, ArrowLeft, PlusCircle, RefreshCw } from "lucide-react"

export default function AddQuestion() {
  const [challenge, setChallenge] = useState("")
  const [type, setType] = useState<"1" | "2">("1")
  const [loading, setLoading] = useState(false)
  const { data: session, isPending } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!isPending && !session) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour proposer un défi.",
        variant: "destructive",
      })
      router.push("/login")
    }
  }, [session, isPending, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!challenge.trim()) {
      toast({
        title: "Champ vide",
        description: "Le texte du défi ne peut pas être vide.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/addChallenge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ challenge: challenge.trim(), type }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast({
          title: "Erreur",
          description: data.error || "Impossible d'ajouter le défi.",
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Défi ajouté !",
        description: "Votre défi a été ajouté à la base de données avec succès.",
      })
      setChallenge("")
      setType("1")
    } catch (error) {
      console.error("Error adding challenge:", error)
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'ajout du défi.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (isPending) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-600 to-amber-800 flex items-center justify-center text-white">
        <RefreshCw className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-rose-700 to-amber-800 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-md shadow-2xl border-0 rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-red-600 to-rose-700 text-white p-6 flex flex-row items-center justify-between">
          <div className="flex items-center space-x-3">
            <Flame className="w-7 h-7 text-amber-300 animate-pulse" />
            <div>
              <CardTitle className="text-2xl font-bold">Ajout de Défi</CardTitle>
              <CardDescription className="text-red-100 text-xs">
                Proposez votre propre action ou vérité
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

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">Type de Défi</Label>
              <RadioGroup
                value={type}
                onValueChange={(val) => setType(val as "1" | "2")}
                className="grid grid-cols-2 gap-3"
              >
                <div className="flex items-center space-x-2 border border-gray-200 p-3 rounded-xl cursor-pointer hover:bg-gray-50">
                  <RadioGroupItem value="1" id="action" />
                  <Label htmlFor="action" className="cursor-pointer font-medium text-amber-700">
                    🔥 Action
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border border-gray-200 p-3 rounded-xl cursor-pointer hover:bg-gray-50">
                  <RadioGroupItem value="2" id="verite" />
                  <Label htmlFor="verite" className="cursor-pointer font-medium text-emerald-700">
                    💬 Vérité
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="defi" className="text-sm font-semibold text-gray-700">
                Intitulé du Défi
              </Label>
              <Input
                id="defi"
                placeholder="Ex: Fais 10 pompes ou raconte ton pire râteau..."
                value={challenge}
                onChange={(e) => setChallenge(e.target.value)}
                required
                className="h-12 border-gray-300 rounded-xl"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-base font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-md transition-all"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              {loading ? "Ajout..." : "Ajouter le Défi"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
