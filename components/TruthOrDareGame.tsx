"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { Users, UserPlus, Play, Flame, HelpCircle, Zap, RefreshCw, Home, PlusCircle, Trash2, Trophy } from "lucide-react"

type Player = {
  id: string
  name: string
  gender: "male" | "female"
}

type GameState = "setup" | "playing" | "finished"

export default function TruthOrDareGame() {
  const [players, setPlayers] = useState<Player[]>([])
  const [newPlayerName, setNewPlayerName] = useState("")
  const [newPlayerGender, setNewPlayerGender] = useState<"male" | "female">("female")
  const [gameState, setGameState] = useState<GameState>("setup")
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null)
  const [challengeType, setChallengeType] = useState<"truth" | "dare" | null>(null)
  const [challenge, setChallenge] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [questionCount, setQuestionCount] = useState(0)
  const router = useRouter()

  const addPlayer = () => {
    if (newPlayerName.trim()) {
      setPlayers([
        ...players,
        {
          id: Math.random().toString(36).substring(2, 9),
          name: newPlayerName.trim(),
          gender: newPlayerGender,
        },
      ])
      setNewPlayerName("")
    }
  }

  const removePlayer = (id: string) => {
    setPlayers(players.filter((p) => p.id !== id))
  }

  const startGame = () => {
    if (players.length >= 2) {
      setGameState("playing")
      setQuestionCount(0)
      selectRandomPlayer()
    }
  }

  const selectRandomPlayer = () => {
    const randomIndex = Math.floor(Math.random() * players.length)
    setCurrentPlayer(players[randomIndex])
    setChallengeType(null)
    setChallenge("")
  }

  const selectChallengeType = async (type: "truth" | "dare") => {
    setChallengeType(type)
    setLoading(true)
    const params = type === "truth" ? 2 : 1 // 1=action, 2=veritee

    try {
      const response = await fetch(`/api/getChallenge?type=${params}`)
      const data = await response.json()
      setChallenge(data.value || "Aucun défi trouvé.")
    } catch (error) {
      console.error("Error fetching challenge:", error)
      setChallenge("Impossible de charger le défi.")
    } finally {
      setLoading(false)
    }
  }

  const nextTurn = () => {
    const newQuestionCount = questionCount + 1
    if (newQuestionCount >= 20) {
      setGameState("finished")
    } else {
      setQuestionCount(newQuestionCount)
      selectRandomPlayer()
    }
  }

  const returnToHub = () => {
    router.push("/")
  }

  if (gameState === "setup") {
    return (
      <Card className="w-full max-w-lg mx-auto bg-white/95 backdrop-blur-md shadow-2xl border-0 rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-red-600 to-rose-700 text-white p-6">
          <div className="flex items-center space-x-3">
            <Users className="w-7 h-7 text-amber-300" />
            <div>
              <CardTitle className="text-2xl font-bold">Ajouter des Joueurs</CardTitle>
              <CardDescription className="text-red-100 text-sm">
                Minimum 2 joueurs requis pour commencer la partie
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Add player form */}
          <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Nom du joueur"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addPlayer()}
                className="h-11 border-gray-300"
              />
              <Button onClick={addPlayer} className="h-11 px-5 bg-red-600 hover:bg-red-700 text-white font-semibold">
                <UserPlus className="w-4 h-4 mr-1" />
                Ajouter
              </Button>
            </div>

            <RadioGroup
              value={newPlayerGender}
              onValueChange={(val) => setNewPlayerGender(val as "male" | "female")}
              className="flex space-x-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female" className="cursor-pointer">Fille 👩</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male" className="cursor-pointer">Garçon 👨</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Player list */}
          <div>
            <h3 className="font-bold text-gray-700 mb-3 flex items-center">
              Joueurs inscrits ({players.length}) :
            </h3>
            {players.length === 0 ? (
              <p className="text-sm text-gray-400 italic">Aucun joueur ajouté pour le moment.</p>
            ) : (
              <div className="grid grid-cols-2 gap-2 max-h-44 overflow-y-auto pr-1">
                {players.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between bg-white border border-gray-200 p-2.5 rounded-lg shadow-sm"
                  >
                    <span className="font-medium text-gray-800 truncate">
                      {player.gender === "female" ? "👩" : "👨"} {player.name}
                    </span>
                    <button
                      onClick={() => removePlayer(player.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="space-y-2 pt-2">
            <Button
              onClick={startGame}
              disabled={players.length < 2}
              className="w-full h-12 text-base font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md rounded-xl disabled:opacity-50"
            >
              <Play className="w-5 h-5 mr-2 fill-current" />
              Lancer le jeu ({players.length}/2 min)
            </Button>

            <Button
              onClick={() => router.push("/add-question")}
              variant="outline"
              className="w-full h-11 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Proposer un nouveau défi
            </Button>

            <Button
              onClick={returnToHub}
              variant="ghost"
              className="w-full h-11 text-gray-600 hover:bg-gray-100 rounded-xl"
            >
              <Home className="w-4 h-4 mr-2" />
              Retour au menu principal
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (gameState === "finished") {
    return (
      <Card className="w-full max-w-md mx-auto bg-white/95 backdrop-blur-md shadow-2xl border-0 rounded-2xl overflow-hidden text-center">
        <CardHeader className="bg-gradient-to-r from-red-600 to-rose-700 text-white p-6">
          <Trophy className="w-12 h-12 text-amber-300 mx-auto mb-2 animate-bounce" />
          <CardTitle className="text-3xl font-extrabold">Partie Terminée !</CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <p className="text-lg text-gray-700">Vous avez relevé les 20 défis avec succès ! 🎉</p>
          <div className="space-y-3">
            <Button
              onClick={() => {
                setGameState("setup")
                setQuestionCount(0)
              }}
              className="w-full h-12 text-base font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-md"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Rejouer une partie
            </Button>
            <Button
              onClick={returnToHub}
              variant="outline"
              className="w-full h-12 text-base font-semibold border-gray-300 text-gray-700 rounded-xl"
            >
              <Home className="w-4 h-4 mr-2" />
              Retour au menu
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-white/95 backdrop-blur-md shadow-2xl border-0 rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-red-600 to-rose-700 text-white p-6 text-center">
        <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-red-200 mb-2">
          <span>Tour {questionCount + 1} / 20</span>
          <span>{currentPlayer?.gender === "female" ? "👩 Fille" : "👨 Garçon"}</span>
        </div>
        <CardTitle className="text-3xl font-black text-amber-300 drop-shadow-sm">
          {currentPlayer?.name}
        </CardTitle>
        <CardDescription className="text-white/90 text-sm mt-1">
          À votre tour de choisir !
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6 text-center space-y-6">
        {!challengeType ? (
          <div className="space-y-4 py-4">
            <p className="text-base font-medium text-gray-600">Choisissez votre destin :</p>
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => selectChallengeType("truth")}
                className="h-24 text-xl font-black bg-gradient-to-br from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg rounded-2xl flex flex-col items-center justify-center gap-1 transition-all transform hover:scale-105"
              >
                <HelpCircle className="w-8 h-8" />
                VÉRITÉ
              </Button>
              <Button
                onClick={() => selectChallengeType("dare")}
                className="h-24 text-xl font-black bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg rounded-2xl flex flex-col items-center justify-center gap-1 transition-all transform hover:scale-105"
              >
                <Zap className="w-8 h-8" />
                ACTION
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 py-2">
            <div className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-red-100 text-red-700">
              {challengeType === "truth" ? "💬 Vérité" : "🔥 Action"}
            </div>

            <div className="p-6 bg-gradient-to-br from-gray-50 to-red-50 border border-red-100 rounded-2xl min-h-[140px] flex items-center justify-center shadow-inner">
              {loading ? (
                <RefreshCw className="w-8 h-8 text-red-600 animate-spin" />
              ) : (
                <p className="text-xl font-bold text-gray-800 leading-relaxed">{challenge}</p>
              )}
            </div>

            <Button
              onClick={nextTurn}
              disabled={loading}
              className="w-full h-13 text-base font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-md"
            >
              Tour Suivant
            </Button>
          </div>
        )}

        <Button
          onClick={returnToHub}
          variant="ghost"
          className="w-full text-sm text-gray-500 hover:bg-gray-100 rounded-xl"
        >
          Quitter la partie
        </Button>
      </CardContent>
    </Card>
  )
}
