import { OPTHOCARE_URL } from "@/data/site.ts"
import { getLocale } from "@/i18n/store.ts"
import { normalizeText } from "@/lib/utils.ts"
import { detectIntent, detectWindow, intentKind, wantsAppointment } from "@/lib/chat/intents.ts"
import type {
  ChatAdapter,
  ChatMessage,
  ChatTurnOutput,
  Recommendation,
} from "@/types/chat.ts"

function wait(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

function reply(
  content: string,
  recommendation?: Recommendation,
): ChatTurnOutput {
  return { content, recommendation }
}

const responses = {
  greeting: reply(
    "Bonjour. Je suis Sehatoka AI, un assistant d'orientation en démonstration. Décrivez un besoin ou un inconfort — je vous indiquerai la spécialité la plus cohérente, sans poser de diagnostic.",
  ),
  ophthalmology: reply(
    "Une consultation en ophtalmologie peut être appropriée. OphthoCare peut prendre le relais — sans diagnostic de notre part.",
    {
      specialtyId: "ophthalmology",
      specialtyName: "Ophtalmologie",
      status: "available",
      rationale:
        "Module existant — orientation vers OphthoCare pour le parcours oculaire.",
      ctaLabel: "Accéder à OphthoCare",
      ctaHref: OPTHOCARE_URL,
      urgency: "orientation",
    },
  ),
  cardiology: reply(
    "Des signaux évoquant la sphère cardiaque méritent une attention attentive, sans qu'un diagnostic ne puisse être posé ici. Une consultation en cardiologie peut être envisagée. Ce module n'est pas encore intégré à Sehatoka.",
    {
      specialtyId: "cardiology",
      specialtyName: "Cardiologie",
      status: "upcoming",
      rationale: "Spécialité envisagée — service en préparation.",
      urgency: "orientation",
    },
  ),
  dermatology: reply(
    "Une question cutanée oriente souvent vers la dermatologie. Je ne peux ni identifier une lésion ni confirmer une pathologie à partir d'une description. Le module dermatologique de Sehatoka n'est pas encore disponible.",
    {
      specialtyId: "dermatology",
      specialtyName: "Dermatologie",
      status: "upcoming",
      rationale: "Spécialité envisagée — service en préparation.",
      urgency: "orientation",
    },
  ),
  pediatrics: reply(
    "Lorsqu'il s'agit d'un enfant, une orientation pédiatrique est généralement la plus adaptée. Ce module n'est pas encore intégré. En cas de doute sur la gravité, une évaluation médicale directe reste la conduite la plus sûre.",
    {
      specialtyId: "pediatrics",
      specialtyName: "Pédiatrie",
      status: "upcoming",
      rationale: "Spécialité envisagée — service en préparation.",
      urgency: "orientation",
    },
  ),
  gynecology: reply(
    "Ce type de besoin relève le plus souvent de la gynécologie. Sehatoka n'interprète pas ces symptômes. Le module dédié est encore en préparation.",
    {
      specialtyId: "gynecology",
      specialtyName: "Gynécologie",
      status: "upcoming",
      rationale: "Spécialité envisagée — service en préparation.",
      urgency: "orientation",
    },
  ),
  psychiatry: reply(
    "Une demande liée à la santé mentale peut justifier un avis spécialisé en psychiatrie ou, selon le contexte, un premier recours. Ce n'est pas un diagnostic. Le module n'est pas encore disponible sur Sehatoka.",
    {
      specialtyId: "psychiatry",
      specialtyName: "Psychiatrie",
      status: "upcoming",
      rationale: "Spécialité envisagée — service en préparation.",
      urgency: "orientation",
    },
  ),
  prepare: reply(
    "Avant une orientation, préparez ce que vous savez déjà : depuis quand le besoin existe, ce qui le soulage ou l'aggrave, et les traitements en cours. Sehatoka ne pose pas de diagnostic et ne remplace pas le dossier médical.",
  ),
  appointmentAsk: reply(
    "Vous pouvez formuler une demande de rendez-vous d'orientation. Indiquez une préférence : matin, après-midi, ou cette semaine. Aucun créneau n'est réservé ici, et aucun professionnel n'est désigné.",
  ),
  generalMedicine: reply(
    "Pour un inconfort encore indifférencié, la médecine générale est souvent le premier recours le plus sûr. Elle n'est pas encore proposée comme module Sehatoka. Une évaluation médicale reste recommandée plutôt qu'une conclusion ici.",
    {
      specialtyId: "general-medicine",
      specialtyName: "Médecine générale",
      status: "upcoming",
      rationale: "Spécialité envisagée — service en préparation.",
      urgency: "orientation",
    },
  ),
  uncertain: reply(
    "Les éléments partagés ne permettent pas d'orienter vers une seule spécialité avec suffisamment de clarté. Sehatoka ne pose pas de diagnostic. Une évaluation médicale — souvent en médecine générale — est la prochaine étape la plus prudente.",
    {
      specialtyId: "general-medicine",
      specialtyName: "Médecine générale",
      status: "upcoming",
      rationale:
        "Orientation prudente — une évaluation médicale est recommandée, sans diagnostic.",
      urgency: "orientation",
    },
  ),
  emergency: reply(
    "Les signes décrits peuvent nécessiter une prise en charge urgente. N'utilisez pas cet assistant pour une situation d'urgence. En France, composez le 15 (SAMU) ou le 112. Si les symptômes sont soudains ou sévères, rendez-vous aux urgences. Pour un mal-être intense, le 3114 est également disponible.",
    {
      specialtyName: "Soins urgents",
      status: "urgent",
      rationale:
        "Orientation d'urgence — cet assistant ne gère pas les situations critiques.",
      urgency: "urgent",
    },
  ),
} as const

const responsesEn = {
  greeting: reply(
    "Hello. I am Sehatoka AI, a guidance assistant in demonstration. Describe a need or a discomfort — I will point you to the most fitting specialty, without making a diagnosis.",
  ),
  ophthalmology: reply(
    "An ophthalmology visit may be appropriate. OphthoCare can take the next step — we do not make a diagnosis.",
    {
      specialtyId: "ophthalmology",
      specialtyName: "Ophthalmology",
      status: "available",
      rationale: "Existing module — guidance toward OphthoCare for the eye pathway.",
      ctaLabel: "Open OphthoCare",
      ctaHref: OPTHOCARE_URL,
      urgency: "orientation",
    },
  ),
  cardiology: reply(
    "Signals that suggest the heart deserve careful attention. A diagnosis cannot be made here. A cardiology visit may be considered.",
    {
      specialtyId: "cardiology",
      specialtyName: "Cardiology",
      status: "upcoming",
      rationale: "Specialty considered.",
      urgency: "orientation",
    },
  ),
  dermatology: reply(
    "A skin question often points toward dermatology. I cannot identify a lesion or confirm a condition from a description.",
    {
      specialtyId: "dermatology",
      specialtyName: "Dermatology",
      status: "upcoming",
      rationale: "Specialty considered.",
      urgency: "orientation",
    },
  ),
  pediatrics: reply(
    "When a child is concerned, pediatrics is usually the most fitting direction. If the severity is unclear, a direct medical assessment is the safest step.",
    {
      specialtyId: "pediatrics",
      specialtyName: "Pediatrics",
      status: "upcoming",
      rationale: "Specialty considered.",
      urgency: "orientation",
    },
  ),
  gynecology: reply(
    "This kind of need most often belongs to gynecology. Sehatoka does not interpret these symptoms.",
    {
      specialtyId: "gynecology",
      specialtyName: "Gynecology",
      status: "upcoming",
      rationale: "Specialty considered.",
      urgency: "orientation",
    },
  ),
  psychiatry: reply(
    "A mental-health concern may call for a specialist opinion in psychiatry or, depending on the context, a first point of care. This is not a diagnosis.",
    {
      specialtyId: "psychiatry",
      specialtyName: "Psychiatry",
      status: "upcoming",
      rationale: "Specialty considered.",
      urgency: "orientation",
    },
  ),
  prepare: reply(
    "Before a visit, note what you already know: how long the need has been present, what relieves or worsens it, and any current treatments. Sehatoka does not diagnose and does not replace a medical record.",
  ),
  appointmentAsk: reply(
    "You can make a guidance appointment request. Choose a preference: morning, afternoon, or this week. No slot is reserved here, and no professional is assigned.",
  ),
  generalMedicine: reply(
    "For a discomfort that is still undifferentiated, general medicine is often the safest first step. A medical assessment is recommended rather than a conclusion here.",
    {
      specialtyId: "general-medicine",
      specialtyName: "General medicine",
      status: "upcoming",
      rationale: "Specialty considered.",
      urgency: "orientation",
    },
  ),
  uncertain: reply(
    "What was shared is not enough to point to a single specialty with clarity. Sehatoka does not diagnose. A medical assessment — often in general medicine — is the most careful next step.",
    {
      specialtyId: "general-medicine",
      specialtyName: "General medicine",
      status: "upcoming",
      rationale: "Careful guidance — a medical assessment is recommended, without a diagnosis.",
      urgency: "orientation",
    },
  ),
  emergency: reply(
    "The signs described may need urgent care. Do not use this assistant for an emergency. Call the local emergency number. If symptoms are sudden or severe, go to emergency care.",
    {
      specialtyName: "Urgent care",
      status: "urgent",
      rationale: "Emergency guidance — this assistant does not handle critical situations.",
      urgency: "urgent",
    },
  ),
} as const

function activeResponses() {
  return getLocale() === "en" ? responsesEn : responses
}

function latestRecommendation(history: readonly ChatMessage[]) {
  for (let index = history.length - 1; index >= 0; index -= 1) {
    const recommendation = history[index]?.recommendation
    if (recommendation && recommendation.urgency !== "urgent") {
      return recommendation
    }
  }
  return undefined
}

function awaitingWindow(history: readonly ChatMessage[]) {
  const last = [...history].reverse().find((message) => message.role === "assistant")
  const content = last?.content.toLowerCase() ?? ""
  return content.includes("préférence") || content.includes("preference")
}

function isPrepareRequest(message: string) {
  const text = normalizeText(message)
  return ["preparer", "quoi apporter", "avant l'orientation", "avant l orientation", "prepare", "before the"].some(
    (pattern) => text.includes(pattern),
  )
}

function bookingTurn(
  message: string,
  history: readonly ChatMessage[],
  intent: ReturnType<typeof detectIntent>,
): ChatTurnOutput | null {
  if (intent === intentKind.emergency) {
    return null
  }

  const windowLabel = detectWindow(message)
  const booking = wantsAppointment(message)
  if (!booking && !(windowLabel && awaitingWindow(history))) {
    return null
  }

  if (!windowLabel) {
    return activeResponses().appointmentAsk
  }

  const recommendation = latestRecommendation(history)
  const liveModule = recommendation?.specialtyId === "ophthalmology"
  const english = getLocale() === "en"

  return {
    content: liveModule
      ? english
        ? `Request noted for this session. Preference: ${windowLabel}. No slot is reserved and no professional is assigned. OphthoCare can continue the eye pathway.`
        : `Demande notée pour cette session. Préférence : ${windowLabel}. Aucun créneau n'est réservé et aucun professionnel n'est désigné. OphthoCare peut poursuivre le parcours oculaire.`
      : english
        ? `Request noted for this session. Preference: ${windowLabel}. Nothing is reserved.`
        : `Demande notée pour cette session. Préférence : ${windowLabel}. Ce module n'ouvre pas encore de rendez-vous : rien n'est réservé.`,
    recommendation,
    appointment: {
      specialtyName: recommendation?.specialtyName ?? "Orientation générale",
      windowLabel,
      liveModule,
    },
  }
}

export class DemoChatAdapter implements ChatAdapter {
  readonly id = "demo"
  readonly modeLabel = "Mode démonstration"

  async complete(input: {
    userMessage: string
    history: readonly ChatMessage[]
  }): Promise<ChatTurnOutput> {
    const intent = detectIntent(input.userMessage)
    const duration = Math.min(1400, 520 + input.userMessage.length * 8)
    await wait(duration)

    const replies = activeResponses()
    const booking = bookingTurn(input.userMessage, input.history, intent)
    if (booking) {
      return booking
    }

    if (isPrepareRequest(input.userMessage)) {
      return replies.prepare
    }

    switch (intent) {
      case intentKind.emergency:
        return replies.emergency
      case intentKind.ophthalmology:
        return replies.ophthalmology
      case intentKind.cardiology:
        return replies.cardiology
      case intentKind.dermatology:
        return replies.dermatology
      case intentKind.pediatrics:
        return replies.pediatrics
      case intentKind.gynecology:
        return replies.gynecology
      case intentKind.psychiatry:
        return replies.psychiatry
      case intentKind.generalMedicine:
        return replies.generalMedicine
      case intentKind.greeting:
        return replies.greeting
      default:
        return replies.uncertain
    }
  }
}
