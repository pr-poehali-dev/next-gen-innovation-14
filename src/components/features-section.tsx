import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Icon from "@/components/ui/icon"

const features = [
  {
    title: "Загрузка игр",
    description: "Быстрая загрузка игровых файлов любого формата. Поддержка архивов, exe, apk и других форматов.",
    icon: "upload",
    badge: "Хранилище",
  },
  {
    title: "Управление каталогом",
    description: "Полный контроль над библиотекой игр — добавление, редактирование, удаление и организация по жанрам.",
    icon: "grid",
    badge: "Каталог",
  },
  {
    title: "Редактор дизайна",
    description: "Настройка внешнего вида платформы прямо из браузера без знаний программирования.",
    icon: "palette",
    badge: "Дизайн",
  },
  {
    title: "Быстрый доступ",
    description: "Мгновенная выдача файлов пользователям с контролем доступа и авторизацией.",
    icon: "zap",
    badge: "Скорость",
  },
  {
    title: "Административный доступ",
    description: "Защищённая панель управления с разграничением прав и полным логированием действий.",
    icon: "shield",
    badge: "Безопасность",
  },
  {
    title: "Редактор контента",
    description: "Управление текстами, изображениями и описаниями страниц прямо из админ-панели.",
    icon: "edit",
    badge: "CMS",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16" id="features">
          <h2 className="text-4xl font-bold text-foreground mb-4 font-sans">Всё для управления играми</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Полный набор инструментов для загрузки, управления и настройки игровой платформы
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="glow-border hover:shadow-lg transition-all duration-300 slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-red-500">
                    {feature.icon === "upload" && <Icon name="Upload" size={32} />}
                    {feature.icon === "grid" && <Icon name="LayoutGrid" size={32} />}
                    {feature.icon === "palette" && <Icon name="Palette" size={32} />}
                    {feature.icon === "zap" && <Icon name="Zap" size={32} />}
                    {feature.icon === "shield" && <Icon name="Shield" size={32} />}
                    {feature.icon === "edit" && <Icon name="PenLine" size={32} />}
                  </span>
                  <Badge variant="secondary" className="bg-accent text-accent-foreground">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-xl font-bold text-card-foreground">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}