# Sehatoka

Plateforme centrale d'orientation médicale. Cette version livre la page d'accueil publique et **Sehatoka AI**, un assistant conversationnel d'orientation en mode démonstration.

OphthoCare, le module d'ophtalmologie déjà existant, est accessible depuis l'assistant et la page : [ophthocare.academyskills.net](https://ophthocare.academyskills.net/).

## Périmètre

Inclus :

- page d'accueil responsive (navigation, hero, assistant, spécialités, vision d'orchestration, engagements, pied de page)
- chat interactif avec historique de session, suggestions, indicateur de rédaction
- moteur d'intention local déterministe, derrière une interface d'adaptateur prête pour un futur backend LLM

Hors périmètre :

- dossiers patients, prise de rendez-vous, tableaux de bord
- appels réseau vers un modèle de langage
- prétention à un diagnostic ou à une disponibilité médicale

## Prérequis

- Node.js `^20.19.0` ou `>=22.12.0` (contrainte de Vite 8). Node 21 et Node 20.18 ou antérieur ne conviennent pas.
- npm

## Installation

```bash
npm install
```

Copier éventuellement la configuration d'exemple :

```bash
cp .env.example .env
```

Aucune clé n'est requise pour la démonstration. `VITE_CHAT_ADAPTER=demo` active le moteur local.

## Lancer le projet

```bash
npm run dev
```

Ouvrir l'adresse indiquée par Vite, en général `http://localhost:5173`.

## Vérifier la compilation

```bash
npm run build
```

Aperçu de la version de production :

```bash
npm run preview
```

## Architecture du chat

L'interface (`ChatPanel`, `useChat`) ne parle qu'à `ChatAdapter`.

- `DemoChatAdapter` : détection d'intention en français, réponses déterministes
- une future implémentation distante pourra remplacer l'adaptateur sans reconstruire l'UI

Les échanges restent dans la mémoire de session du navigateur. Rien n'est persisté ni transmis.

## Stack

React, Vite, TypeScript, Tailwind CSS, composants de type shadcn/ui, Lucide React, Motion.
