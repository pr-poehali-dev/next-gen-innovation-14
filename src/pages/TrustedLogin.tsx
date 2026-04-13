import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Icon from "@/components/ui/icon"

interface TrustedUser {
  id: string
  name: string
  login: string
  password: string
  role: string
  addedAt: string
}

function getTrustedUsers(): TrustedUser[] {
  try {
    return JSON.parse(localStorage.getItem("trusted_users") || "[]")
  } catch {
    return []
  }
}

export default function TrustedLogin() {
  const [login, setLogin] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    setTimeout(() => {
      const users = getTrustedUsers()
      const found = users.find((u) => u.login === login && u.password === password)
      if (found) {
        localStorage.setItem("trusted_auth", "true")
        localStorage.setItem("trusted_current", JSON.stringify(found))
        window.location.href = "/trusted/dashboard"
      } else {
        setError("Неверный логин или пароль")
      }
      setLoading(false)
    }, 600)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-orbitron text-3xl font-bold text-white mb-2">
            Game<span className="text-red-500">Vault</span>
          </h1>
          <p className="text-gray-400 font-geist">Вход для доверенных лиц</p>
        </div>

        <div className="bg-gray-900 border border-red-500/20 rounded-xl p-8">
          <div className="flex items-center gap-2 mb-6">
            <Icon name="UserCheck" size={20} className="text-red-500" />
            <span className="text-white font-orbitron font-semibold">Авторизация</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label className="text-gray-300 font-geist mb-2 block">Логин</Label>
              <Input
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder="Ваш логин"
                className="bg-black border-red-500/30 text-white placeholder:text-gray-600 focus:border-red-500"
                required
              />
            </div>

            <div>
              <Label className="text-gray-300 font-geist mb-2 block">Пароль</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-black border-red-500/30 text-white placeholder:text-gray-600 focus:border-red-500"
                required
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <Icon name="AlertCircle" size={16} />
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-geist border-0 h-11"
            >
              {loading ? (
                <Icon name="Loader2" size={18} className="animate-spin" />
              ) : (
                <>
                  <Icon name="LogIn" size={18} />
                  Войти
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-gray-800 text-center">
            <a href="/admin" className="text-gray-500 text-xs hover:text-red-400 transition-colors font-geist">
              Вход для администратора →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
