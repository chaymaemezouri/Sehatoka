import { FileText, FlaskConical, FolderHeart, Pill } from "lucide-react"
import { useLocale } from "@/i18n/useLocale.ts"

export function FollowUpPage() {
  const { locale } = useLocale()
  const en = locale === "en"
  const tiles = [
    {
      href: "#patient/documents",
      title: en ? "Documents" : "Documents",
      body: en ? "Reports and images you already have." : "Comptes rendus et images que vous avez déjà.",
      icon: FileText,
    },
    {
      href: "#patient/ordonnances",
      title: en ? "Prescriptions" : "Ordonnances",
      body: en ? "Prescriptions you keep yourself." : "Ordonnances que vous conservez.",
      icon: Pill,
    },
    {
      href: "#patient/analyses",
      title: en ? "Lab results" : "Analyses",
      body: en ? "Results you choose to note." : "Résultats que vous notez.",
      icon: FlaskConical,
    },
    {
      href: "#patient/dossier",
      title: en ? "Health record" : "Dossier",
      body: en ? "Allergies, treatments, and vaccines." : "Allergies, traitements et vaccins.",
      icon: FolderHeart,
    },
  ]
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-[2rem] font-medium tracking-[-0.045em]">{en ? "Follow-up" : "Suivi"}</h1>
        <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-ink-soft">
          {en ? "Four places, nothing else. Open the one you need." : "Quatre espaces, rien de plus. Ouvrez celui dont vous avez besoin."}
        </p>
      </header>
      <div className="grid gap-3 sm:grid-cols-2">
        {tiles.map((tile) => {
          const Icon = tile.icon
          return (
            <a
              key={tile.href}
              href={tile.href}
              className="flex gap-4 rounded-[1.6rem] border border-white/75 bg-white/55 p-5 shadow-[inset_0_1px_0_rgb(255_255_255_/_0.95)] backdrop-blur-xl transition-colors hover:bg-white/80"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#f6dde4] text-[#7a3a50]">
                <Icon className="size-4" />
              </span>
              <span>
                <span className="block text-[16px] font-medium tracking-[-0.03em]">{tile.title}</span>
                <span className="mt-1 block text-[13px] leading-relaxed text-ink-soft">{tile.body}</span>
              </span>
            </a>
          )
        })}
      </div>
    </div>
  )
}
