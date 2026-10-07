"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { signUp, signIn } from "@/lib/auth-client"
import { Flame, UserPlus, ArrowLeft, KeyRound } from "lucide-react"

export default function Register() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [loading, setLoading] = useState(false)
  const [oidcLoading, setOidcLoading] = useState(false)
  const router = useRouter()

  const oidcEnabled = process.env.NEXT_PUBLIC_OIDC_ENABLED === "true"
  const oidcProviderName = process.env.NEXT_PUBLIC_OIDC_PROVIDER_NAME || "OIDC / SSO"
  const oidcProviderId = process.env.NEXT_PUBLIC_OIDC_PROVIDER_ID || "oidc"

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await signUp.email({
        email,
        password,
        name: username,
      })

      if (error) {
        toast({
          title: "Échec de l'inscription",
          description: error.message || "Une erreur s'est produite.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Compte créé !",
          description: "Votre compte a été créé avec succès.",
        })
        router.push("/add-question")
        router.refresh()
      }
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Une erreur inattendue est survenue.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleOidcLogin = async () => {
    setOidcLoading(true)
    try {
      await signIn.social({
        provider: oidcProviderId as any,
        callbackURL: "/",
      })
    } catch (err) {
      toast({
        title: "Erreur OIDC",
        description: "Impossible d'initier la connexion OIDC.",
        variant: "destructive",
      })
      setOidcLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-rose-700 to-amber-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-md shadow-2xl border-0 rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-red-600 to-rose-700 text-white p-6 text-center">
          <div className="mx-auto w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-2">
            <Flame className="w-7 h-7 text-amber-300 animate-pulse" />
          </div>
          <CardTitle className="text-3xl font-extrabold tracking-tight">Inscription</CardTitle>
          <CardDescription className="text-red-100 text-sm">
            Rejoignez la communauté et créez vos propres défis
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Nom d'utilisateur</label>
              <Input
                type="text"
                placeholder="Pseudonyme"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="h-11"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Adresse Email</label>
              <Input
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Mot de passe</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11"
              />
            </div>
            <Button
              type="submit"
              disabled={loading || oidcLoading}
              className="w-full h-11 text-base font-semibold bg-red-600 hover:bg-red-700 text-white shadow-md transition-all"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              {loading ? "Création du compte..." : "S'inscrire"}
            </Button>
          </form>

          {oidcEnabled && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <Button
                type="button"
                onClick={handleOidcLogin}
                disabled={oidcLoading || loading}
                className="w-full h-11 text-base font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all"
              >
                <KeyRound className="w-4 h-4 mr-2" />
                {oidcLoading ? "Redirection..." : `S'inscrire via ${oidcProviderName}`}
              </Button>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col gap-2">
            <Button
              onClick={() => router.push("/login")}
              variant="outline"
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Déjà un compte ? Se connecter
            </Button>
            <Button
              onClick={() => router.push("/")}
              variant="ghost"
              className="w-full text-gray-600 hover:bg-gray-100"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à l'accueil
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}