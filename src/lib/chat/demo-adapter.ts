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

function attachDirectory(output: ChatTurnOutput): ChatTurnOutput {
  const recommendation = output.recommendation
  if (!recommendation?.specialtyId || recommendation.urgency === "urgent") {
    return output
  }
  const english = getLocale() === "en"
  return {
    ...output,
    recommendation: {
      ...recommendation,
      ctaLabel: english ? "Find a doctor" : "Trouver un médecin",
      ctaHref: `#patient/medecins?specialite=${recommendation.specialtyId}`,
    },
  }
}

const responses = {
  greeting: reply(
    "Bonjour. Je suis Sehatoka AI. Décrivez ce qui vous amène : je vous oriente vers la spécialité la plus adaptée.",
  ),
  ophthalmology: reply(
    "Une consultation en ophtalmologie peut être appropriée. Ce n'est pas un diagnostic. Après connexion, vous pouvez voir les médecins de cette spécialité et noter une demande de rendez-vous. Aucun créneau n'est réservé ici.",
    {
      specialtyId: "ophthalmology",
      specialtyName: "Ophtalmologie",
      status: "available",
      rationale: "Orientation vers l'ophtalmologie. Les médecins proposés sont ceux du répertoire relié.",
      urgency: "orientation",
    },
  ),
  cardiology: reply(
    "Des signaux évoquant la sphère cardiaque méritent une attention attentive. Un diagnostic ne peut pas être posé ici. Une consultation en cardiologie peut être envisagée. Vous pouvez ouvrir les fiches de cette spécialité et noter une demande : aucun créneau n'est réservé.",
    {
      specialtyId: "cardiology",
      specialtyName: "Cardiologie",
      status: "upcoming",
      rationale: "Orientation vers cette spécialité. Ce n'est pas un diagnostic.",
      urgency: "orientation",
    },
  ),
  dermatology: reply(
    "Une question cutanée oriente souvent vers la dermatologie. Je ne peux ni identifier une lésion ni confirmer une pathologie. Ce n'est pas un diagnostic. Vous pouvez ouvrir les fiches de cette spécialité et noter une demande : aucun créneau n'est réservé.",
    {
      specialtyId: "dermatology",
      specialtyName: "Dermatologie",
      status: "upcoming",
      rationale: "Orientation vers cette spécialité. Ce n'est pas un diagnostic.",
      urgency: "orientation",
    },
  ),
  pediatrics: reply(
    "Lorsqu'il s'agit d'un enfant, une orientation pédiatrique est généralement la plus adaptée. Ce n'est pas un diagnostic. En cas de doute sur la gravité, une évaluation médicale directe reste la conduite la plus sûre. Vous pouvez noter une demande : aucun créneau n'est réservé.",
    {
      specialtyId: "pediatrics",
      specialtyName: "Pédiatrie",
      status: "upcoming",
      rationale: "Orientation vers cette spécialité. Ce n'est pas un diagnostic.",
      urgency: "orientation",
    },
  ),
  gynecology: reply(
    "Ce type de besoin relève le plus souvent de la gynécologie. Sehatoka n'interprète pas ces symptômes et ne pose pas de diagnostic. Vous pouvez noter une demande : aucun créneau n'est réservé.",
    {
      specialtyId: "gynecology",
      specialtyName: "Gynécologie",
      status: "upcoming",
      rationale: "Orientation vers cette spécialité. Ce n'est pas un diagnostic.",
      urgency: "orientation",
    },
  ),
  psychiatry: reply(
    "Une demande liée à la santé mentale peut justifier un avis spécialisé en psychiatrie ou, selon le contexte, un premier recours. Ce n'est pas un diagnostic. Vous pouvez noter une demande : aucun créneau n'est réservé.",
    {
      specialtyId: "psychiatry",
      specialtyName: "Psychiatrie",
      status: "upcoming",
      rationale: "Orientation vers cette spécialité. Ce n'est pas un diagnostic.",
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
    "Pour un inconfort encore indifférencié, la médecine générale est souvent le premier recours le plus sûr. Ce n'est pas un diagnostic. Une évaluation médicale reste recommandée. Vous pouvez noter une demande : aucun créneau n'est réservé.",
    {
      specialtyId: "general-medicine",
      specialtyName: "Médecine générale",
      status: "upcoming",
      rationale: "Orientation vers cette spécialité. Ce n'est pas un diagnostic.",
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
    "Les signes décrits peuvent nécessiter une prise en charge urgente. N'utilisez pas cet assistant pour une situation d'urgence et ne poursuivez pas une demande de rendez-vous. Au Maroc, contactez le SAMU au 141 ou rendez-vous aux urgences. En France, le 15 et le 112, et le 3114 en cas de mal-être intense.",
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
    "Hello. I am Sehatoka AI. Describe what brings you here, and I will guide you toward the most fitting specialty.",
  ),
  ophthalmology: reply(
    "An ophthalmology visit may be appropriate. This is not a diagnosis. After you sign in, you can see doctors in this specialty and note an appointment request. No slot is reserved here.",
    {
      specialtyId: "ophthalmology",
      specialtyName: "Ophthalmology",
      status: "available",
      rationale: "Guidance toward ophthalmology. Listed doctors come from the connected directory.",
      urgency: "orientation",
    },
  ),
  cardiology: reply(
    "Signals that suggest the heart deserve careful attention. A diagnosis cannot be made here. A cardiology visit may be considered.",
    {
      specialtyId: "cardiology",
      specialtyName: "Cardiology",
      status: "upcoming",
      rationale: "Guidance toward this specialty. This is not a diagnosis.",
      urgency: "orientation",
    },
  ),
  dermatology: reply(
    "A skin question often points toward dermatology. I cannot identify a lesion or confirm a condition from a description.",
    {
      specialtyId: "dermatology",
      specialtyName: "Dermatology",
      status: "upcoming",
      rationale: "Guidance toward this specialty. This is not a diagnosis.",
      urgency: "orientation",
    },
  ),
  pediatrics: reply(
    "When a child is concerned, pediatrics is usually the most fitting direction. If the severity is unclear, a direct medical assessment is the safest step.",
    {
      specialtyId: "pediatrics",
      specialtyName: "Pediatrics",
      status: "upcoming",
      rationale: "Guidance toward this specialty. This is not a diagnosis.",
      urgency: "orientation",
    },
  ),
  gynecology: reply(
    "This kind of need most often belongs to gynecology. Sehatoka does not interpret these symptoms.",
    {
      specialtyId: "gynecology",
      specialtyName: "Gynecology",
      status: "upcoming",
      rationale: "Guidance toward this specialty. This is not a diagnosis.",
      urgency: "orientation",
    },
  ),
  psychiatry: reply(
    "A mental-health concern may call for a specialist opinion in psychiatry or, depending on the context, a first point of care. This is not a diagnosis.",
    {
      specialtyId: "psychiatry",
      specialtyName: "Psychiatry",
      status: "upcoming",
      rationale: "Guidance toward this specialty. This is not a diagnosis.",
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
      rationale: "Guidance toward this specialty. This is not a diagnosis.",
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
  const english = getLocale() === "en"

  return {
    content: english
      ? `Preference noted for this conversation: ${windowLabel}. No appointment is reserved. Sign in to open the doctors for this specialty and record a request.`
      : `Préférence notée pour cette conversation : ${windowLabel}. Aucun rendez-vous n'est réservé. Connectez-vous pour ouvrir les médecins de cette spécialité et noter une demande.`,
    recommendation,
    appointment: {
      specialtyName: recommendation?.specialtyName ?? (english ? "General guidance" : "Orientation générale"),
      windowLabel,
      liveModule: false,
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
      return attachDirectory(booking)
    }

    if (isPrepareRequest(input.userMessage)) {
      return replies.prepare
    }

    switch (intent) {
      case intentKind.emergency:
        return replies.emergency
      case intentKind.ophthalmology:
        return attachDirectory(replies.ophthalmology)
      case intentKind.cardiology:
        return attachDirectory(replies.cardiology)
      case intentKind.dermatology:
        return attachDirectory(replies.dermatology)
      case intentKind.pediatrics:
        return attachDirectory(replies.pediatrics)
      case intentKind.gynecology:
        return attachDirectory(replies.gynecology)
      case intentKind.psychiatry:
        return attachDirectory(replies.psychiatry)
      case intentKind.generalMedicine:
        return attachDirectory(replies.generalMedicine)
      case intentKind.greeting:
        return replies.greeting
      default:
        return attachDirectory(replies.uncertain)
    }
  }
}
