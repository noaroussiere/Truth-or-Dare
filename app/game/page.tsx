import TruthOrDareGame from "@/components/TruthOrDareGame"

export default function GamePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-rose-700 to-amber-800 text-white flex flex-col justify-between py-6 px-4">
      <header className="text-center my-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight drop-shadow-md">
          🔥 Action ou Vérité 🔥
        </h1>
      </header>
      <main className="container mx-auto my-auto max-w-xl">
        <TruthOrDareGame />
      </main>
      <footer className="text-center text-xs text-red-200/80 my-2">
        Truth or Dare v0.5.1
      </footer>
    </div>
  )
}
