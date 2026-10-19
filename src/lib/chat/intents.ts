import { getLocale } from "@/i18n/store.ts"
import { normalizeText } from "@/lib/utils.ts"

export const intentKind = {
  emergency: "emergency",
  ophthalmology: "ophthalmology",
  cardiology: "cardiology",
  dermatology: "dermatology",
  pediatrics: "pediatrics",
  gynecology: "gynecology",
  psychiatry: "psychiatry",
  generalMedicine: "general-medicine",
  greeting: "greeting",
  uncertain: "uncertain",
} as const

export type IntentKind = (typeof intentKind)[keyof typeof intentKind]

interface PatternSet {
  kind: IntentKind
  patterns: readonly string[]
}

const emergencyPatterns = [
  "perte de vision soudaine",
  "perte brutale de la vue",
  "je ne vois plus",
  "cecite soudaine",
  "douleur thoracique",
  "douleur dans la poitrine",
  "serrage dans la poitrine",
  "oppression thoracique",
  "douleur intense a la poitrine",
  "difficulte a respirer",
  "difficultes a respirer",
  "difficultes respiratoires",
  "je n arrive plus a respirer",
  "je n'arrive plus a respirer",
  "essoufflement severe",
  "etouffe",
  "avc",
  "paralysie",
  "faiblesse d un cote",
  "suicide",
  "me tuer",
  "en finir",
  "hemorragie",
  "perte de connaissance",
  "convulsion",
  "en cas d urgence",
  "signes urgents",
  "semblent urgents",
  "urgent",
  "emergency",
]

const specialties: PatternSet[] = [
  {
    kind: intentKind.ophthalmology,
    patterns: [
      "oeil",
      "yeux",
      "vision",
      "vue",
      "flou",
      "floue",
      "myopie",
      "cataracte",
      "glaucome",
      "retine",
      "conjonctivite",
      "lunettes",
      "lentilles",
      "secheresse oculaire",
      "gene aux yeux",
      "gene oculaire",
      "rougeur oculaire",
      "larmoiement",
      "ophtalmo",
      "ophtalmolog",
      "corps etranger dans l oeil",
      "mouches volantes",
      "flashs lumineux",
      "blurred",
      "blurry",
      "eyes",
      "eye discomfort",
    ],
  },
  {
    kind: intentKind.cardiology,
    patterns: [
      "coeur",
      "cardiaque",
      "cardio",
      "palpitation",
      "tachycardie",
      "tension arterielle",
      "hypertension",
      "cholesterol",
      "arythmie",
      "souffle au coeur",
      "essoufflement leger",
      "mal a la poitrine leger",
    ],
  },
  {
    kind: intentKind.dermatology,
    patterns: [
      "peau",
      "dermat",
      "acne",
      "eczema",
      "psoriasis",
      "demangeaison",
      "plaque rouge",
      "bouton",
      "grain de beaute",
      "tache sur la peau",
      "eruption",
      "urticaire",
      "couperose",
      "melanome",
      "skin",
      "itchy",
      "itch",
      "rash",
    ],
  },
  {
    kind: intentKind.pediatrics,
    patterns: [
      "enfant",
      "bebe",
      "nourrisson",
      "pediatr",
      "mon fils",
      "ma fille",
      "adolescent",
      "vaccin enfant",
    ],
  },
  {
    kind: intentKind.gynecology,
    patterns: [
      "gyneco",
      "regles",
      "menstru",
      "utérus",
      "uterus",
      "ovaire",
      "sein",
      "grossesse",
      "contraception",
      "endometriose",
    ],
  },
  {
    kind: intentKind.psychiatry,
    patterns: [
      "anxiete",
      "angoisse",
      "depression",
      "psychiatr",
      "sante mentale",
      "insomnie persistante",
      "crise de panique",
      "burn out",
      "burn-out",
      "troubles du sommeil",
    ],
  },
  {
    kind: intentKind.generalMedicine,
    patterns: [
      "medecine generale",
      "medecin generaliste",
      "generaliste",
      "fievre",
      "fatigue persistante",
      "rhume",
      "grippe",
      "mal de gorge",
      "premier recours",
    ],
  },
]

const greetingPatterns = [
  "bonjour",
  "bonsoir",
  "salut",
  "hello",
  "coucou",
  "merci",
  "hello sehatoka",
]

function includesAny(haystack: string, needles: readonly string[]) {
  return needles.some((needle) => haystack.includes(needle))
}

function scorePatterns(haystack: string, patterns: readonly string[]) {
  return patterns.reduce((score, pattern) => {
    return haystack.includes(pattern) ? score + pattern.length : score
  }, 0)
}

const appointmentPatterns = [
  "rendez-vous",
  "rdv",
  "creneau",
  "reserver",
  "reservation",
  "appointment",
  "book a",
]

const windowPatterns = [
  { fr: "Matin", en: "Morning", patterns: ["matin", "morning"] },
  { fr: "Après-midi", en: "Afternoon", patterns: ["apres-midi", "apres midi", "aprem", "afternoon"] },
  { fr: "Cette semaine", en: "This week", patterns: ["cette semaine", "dans la semaine", "en semaine", "this week"] },
] as const

export function wantsAppointment(rawMessage: string) {
  return includesAny(normalizeText(rawMessage), appointmentPatterns)
}

export function detectWindow(rawMessage: string) {
  const text = normalizeText(rawMessage)
  const match = windowPatterns.find((item) => includesAny(text, item.patterns))
  if (!match) {
    return undefined
  }
  return getLocale() === "en" ? match.en : match.fr
}

export function detectIntent(rawMessage: string): IntentKind {
  const text = normalizeText(rawMessage)

  if (!text) {
    return intentKind.uncertain
  }

  if (includesAny(text, emergencyPatterns)) {
    return intentKind.emergency
  }

  const ranked = specialties
    .map((set) => ({
      kind: set.kind,
      score: scorePatterns(text, set.patterns),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)

  const top = ranked[0]
  const second = ranked[1]

  if (top && second && top.score === second.score) {
    return intentKind.uncertain
  }

  if (top) {
    return top.kind
  }

  if (text.length < 42 && includesAny(text, greetingPatterns)) {
    return intentKind.greeting
  }

  return intentKind.uncertain
}
