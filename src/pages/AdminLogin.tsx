import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Icon from "@/components/ui/icon"

const ADMIN_LOGIN = "admin"
const ADMIN_PASSWORD = "gamevault2024"

export default function AdminLogin() {
  const [login, setLogin] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    setTimeout(() => {
      if (login === ADMIN_LOGIN && password === ADMIN_PASSWORD) {
        localStorage.setItem("admin_auth", "true")
        window.location.href = "/admin/dashboard"
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
          <p className="text-gray-400 font-geist">Вход в административную панель</p>
        </div>

        <div className="bg-gray-900 border border-red-500/20 rounded-xl p-8">
          <div className="flex items-center gap-2 mb-6">
            <Icon name="Shield" size={20} className="text-red-500" />
            <span className="text-white font-orbitron font-semibold">Авторизация</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label className="text-gray-300 font-geist mb-2 block">Логин</Label>
              <Input
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder="admin"
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

          <p className="text-gray-600 text-xs text-center mt-6 font-geist">
            Доступ только для авторизованных администраторов
          </p>
        </div>
      </div>
    </div>
  )
}
