import { OPTHOCARE_URL } from "@/data/site.ts"
import type { ChatMessage } from "@/types/chat.ts"
import type { SpecialtyId } from "@/types/specialty.ts"

const exampleBase = {
  userAt: "2026-10-13T08:00:08.000Z",
  assistantAt: "2026-10-13T08:00:14.000Z",
} as const

function exampleThread(
  user: string,
  assistant: string,
  specialtyName: string,
  rationale: string,
  ctaLabel: string,
): ChatMessage[] {
  return [
    {
      id: "example-user",
      role: "user",
      content: user,
      createdAt: exampleBase.userAt,
      isExample: true,
    },
    {
      id: "example-assistant",
      role: "assistant",
      content: assistant,
      createdAt: exampleBase.assistantAt,
      isExample: true,
      recommendation: {
        specialtyId: "ophthalmology",
        specialtyName,
        status: "available",
        rationale,
        ctaLabel,
        ctaHref: OPTHOCARE_URL,
        urgency: "orientation",
      },
    },
  ]
}

const fr = {
  skip: "Aller à Sehatoka AI",
  openAi: "Ouvrir Sehatoka AI",
  discoverAi: "Découvrir Sehatoka AI",
  nav: [
    { href: "#accueil", label: "Accueil" },
    { href: "#specialites", label: "Spécialités" },
    { href: "#cabinets", label: "Cabinets" },
    { href: "#assistant", label: "Assistant IA" },
    { href: "#comment-ca-marche", label: "Comment ça marche" },
  ],
  navLabel: "Navigation principale",
  menuOpen: "Ouvrir le menu",
  menuClose: "Fermer le menu",
  heroTitle: ["Votre santé,", "guidée par", "l'intelligence."],
  heroBody:
    "Une plateforme qui vous oriente vers la bonne spécialité médicale et simplifie votre parcours de soins.",
  heroPrimary: "Découvrir Sehatoka AI",
  heroSecondary: "Explorer les spécialités",
  heroModule: "Le parcours oculaire, déjà accessible.",
  assistantKicker: "Sehatoka AI",
  assistantTitle: "L'intelligence quand elle oriente. Le spécialiste quand il le faut.",
  assistantBody:
    "Décrivez un besoin. Sehatoka propose une spécialité cohérente, puis le module adapté quand il existe déjà.",
  assistantPoints: [
    "Orientation vers la bonne spécialité",
    "OphthoCare déjà accessible",
    "Aucun diagnostic posé",
    "Échange conservé dans le navigateur",
  ],
  specialtiesTitle: "Les spécialités.",
  specialtiesBody: "Un parcours pour chaque besoin. OphthoCare ouvre l'ophtalmologie.",
  featuredQuote: "Une orientation claire. Jamais un diagnostic.",
  accessOphtho: "Accéder à OphthoCare",
  structuresKicker: "Structures",
  structuresTitle: "Ceux qui soignent ont aussi leur application.",
  structuresBody:
    "Chaque spécialité porte le parcours du patient, puis la gestion du médecin, du cabinet et de la clinique.",
  agentsTitle: "Une orchestration encore conceptuelle.",
  agentsBody:
    "Une vision de recherche. Ces agents ne sont pas déployés dans cette démonstration.",
  trustTitle: "Un besoin. Une orientation. Un parcours.",
  pillars: [
    {
      title: "Un besoin",
      body: "Vous décrivez une gêne, une question ou un parcours à clarifier. L'assistant n'extrait que ce qui est nécessaire à l'orientation.",
    },
    {
      title: "Une orientation",
      body: "Sehatoka propose une spécialité cohérente. Jamais un diagnostic, jamais une disponibilité inventée, jamais un professionnel fictif.",
    },
    {
      title: "Un parcours de soins",
      body: "OphthoCare ouvre le parcours oculaire. Les autres spécialités sont présentées de la même façon, chacune à sa place.",
    },
  ],
  commitments: [
    {
      title: "Confidentialité",
      body: "Cette démonstration conserve l'échange dans la session du navigateur. Aucune donnée n'est persistée ni transmise à un service tiers.",
    },
    {
      title: "Sécurité",
      body: "Les signes d'urgence déclenchent une conduite vers les soins critiques. L'assistant s'arrête là où un avis médical devient nécessaire.",
    },
  ],
  footerBody:
    "Plateforme centrale d'orientation. Sehatoka relie un besoin de santé à la spécialité et au parcours adaptés.",
  rights: "Tous droits réservés.",
  footerNote: "Démonstration d'orientation — ne remplace pas un avis médical.",
  specialties: {
    ophthalmology: { name: "Ophtalmologie", field: "Vision et santé oculaire" },
    cardiology: { name: "Cardiologie", field: "Cœur et circulation" },
    dermatology: { name: "Dermatologie", field: "Peau et muqueuses" },
    pediatrics: { name: "Pédiatrie", field: "Santé de l'enfant" },
    "general-medicine": { name: "Médecine générale", field: "Premier recours" },
    gynecology: { name: "Gynécologie", field: "Santé des femmes" },
    psychiatry: { name: "Psychiatrie", field: "Santé mentale" },
  } satisfies Record<SpecialtyId, { name: string; field: string }>,
  places: {
    medecin: {
      name: "Médecin",
      field: "L'exercice",
      summary: "Actes, dossiers et suite du parcours, dans la spécialité du praticien.",
    },
    cabinet: {
      name: "Cabinet",
      field: "La structure libérale",
      summary: "Agenda, accueil et organisation du lieu où le patient est reçu.",
    },
    clinique: {
      name: "Clinique",
      field: "L'établissement",
      summary: "Services, équipes et parcours à l'échelle de la clinique.",
    },
  },
  agents: [
    {
      name: "Agent d'orientation",
      role: "Interprète le besoin exprimé et formule une première hypothèse de parcours.",
    },
    {
      name: "Agent de routage",
      role: "Propose la spécialité la plus cohérente, sans poser de diagnostic.",
    },
    {
      name: "Agent de coordination",
      role: "Orchestre, à terme, le passage vers le module de soins adapté.",
    },
    {
      name: "Agent de sécurité",
      role: "Cadre la conversation : urgences, limites cliniques, minimisation des données.",
    },
  ],
  chat: {
    status: "En ligne · orientation",
    fullscreen: "Plein écran",
    fullscreenLabel: "Ouvrir Sehatoka AI en plein écran",
    newChat: "Nouvelle conversation",
    restore: "Revoir l'exemple",
    placeholder: "Décrire un besoin…",
    fieldLabel: "Décrire votre besoin de santé",
    send: "Envoyer le message",
    disclaimer: "Démonstration — ne remplace pas un avis médical.",
    book: "Demander un rendez-vous",
    bookMessage: "Je souhaite demander un rendez-vous.",
    orientation: "Orientation",
    emergency: "Urgence",
    ophthoLine: "Ophtalmologie · module existant",
    error: "La démonstration n'a pas pu répondre. Veuillez réessayer dans un instant.",
  },
  prompts: [
    { label: "Vision floue", text: "J'ai une vision floue et une gêne aux yeux." },
    { label: "Palpitations", text: "Je ressens des palpitations depuis quelques jours." },
    { label: "Peau", text: "J'ai une plaque rouge qui démange sur le bras." },
    { label: "Rendez-vous", text: "Je souhaite demander un rendez-vous." },
    { label: "Préparer", text: "Que dois-je préparer avant l'orientation ?" },
    { label: "Urgence", text: "Que faire si les signes semblent urgents ?" },
  ],
  example: exampleThread(
    "J'ai une vision floue et une gêne aux yeux.",
    "Une consultation en ophtalmologie peut être appropriée. OphthoCare peut prendre le relais.",
    "Ophtalmologie",
    "Module existant — orientation vers OphthoCare pour le parcours oculaire.",
    "Accéder à OphthoCare",
  ),
}

