import { Badge } from "@/components/ui/badge.tsx"
import type { SpecialtyStatus } from "@/types/specialty.ts"

interface StatusTagProps {
  status: SpecialtyStatus | "urgent"
}

const labels: Record<StatusTagProps["status"], string> = {
  available: "Module existant",
  upcoming: "En préparation",
  urgent: "Conduite urgente",
}

export function StatusTag({ status }: StatusTagProps) {
  const tone =
    status === "available" ? "emerald" : status === "urgent" ? "danger" : "muted"

  return <Badge tone={tone}>{labels[status]}</Badge>
}
