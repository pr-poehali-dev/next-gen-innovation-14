import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Icon from "@/components/ui/icon"

interface Game {
  id: string
  title: string
  genre: string
  description: string
  size: string
  addedAt: string
}

interface TrustedUser {
  id: string
  name: string
  login: string
  role: string
  addedAt: string
}

const INITIAL_GAMES: Game[] = [
  { id: "1", title: "Cyber Strike", genre: "Экшен", description: "Динамичный шутер в киберпанк-мире", size: "2.4 GB", addedAt: "2024-12-01" },
  { id: "2", title: "Galaxy Quest", genre: "RPG", description: "Космическая ролевая игра", size: "5.1 GB", addedAt: "2024-12-10" },
  { id: "3", title: "Shadow Realm", genre: "Хоррор", description: "Атмосферный хоррор-квест", size: "1.8 GB", addedAt: "2024-12-15" },
]

function getCredentials() {
  return {
    login: localStorage.getItem("admin_login") || "admin",
    password: localStorage.getItem("admin_password") || "gamevault2024",
  }
}

function getTrustedUsers(): TrustedUser[] {
  try {
    return JSON.parse(localStorage.getItem("trusted_users") || "[]")
  } catch {
    return []
  }
}

export default function AdminDashboard() {
  const [games, setGames] = useState<Game[]>(INITIAL_GAMES)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newGame, setNewGame] = useState({ title: "", genre: "", description: "", size: "" })
  const [siteTitle, setSiteTitle] = useState("GameVault")
  const [accentColor, setAccentColor] = useState("#ef4444")
  const [savedMsg, setSavedMsg] = useState("")

  // Security tab state
  const [currentLogin, setCurrentLogin] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newLogin, setNewLogin] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [securityMsg, setSecurityMsg] = useState<{ text: string; ok: boolean } | null>(null)

  // Trusted users state
  const [trustedUsers, setTrustedUsers] = useState<TrustedUser[]>(getTrustedUsers)
  const [newTrusted, setNewTrusted] = useState({ name: "", login: "", role: "Модератор" })
  const [showTrustedForm, setShowTrustedForm] = useState(false)
  const [trustedMsg, setTrustedMsg] = useState<{ text: string; ok: boolean } | null>(null)

  useEffect(() => {
    if (localStorage.getItem("admin_auth") !== "true") {
      window.location.href = "/admin"
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("admin_auth")
    window.location.href = "/admin"
  }

  const handleAddGame = () => {
    if (!newGame.title) return
    const game: Game = {
      id: Date.now().toString(),
      title: newGame.title,
      genre: newGame.genre || "Другое",
      description: newGame.description,
      size: newGame.size || "—",
      addedAt: new Date().toISOString().split("T")[0],
    }
    setGames([...games, game])
    setNewGame({ title: "", genre: "", description: "", size: "" })
    setShowAddForm(false)
  }

  const handleDelete = (id: string) => {
    setGames(games.filter((g) => g.id !== id))
  }

  const handleSaveDesign = () => {
    setSavedMsg("Настройки сохранены!")
    setTimeout(() => setSavedMsg(""), 2500)
  }

  // Change credentials
  const handleChangeCredentials = (e: React.FormEvent) => {
    e.preventDefault()
    const creds = getCredentials()
    if (currentLogin !== creds.login || currentPassword !== creds.password) {
      setSecurityMsg({ text: "Текущий логин или пароль введён неверно", ok: false })
      return
    }
    if (!newLogin && !newPassword) {
      setSecurityMsg({ text: "Введите новый логин или новый пароль", ok: false })
      return
    }
    if (newPassword && newPassword !== confirmPassword) {
      setSecurityMsg({ text: "Новые пароли не совпадают", ok: false })
      return
    }
    if (newLogin) localStorage.setItem("admin_login", newLogin)
    if (newPassword) localStorage.setItem("admin_password", newPassword)
    setCurrentLogin("")
    setCurrentPassword("")
    setNewLogin("")
    setNewPassword("")
    setConfirmPassword("")
    setSecurityMsg({ text: "Данные успешно обновлены!", ok: true })
    setTimeout(() => setSecurityMsg(null), 3000)
  }

  // Trusted users
  const handleAddTrusted = () => {
    if (!newTrusted.name || !newTrusted.login) return
    const user: TrustedUser = {
      id: Date.now().toString(),
      name: newTrusted.name,
      login: newTrusted.login,
      role: newTrusted.role || "Модератор",
      addedAt: new Date().toISOString().split("T")[0],
    }
    const updated = [...trustedUsers, user]
    setTrustedUsers(updated)
    localStorage.setItem("trusted_users", JSON.stringify(updated))
    setNewTrusted({ name: "", login: "", role: "Модератор" })
    setShowTrustedForm(false)
    setTrustedMsg({ text: "Доверенное лицо добавлено", ok: true })
    setTimeout(() => setTrustedMsg(null), 2500)
  }

  const handleRemoveTrusted = (id: string) => {
    const updated = trustedUsers.filter((u) => u.id !== id)
    setTrustedUsers(updated)
    localStorage.setItem("trusted_users", JSON.stringify(updated))
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-red-500/20 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon name="Shield" size={22} className="text-red-500" />
          <h1 className="font-orbitron text-xl font-bold text-white">
            Game<span className="text-red-500">Vault</span>
            <span className="text-gray-400 text-sm font-normal ml-3 font-geist">Админ-панель</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => window.open("/", "_blank")} className="border-gray-700 text-gray-300 hover:text-white bg-transparent">
            <Icon name="ExternalLink" size={15} />
            Сайт
          </Button>
          <Button variant="outline" size="sm" onClick={handleLogout} className="border-red-500/40 text-red-400 hover:bg-red-500/10 bg-transparent">
            <Icon name="LogOut" size={15} />
            Выйти
          </Button>
        </div>
      </header>

      {/* Stats */}
      <div className="px-6 py-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gray-900 border-red-500/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="bg-red-500/10 p-3 rounded-lg">
              <Icon name="Gamepad2" size={22} className="text-red-500" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Всего игр</p>
              <p className="text-white text-2xl font-bold font-orbitron">{games.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-red-500/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="bg-red-500/10 p-3 rounded-lg">
              <Icon name="Upload" size={22} className="text-red-500" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Загружено сегодня</p>
              <p className="text-white text-2xl font-bold font-orbitron">0</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-red-500/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="bg-red-500/10 p-3 rounded-lg">
              <Icon name="Users" size={22} className="text-red-500" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Доверенных лиц</p>
              <p className="text-white text-2xl font-bold font-orbitron">{trustedUsers.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main tabs */}
      <div className="px-6 pb-10">
        <Tabs defaultValue="games">
          <TabsList className="bg-gray-900 border border-red-500/20 mb-6 flex-wrap h-auto gap-1">
            <TabsTrigger value="games" className="data-[state=active]:bg-red-500 data-[state=active]:text-white font-geist">
              <Icon name="Gamepad2" size={15} />
              Игры
            </TabsTrigger>
            <TabsTrigger value="design" className="data-[state=active]:bg-red-500 data-[state=active]:text-white font-geist">
              <Icon name="Palette" size={15} />
              Дизайн
            </TabsTrigger>
            <TabsTrigger value="content" className="data-[state=active]:bg-red-500 data-[state=active]:text-white font-geist">
              <Icon name="PenLine" size={15} />
              Контент
            </TabsTrigger>
            <TabsTrigger value="trusted" className="data-[state=active]:bg-red-500 data-[state=active]:text-white font-geist">
              <Icon name="UserCheck" size={15} />
              Доверенные лица
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-red-500 data-[state=active]:text-white font-geist">
              <Icon name="KeyRound" size={15} />
              Безопасность
            </TabsTrigger>
          </TabsList>

          {/* GAMES TAB */}
          <TabsContent value="games">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white font-orbitron">Библиотека игр</h2>
              <Button className="bg-red-500 hover:bg-red-600 text-white border-0" onClick={() => setShowAddForm(!showAddForm)}>
                <Icon name="Plus" size={16} />
                Добавить игру
              </Button>
            </div>

            {showAddForm && (
              <Card className="bg-gray-900 border-red-500/30 mb-5">
                <CardHeader>
                  <CardTitle className="text-white font-orbitron text-base">Новая игра</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300 mb-1 block text-sm">Название *</Label>
                    <Input value={newGame.title} onChange={(e) => setNewGame({ ...newGame, title: e.target.value })} placeholder="Название игры" className="bg-black border-gray-700 text-white" />
                  </div>
                  <div>
                    <Label className="text-gray-300 mb-1 block text-sm">Жанр</Label>
                    <Input value={newGame.genre} onChange={(e) => setNewGame({ ...newGame, genre: e.target.value })} placeholder="Экшен, RPG..." className="bg-black border-gray-700 text-white" />
                  </div>
                  <div>
                    <Label className="text-gray-300 mb-1 block text-sm">Описание</Label>
                    <Input value={newGame.description} onChange={(e) => setNewGame({ ...newGame, description: e.target.value })} placeholder="Краткое описание" className="bg-black border-gray-700 text-white" />
                  </div>
                  <div>
                    <Label className="text-gray-300 mb-1 block text-sm">Размер</Label>
                    <Input value={newGame.size} onChange={(e) => setNewGame({ ...newGame, size: e.target.value })} placeholder="1.2 GB" className="bg-black border-gray-700 text-white" />
                  </div>
                  <div className="sm:col-span-2 flex gap-3">
                    <Button className="bg-red-500 hover:bg-red-600 text-white border-0" onClick={handleAddGame}>
                      <Icon name="Check" size={16} /> Сохранить
                    </Button>
                    <Button variant="outline" onClick={() => setShowAddForm(false)} className="border-gray-700 text-gray-300 bg-transparent">
                      Отмена
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="space-y-3">
              {games.map((game) => (
                <div key={game.id} className="bg-gray-900 border border-gray-800 rounded-lg p-4 flex items-center justify-between hover:border-red-500/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="bg-red-500/10 p-2 rounded-lg">
                      <Icon name="Gamepad2" size={20} className="text-red-500" />
                    </div>
                    <div>
                      <p className="text-white font-semibold font-geist">{game.title}</p>
                      <p className="text-gray-400 text-sm">{game.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="bg-gray-800 text-gray-300 hidden sm:flex">{game.genre}</Badge>
                    <span className="text-gray-500 text-sm hidden sm:block">{game.size}</span>
                    <Button size="sm" variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10 bg-transparent" onClick={() => handleDelete(game.id)}>
                      <Icon name="Trash2" size={15} />
                    </Button>
                  </div>
                </div>
              ))}
              {games.length === 0 && (
                <div className="text-center py-16 text-gray-500">
                  <Icon name="Gamepad2" size={40} className="mx-auto mb-3 opacity-30" />
                  <p>Нет игр. Добавьте первую!</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* DESIGN TAB */}
          <TabsContent value="design">
            <Card className="bg-gray-900 border-red-500/20 max-w-lg">
              <CardHeader>
                <CardTitle className="text-white font-orbitron text-base">Настройки дизайна</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div>
                  <Label className="text-gray-300 mb-2 block">Название сайта</Label>
                  <Input value={siteTitle} onChange={(e) => setSiteTitle(e.target.value)} className="bg-black border-gray-700 text-white" />
                </div>
                <div>
                  <Label className="text-gray-300 mb-2 block">Акцентный цвет</Label>
                  <div className="flex items-center gap-3">
                    <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="w-10 h-10 rounded cursor-pointer border-0 bg-transparent" />
                    <span className="text-gray-400 font-mono text-sm">{accentColor}</span>
                  </div>
                </div>
                <Button className="bg-red-500 hover:bg-red-600 text-white border-0" onClick={handleSaveDesign}>
                  <Icon name="Save" size={16} />
                  Сохранить
                </Button>
                {savedMsg && <p className="text-green-400 text-sm flex items-center gap-1"><Icon name="Check" size={14} />{savedMsg}</p>}
              </CardContent>
            </Card>
          </TabsContent>

          {/* CONTENT TAB */}
          <TabsContent value="content">
            <Card className="bg-gray-900 border-red-500/20 max-w-lg">
              <CardHeader>
                <CardTitle className="text-white font-orbitron text-base">Редактор контента</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div>
                  <Label className="text-gray-300 mb-2 block">Заголовок главной страницы</Label>
                  <Input defaultValue="Game Vault" className="bg-black border-gray-700 text-white" />
                </div>
                <div>
                  <Label className="text-gray-300 mb-2 block">Подзаголовок</Label>
                  <Input defaultValue="Внутренняя платформа для загрузки и управления играми." className="bg-black border-gray-700 text-white" />
                </div>
                <div>
                  <Label className="text-gray-300 mb-2 block">Текст кнопки CTA</Label>
                  <Input defaultValue="Перейти в каталог" className="bg-black border-gray-700 text-white" />
                </div>
                <Button className="bg-red-500 hover:bg-red-600 text-white border-0" onClick={handleSaveDesign}>
                  <Icon name="Save" size={16} />
                  Сохранить
                </Button>
                {savedMsg && <p className="text-green-400 text-sm flex items-center gap-1"><Icon name="Check" size={14} />{savedMsg}</p>}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TRUSTED USERS TAB */}
          <TabsContent value="trusted">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-white font-orbitron">Доверенные лица</h2>
                <p className="text-gray-400 text-sm mt-1">Пользователи с доступом к платформе</p>
              </div>
              <Button className="bg-red-500 hover:bg-red-600 text-white border-0" onClick={() => setShowTrustedForm(!showTrustedForm)}>
                <Icon name="UserPlus" size={16} />
                Добавить
              </Button>
            </div>

            {showTrustedForm && (
              <Card className="bg-gray-900 border-red-500/30 mb-5 max-w-lg">
                <CardHeader>
                  <CardTitle className="text-white font-orbitron text-base">Новое доверенное лицо</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-gray-300 mb-1 block text-sm">Имя *</Label>
                    <Input value={newTrusted.name} onChange={(e) => setNewTrusted({ ...newTrusted, name: e.target.value })} placeholder="Иван Иванов" className="bg-black border-gray-700 text-white" />
                  </div>
                  <div>
                    <Label className="text-gray-300 mb-1 block text-sm">Логин *</Label>
                    <Input value={newTrusted.login} onChange={(e) => setNewTrusted({ ...newTrusted, login: e.target.value })} placeholder="ivan123" className="bg-black border-gray-700 text-white" />
                  </div>
                  <div>
                    <Label className="text-gray-300 mb-1 block text-sm">Роль</Label>
                    <Input value={newTrusted.role} onChange={(e) => setNewTrusted({ ...newTrusted, role: e.target.value })} placeholder="Модератор, Редактор..." className="bg-black border-gray-700 text-white" />
                  </div>
                  <div className="flex gap-3">
                    <Button className="bg-red-500 hover:bg-red-600 text-white border-0" onClick={handleAddTrusted}>
                      <Icon name="Check" size={16} /> Добавить
                    </Button>
                    <Button variant="outline" onClick={() => setShowTrustedForm(false)} className="border-gray-700 text-gray-300 bg-transparent">
                      Отмена
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {trustedMsg && (
              <div className={`flex items-center gap-2 text-sm mb-4 ${trustedMsg.ok ? "text-green-400" : "text-red-400"}`}>
                <Icon name={trustedMsg.ok ? "Check" : "AlertCircle"} size={15} />
                {trustedMsg.text}
              </div>
            )}

            <div className="space-y-3 max-w-2xl">
              {trustedUsers.map((user) => (
                <div key={user.id} className="bg-gray-900 border border-gray-800 rounded-lg p-4 flex items-center justify-between hover:border-red-500/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="bg-red-500/10 p-2 rounded-full">
                      <Icon name="User" size={20} className="text-red-500" />
                    </div>
                    <div>
                      <p className="text-white font-semibold font-geist">{user.name}</p>
                      <p className="text-gray-400 text-sm">@{user.login} · добавлен {user.addedAt}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="bg-gray-800 text-gray-300">{user.role}</Badge>
                    <Button size="sm" variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10 bg-transparent" onClick={() => handleRemoveTrusted(user.id)}>
                      <Icon name="Trash2" size={15} />
                    </Button>
                  </div>
                </div>
              ))}
              {trustedUsers.length === 0 && (
                <div className="text-center py-16 text-gray-500">
                  <Icon name="Users" size={40} className="mx-auto mb-3 opacity-30" />
                  <p>Нет доверенных лиц. Добавьте первого!</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* SECURITY TAB */}
          <TabsContent value="security">
            <Card className="bg-gray-900 border-red-500/20 max-w-lg">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Icon name="KeyRound" size={18} className="text-red-500" />
                  <CardTitle className="text-white font-orbitron text-base">Смена логина и пароля</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleChangeCredentials} className="space-y-5">
                  <div className="border-b border-gray-800 pb-5">
                    <p className="text-gray-400 text-sm mb-4">Подтвердите текущие данные</p>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-gray-300 mb-1 block text-sm">Текущий логин</Label>
                        <Input
                          value={currentLogin}
                          onChange={(e) => setCurrentLogin(e.target.value)}
                          placeholder="Введите текущий логин"
                          className="bg-black border-gray-700 text-white"
                          required
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300 mb-1 block text-sm">Текущий пароль</Label>
                        <Input
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="••••••••"
                          className="bg-black border-gray-700 text-white"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm mb-4">Новые данные (заполните что хотите изменить)</p>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-gray-300 mb-1 block text-sm">Новый логин</Label>
                        <Input
                          value={newLogin}
                          onChange={(e) => setNewLogin(e.target.value)}
                          placeholder="Оставьте пустым, чтобы не менять"
                          className="bg-black border-gray-700 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300 mb-1 block text-sm">Новый пароль</Label>
                        <Input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Оставьте пустым, чтобы не менять"
                          className="bg-black border-gray-700 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300 mb-1 block text-sm">Повторите новый пароль</Label>
                        <Input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className="bg-black border-gray-700 text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {securityMsg && (
                    <div className={`flex items-center gap-2 text-sm ${securityMsg.ok ? "text-green-400" : "text-red-400"}`}>
                      <Icon name={securityMsg.ok ? "Check" : "AlertCircle"} size={15} />
                      {securityMsg.text}
                    </div>
                  )}

                  <Button type="submit" className="bg-red-500 hover:bg-red-600 text-white border-0 w-full">
                    <Icon name="Save" size={16} />
                    Сохранить изменения
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