const en: Copy = {
  skip: "Skip to Sehatoka AI",
  openAi: "Open Sehatoka AI",
  discoverAi: "Discover Sehatoka AI",
  nav: [
    { href: "#accueil", label: "Home" },
    { href: "#specialites", label: "Specialties" },
    { href: "#cabinets", label: "Practices" },
    { href: "#assistant", label: "AI assistant" },
    { href: "#comment-ca-marche", label: "How it works" },
  ],
  navLabel: "Main navigation",
  menuOpen: "Open menu",
  menuClose: "Close menu",
  heroTitle: ["Your health,", "guided by", "intelligence."],
  heroBody:
    "A platform that guides you to the right medical specialty and simplifies your care journey.",
  heroPrimary: "Discover Sehatoka AI",
  heroSecondary: "Explore specialties",
  heroModule: "The eye pathway, already available.",
  assistantKicker: "Sehatoka AI",
  assistantTitle: "Intelligence when it guides. The specialist when it matters.",
  assistantBody:
    "Describe a need. Sehatoka suggests a fitting specialty, then the matching module when it already exists.",
  assistantPoints: [
    "Guidance toward the right specialty",
    "OphthoCare already available",
    "No diagnosis made",
    "Conversation kept in the browser",
  ],
  specialtiesTitle: "The specialties.",
  specialtiesBody: "A pathway for every need. OphthoCare opens ophthalmology.",
  featuredQuote: "A clear direction. Never a diagnosis.",
  accessOphtho: "Open OphthoCare",
  structuresKicker: "Practices",
  structuresTitle: "Those who provide care have an application too.",
  structuresBody:
    "Each specialty carries the patient's pathway, then the tools for the physician, the practice, and the clinic.",
  agentsTitle: "An orchestration that is still conceptual.",
  agentsBody: "A research vision. These agents are not deployed in this demonstration.",
  trustTitle: "A need. A direction. A pathway.",
  pillars: [
    {
      title: "A need",
      body: "You describe a discomfort, a question, or a pathway to clarify. The assistant keeps only what guidance requires.",
    },
    {
      title: "A direction",
      body: "Sehatoka suggests a fitting specialty. Never a diagnosis, never invented availability, never a fictional professional.",
    },
    {
      title: "A care pathway",
      body: "OphthoCare opens the eye pathway. The other specialties are presented in the same way, each in its place.",
    },
  ],
  commitments: [
    {
      title: "Privacy",
      body: "This demonstration keeps the exchange in the browser session. Nothing is stored or sent to a third party.",
    },
    {
      title: "Safety",
      body: "Urgent signs lead toward emergency care. The assistant stops where a medical opinion becomes necessary.",
    },
  ],
  footerBody:
    "A central guidance platform. Sehatoka connects a health need with the fitting specialty and pathway.",
  rights: "All rights reserved.",
  footerNote: "Orientation demo — not a substitute for medical advice.",
  specialties: {
    ophthalmology: { name: "Ophthalmology", field: "Vision and eye health" },
    cardiology: { name: "Cardiology", field: "Heart and circulation" },
    dermatology: { name: "Dermatology", field: "Skin and mucous membranes" },
    pediatrics: { name: "Pediatrics", field: "Children's health" },
    "general-medicine": { name: "General medicine", field: "First point of care" },
    gynecology: { name: "Gynecology", field: "Women's health" },
    psychiatry: { name: "Psychiatry", field: "Mental health" },
  },
  places: {
    medecin: {
      name: "Physician",
      field: "The practice",
      summary: "Acts, records, and the rest of the pathway, within the physician's specialty.",
    },
    cabinet: {
      name: "Practice",
      field: "The private office",
      summary: "Schedule, reception, and the organization of the place where the patient is seen.",
    },
    clinique: {
      name: "Clinic",
      field: "The facility",
      summary: "Services, teams, and pathways across the clinic.",
    },
  },
  agents: [
    {
      name: "Orientation agent",
      role: "Reads the need and forms a first hypothesis for the pathway.",
    },
    {
      name: "Routing agent",
      role: "Suggests the most fitting specialty, without making a diagnosis.",
    },
    {
      name: "Coordination agent",
      role: "In time, hands the pathway to the matching care module.",
    },
    {
      name: "Safety agent",
      role: "Frames the conversation: emergencies, clinical limits, and data minimization.",
    },
  ],
  chat: {
    status: "Online · guidance",
    fullscreen: "Full screen",
    fullscreenLabel: "Open Sehatoka AI full screen",
    newChat: "New conversation",
    restore: "See the example",
    placeholder: "Describe a need…",
    fieldLabel: "Describe your health need",
    send: "Send message",
    disclaimer: "Demonstration — not a substitute for medical advice.",
    book: "Request an appointment",
    bookMessage: "I would like to request an appointment.",
    orientation: "Guidance",
    emergency: "Emergency",
    ophthoLine: "Ophthalmology · existing module",
    error: "The demonstration could not reply. Please try again in a moment.",
  },
  prompts: [
    { label: "Blurred vision", text: "I have blurred vision and discomfort in my eyes." },
    { label: "Palpitations", text: "I have felt palpitations for a few days." },
    { label: "Skin", text: "I have a red itchy patch on my arm." },
    { label: "Appointment", text: "I would like to request an appointment." },
    { label: "Prepare", text: "What should I prepare before the orientation?" },
    { label: "Urgent", text: "What if the signs seem urgent?" },
  ],
  example: exampleThread(
    "I have blurred vision and discomfort in my eyes.",
    "An ophthalmology visit may be appropriate. OphthoCare can take the next step.",
    "Ophthalmology",
    "Existing module — guidance toward OphthoCare for the eye pathway.",
    "Open OphthoCare",
  ),
}

export type Copy = typeof fr

export const copy: Record<"fr" | "en", Copy> = { fr, en }
