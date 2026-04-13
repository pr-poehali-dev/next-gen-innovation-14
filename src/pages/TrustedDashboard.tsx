import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Icon from "@/components/ui/icon"

interface Game {
  id: string
  title: string
  genre: string
  description: string
  size: string
  downloadUrl: string
  addedAt: string
}

interface TrustedUser {
  id: string
  name: string
  login: string
  role: string
}

const INITIAL_GAMES: Game[] = [
  { id: "1", title: "Cyber Strike", genre: "Экшен", description: "Динамичный шутер в киберпанк-мире", size: "2.4 GB", downloadUrl: "", addedAt: "2024-12-01" },
  { id: "2", title: "Galaxy Quest", genre: "RPG", description: "Космическая ролевая игра", size: "5.1 GB", downloadUrl: "", addedAt: "2024-12-10" },
  { id: "3", title: "Shadow Realm", genre: "Хоррор", description: "Атмосферный хоррор-квест", size: "1.8 GB", downloadUrl: "", addedAt: "2024-12-15" },
]

export default function TrustedDashboard() {
  const [user, setUser] = useState<TrustedUser | null>(null)
  const [games] = useState<Game[]>(INITIAL_GAMES)
  const [search, setSearch] = useState("")

  useEffect(() => {
    if (localStorage.getItem("trusted_auth") !== "true") {
      window.location.href = "/trusted"
      return
    }
    try {
      const current = JSON.parse(localStorage.getItem("trusted_current") || "{}")
      if (current?.id) setUser(current)
    } catch {
      window.location.href = "/trusted"
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("trusted_auth")
    localStorage.removeItem("trusted_current")
    window.location.href = "/trusted"
  }

  const filtered = games.filter(
    (g) =>
      g.title.toLowerCase().includes(search.toLowerCase()) ||
      g.genre.toLowerCase().includes(search.toLowerCase())
  )

  if (!user) return null

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-red-500/20 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon name="UserCheck" size={22} className="text-red-500" />
          <h1 className="font-orbitron text-xl font-bold text-white">
            Game<span className="text-red-500">Vault</span>
            <span className="text-gray-400 text-sm font-normal ml-3 font-geist">Просмотр</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-lg">
            <Icon name="User" size={14} className="text-red-500" />
            <span className="text-gray-300 text-sm font-geist">{user.name}</span>
            <Badge variant="secondary" className="bg-gray-700 text-gray-300 text-xs">{user.role}</Badge>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout} className="border-red-500/40 text-red-400 hover:bg-red-500/10 bg-transparent">
            <Icon name="LogOut" size={15} />
            Выйти
          </Button>
        </div>
      </header>

      <div className="px-6 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold font-orbitron text-white mb-1">
            Привет, {user.name}!
          </h2>
          <p className="text-gray-400 font-geist text-sm">
            Ваша роль: <span className="text-red-400">{user.role}</span> · Просмотр и скачивание игр
          </p>
        </div>

        {/* Info banner */}
        <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 mb-8 max-w-2xl">
          <Icon name="Info" size={18} className="text-red-400 mt-0.5 flex-shrink-0" />
          <p className="text-gray-300 text-sm font-geist">
            Вы можете просматривать и скачивать игры. Для управления каталогом обратитесь к администратору.
          </p>
        </div>

        {/* Search */}
        <div className="flex items-center gap-3 mb-6 max-w-md">
          <div className="relative flex-1">
            <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по названию или жанру..."
              className="w-full bg-gray-900 border border-gray-700 text-white pl-9 pr-4 py-2.5 rounded-lg text-sm font-geist focus:outline-none focus:border-red-500/50 placeholder:text-gray-600"
            />
          </div>
        </div>

        {/* Games grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl">
          {filtered.map((game) => (
            <Card key={game.id} className="bg-gray-900 border-gray-800 hover:border-red-500/30 transition-colors">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="bg-red-500/10 p-2.5 rounded-lg">
                    <Icon name="Gamepad2" size={22} className="text-red-500" />
                  </div>
                  <Badge variant="secondary" className="bg-gray-800 text-gray-300 text-xs">{game.genre}</Badge>
                </div>
                <h3 className="text-white font-semibold font-geist mb-1">{game.title}</h3>
                <p className="text-gray-400 text-sm mb-3 leading-relaxed">{game.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500 font-geist mb-4">
                  <span className="flex items-center gap-1">
                    <Icon name="HardDrive" size={12} />
                    {game.size}
                  </span>
                  <span>{game.addedAt}</span>
                </div>
                {game.downloadUrl ? (
                  <a href={game.downloadUrl} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" className="w-full bg-red-500 hover:bg-red-600 text-white border-0 font-geist">
                      <Icon name="Download" size={15} />
                      Скачать
                    </Button>
                  </a>
                ) : (
                  <Button size="sm" disabled className="w-full bg-gray-800 text-gray-500 border-0 font-geist cursor-not-allowed">
                    <Icon name="Clock" size={15} />
                    Ссылка не добавлена
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-3 text-center py-16 text-gray-500">
              <Icon name="SearchX" size={36} className="mx-auto mb-3 opacity-30" />
              <p>Ничего не найдено</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}