import { Eye, EyeOff } from "lucide-react"
import { useEffect, useState, type FormEvent } from "react"
import { useLocale } from "@/i18n/useLocale.ts"
import { isAuthError } from "@/lib/auth/errors.ts"
import { passwordIsStrong } from "@/lib/auth/password.ts"
import { useAuth } from "@/lib/auth/useAuth.ts"
import { safePatientNext } from "@/lib/route.ts"
import { fieldClass } from "@/patient/ui.tsx"

type AuthPath = "connexion" | "inscription" | "mot-de-passe"

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function AuthScreen({ mode, next }: { mode: AuthPath; next: string | null }) {
  const { locale } = useLocale()
  const auth = useAuth()
  const en = locale === "en"
  const destination = safePatientNext(next)

  useEffect(() => {
    if (auth.ready && auth.account && mode !== "mot-de-passe") {
      window.location.hash = destination
    }
  }, [auth.account, auth.ready, destination, mode])

  return (
    <div className="min-h-svh bg-canvas text-ink">
      <div className="mx-auto grid min-h-svh max-w-6xl items-center gap-10 px-5 py-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:px-10">
        <div className="max-w-md">
          <a href="#accueil" className="text-[15px] font-medium tracking-[-0.03em]">
            Sehatoka
          </a>
          <h1 className="mt-8 font-serif text-[3rem] leading-none tracking-[-0.04em] text-navy">
            {en ? "Your health space" : "Votre espace santé"}
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
            {en
              ? "Sehatoka guides you to the right specialty and brings your requests, appointments, and follow-up together."
              : "Sehatoka vous oriente vers la bonne spécialité et réunit vos demandes, vos rendez-vous et votre suivi."}
          </p>
          {auth.mode === "unavailable" ? (
            <p className="mt-6 text-[13px] leading-relaxed text-ink-faint">
              {en ? "Account opening will be available shortly." : "L'ouverture des comptes sera bientôt disponible."}
            </p>
          ) : null}
        </div>
        <div className="rounded-[1.75rem] border border-black/8 bg-canvas-elevated p-6 shadow-[var(--shadow-soft)] sm:p-8">
          {mode === "inscription" ? (
            <SignupForm />
          ) : mode === "mot-de-passe" ? (
            <ResetForm />
          ) : (
            <LoginForm next={destination} />
          )}
        </div>
      </div>
    </div>
  )
}

function LoginForm({ next }: { next: string }) {
  const { locale } = useLocale()
  const { login, mode } = useAuth()
  const en = locale === "en"
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [show, setShow] = useState(false)
  const [error, setError] = useState("")
  const [pending, setPending] = useState(false)

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError("")
    if (!emailPattern.test(email.trim())) {
      setError(en ? "Enter a valid email." : "Indiquez un e-mail valide.")
      return
    }
    setPending(true)
    try {
      await login(email, password)
      window.location.hash = next
    } catch (caught) {
      setError(failureText(caught, en))
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={(event) => void onSubmit(event)} className="space-y-4" noValidate>
      <header>
        <h2 className="text-[1.6rem] font-medium tracking-[-0.04em]">{en ? "Sign in" : "Connexion"}</h2>
        <p className="mt-1 text-[13px] text-ink-soft">
          {en ? "Access your Sehatoka health space." : "Accédez à votre espace santé Sehatoka."}
        </p>
      </header>
      {error ? <p className="text-[13px] text-danger" role="alert">{error}</p> : null}
      <label className="block">
        <span className="text-[12px] font-medium text-ink-soft">{en ? "Email" : "E-mail"}</span>
        <input className={fieldClass} type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
      </label>
      <PasswordField
        label={en ? "Password" : "Mot de passe"}
        value={password}
        shown={show}
        autoComplete="current-password"
        onToggle={() => setShow((value) => !value)}
        onChange={setPassword}
      />
      <button type="submit" disabled={pending || mode === "unavailable"} className="inline-flex h-11 w-full items-center justify-center rounded-full bg-[#161616] text-[14px] font-medium text-white hover:bg-black disabled:opacity-50">
        {pending ? (en ? "Signing in…" : "Connexion…") : en ? "Continue" : "Continuer"}
      </button>
      <p className="flex flex-wrap gap-x-4 gap-y-2 text-[13px] text-ink-soft">
        <a href="#mot-de-passe" className="font-medium text-ink">{en ? "Forgot password" : "Mot de passe oublié"}</a>
        <a href="#inscription" className="font-medium text-ink">{en ? "Create an account" : "Créer un compte"}</a>
      </p>
    </form>
  )
}

function SignupForm() {
  const { locale } = useLocale()
  const { register, mode } = useAuth()
  const en = locale === "en"
  const [show, setShow] = useState(false)
  const [error, setError] = useState("")
  const [pending, setPending] = useState(false)
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    birthDate: "",
    password: "",
    confirm: "",
    terms: false,
  })

  const set = (key: keyof typeof form, value: string | boolean) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const issue = signupIssue(form)
    if (issue) {
      setError(issueText(issue, en))
      return
    }
    setError("")
    setPending(true)
    try {
      await register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        birthDate: form.birthDate,
        password: form.password,
        language: locale,
      })
      window.location.hash = "#patient"
    } catch (caught) {
      setError(failureText(caught, en))
    } finally {
      setPending(false)
      setForm((current) => ({ ...current, password: "", confirm: "" }))
    }
  }

  return (
    <form onSubmit={(event) => void onSubmit(event)} className="space-y-3" noValidate>
      <header>
        <h2 className="text-[1.6rem] font-medium tracking-[-0.04em]">{en ? "Create an account" : "Créer un compte"}</h2>
        <p className="mt-1 text-[13px] text-ink-soft">
          {en ? "A few details to open your space." : "Quelques informations pour ouvrir votre espace."}
        </p>
      </header>
      {error ? <p className="text-[13px] text-danger" role="alert">{error}</p> : null}
      <div className="grid gap-3 sm:grid-cols-2">
        <TextField label={en ? "First name" : "Prénom"} value={form.firstName} autoComplete="given-name" onChange={(value) => set("firstName", value)} />
        <TextField label={en ? "Last name" : "Nom"} value={form.lastName} autoComplete="family-name" onChange={(value) => set("lastName", value)} />
      </div>
      <TextField label={en ? "Email" : "E-mail"} type="email" value={form.email} autoComplete="email" onChange={(value) => set("email", value)} />
      <TextField label={en ? "Phone" : "Téléphone"} type="tel" value={form.phone} autoComplete="tel" onChange={(value) => set("phone", value)} />
      <TextField label={en ? "Date of birth" : "Date de naissance"} type="date" value={form.birthDate} autoComplete="bday" onChange={(value) => set("birthDate", value)} />
      <PasswordField label={en ? "Password" : "Mot de passe"} value={form.password} shown={show} autoComplete="new-password" onToggle={() => setShow((value) => !value)} onChange={(value) => set("password", value)} />
      <p className="text-[12px] text-ink-faint">{en ? "At least 8 characters, with a letter and a number." : "Au moins 8 caractères, avec une lettre et un chiffre."}</p>
      <PasswordField label={en ? "Confirm password" : "Confirmer le mot de passe"} value={form.confirm} shown={show} autoComplete="new-password" onToggle={() => setShow((value) => !value)} onChange={(value) => set("confirm", value)} />
      <label className="flex items-start gap-2 text-[13px] leading-relaxed text-ink-soft">
        <input type="checkbox" className="mt-1" checked={form.terms} onChange={(event) => set("terms", event.target.checked)} />
        <span>
          {en
            ? "I accept Sehatoka's terms of use and privacy policy."
            : "J'accepte les conditions d'utilisation et la politique de confidentialité de Sehatoka."}
        </span>
      </label>
      <button type="submit" disabled={pending || mode === "unavailable"} className="inline-flex h-11 w-full items-center justify-center rounded-full bg-[#161616] text-[14px] font-medium text-white hover:bg-black disabled:opacity-50">
        {pending ? (en ? "Creating…" : "Création…") : en ? "Create my space" : "Créer mon espace"}
      </button>
      <p className="text-[13px] text-ink-soft">
        <a href="#connexion" className="font-medium text-ink">{en ? "Already registered" : "Déjà un compte"}</a>
      </p>
    </form>
  )
}

function ResetForm() {
  const { locale } = useLocale()
  const { requestPasswordReset, confirmPasswordReset, mode } = useAuth()
  const en = locale === "en"
  const [step, setStep] = useState<"email" | "code">("email")
  const [email, setEmail] = useState("")
  const [token, setToken] = useState("")
  const [password, setPassword] = useState("")
  const [show, setShow] = useState(false)
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")
  const [pending, setPending] = useState(false)

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError("")
    if (step === "email") {
      if (!emailPattern.test(email.trim())) {
        setError(en ? "Enter a valid email." : "Indiquez un e-mail valide.")
        return
      }
      setPending(true)
      try {
        await requestPasswordReset(email)
        setNotice(en
          ? "If an account matches this email, a message lets you choose a new password."
          : "Si un compte correspond à cet e-mail, un message permet de choisir un nouveau mot de passe.")
        setStep("code")
      } catch (caught) {
        setError(failureText(caught, en))
      } finally {
        setPending(false)
      }
      return
    }
    if (!token.trim() || !passwordIsStrong(password)) {
      setError(en ? "Enter the code and a password of 8 characters, with a letter and a number." : "Indiquez le code et un mot de passe de 8 caractères, avec une lettre et un chiffre.")
      return
    }
    setPending(true)
    try {
      await confirmPasswordReset(token.trim(), password)
      setNotice(en ? "Your password has been updated." : "Votre mot de passe a été mis à jour.")
      setPassword("")
      setToken("")
    } catch (caught) {
      setNotice("")
      if (isAuthError(caught) && caught.failure === "invalid") {
        setError(en ? "This code is not valid." : "Ce code n'est pas valable.")
      } else {
        setError(failureText(caught, en))
      }
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={(event) => void onSubmit(event)} className="space-y-4" noValidate>
      <header>
        <h2 className="text-[1.6rem] font-medium tracking-[-0.04em]">{en ? "New password" : "Nouveau mot de passe"}</h2>
        <p className="mt-1 text-[13px] leading-relaxed text-ink-soft">
          {en ? "Choose a new password for your account." : "Choisissez un nouveau mot de passe pour votre compte."}
        </p>
      </header>
      {notice ? <p className="text-[13px] text-emerald" role="status">{notice}</p> : null}
      {error ? <p className="text-[13px] text-danger" role="alert">{error}</p> : null}
      {step === "email" ? (
        <TextField label={en ? "Email" : "E-mail"} type="email" value={email} autoComplete="email" onChange={setEmail} />
      ) : (
        <>
          <TextField label={en ? "Code" : "Code"} value={token} autoComplete="one-time-code" onChange={setToken} />
          <PasswordField label={en ? "New password" : "Nouveau mot de passe"} value={password} shown={show} autoComplete="new-password" onToggle={() => setShow((value) => !value)} onChange={setPassword} />
        </>
      )}
      <button type="submit" disabled={pending || mode === "unavailable"} className="inline-flex h-11 w-full items-center justify-center rounded-full bg-[#161616] text-[14px] font-medium text-white hover:bg-black disabled:opacity-50">
        {pending ? (en ? "Updating…" : "Mise à jour…") : step === "email" ? (en ? "Continue" : "Continuer") : en ? "Update password" : "Mettre à jour"}
      </button>
      <a href="#connexion" className="inline-block text-[13px] font-medium text-ink">{en ? "Back to sign in" : "Retour à la connexion"}</a>
    </form>
  )
}

function TextField({
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  autoComplete?: string
}) {
  return (
    <label className="block">
      <span className="text-[12px] font-medium text-ink-soft">{label}</span>
      <input className={fieldClass} type={type} autoComplete={autoComplete} value={value} onChange={(event) => onChange(event.target.value)} required />
    </label>
  )
}

function PasswordField({
  label,
  value,
  shown,
  autoComplete,
  onChange,
  onToggle,
}: {
  label: string
  value: string
  shown: boolean
  autoComplete: string
  onChange: (value: string) => void
  onToggle: () => void
}) {
  const { locale } = useLocale()
  return (
    <label className="block">
      <span className="text-[12px] font-medium text-ink-soft">{label}</span>
      <span className="relative mt-1.5 block">
        <input
          className={`${fieldClass} mt-0 pr-12`}
          type={shown ? "text" : "password"}
          autoComplete={autoComplete}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          required
        />
        <button type="button" onClick={onToggle} className="absolute top-1/2 right-3 -translate-y-1/2 text-ink-faint" aria-label={locale === "en" ? "Show password" : "Afficher le mot de passe"}>
          {shown ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </span>
    </label>
  )
}

function signupIssue(form: {
  firstName: string
  lastName: string
  email: string
  phone: string
  birthDate: string
  password: string
  confirm: string
  terms: boolean
}) {
  if (form.firstName.trim().length < 2 || form.lastName.trim().length < 2) {
    return "name"
  }
  if (!emailPattern.test(form.email.trim())) {
    return "email"
  }
  if (form.phone.replace(/\D/g, "").length < 8) {
    return "phone"
  }
  if (!form.birthDate || form.birthDate > new Date().toISOString().slice(0, 10)) {
    return "birth"
  }
  if (!passwordIsStrong(form.password)) {
    return "password"
  }
  if (form.password !== form.confirm) {
    return "confirm"
  }
  if (!form.terms) {
    return "terms"
  }
  return ""
}

function issueText(issue: string, en: boolean) {
  const fr: Record<string, string> = {
    name: "Indiquez votre prénom et votre nom.",
    email: "Indiquez un e-mail valide.",
    phone: "Indiquez un numéro d'au moins 8 chiffres.",
    birth: "Indiquez une date de naissance valide.",
    password: "Le mot de passe doit contenir 8 caractères, une lettre et un chiffre.",
    confirm: "Les mots de passe ne correspondent pas.",
    terms: "Veuillez accepter les conditions pour créer votre compte.",
  }
  const enText: Record<string, string> = {
    name: "Enter your first and last name.",
    email: "Enter a valid email.",
    phone: "Enter a number with at least 8 digits.",
    birth: "Enter a valid date of birth.",
    password: "Use 8 characters, with a letter and a number.",
    confirm: "Passwords do not match.",
    terms: "Please accept the terms to create your account.",
  }
  return (en ? enText : fr)[issue] ?? ""
}

function failureText(error: unknown, en: boolean) {
  if (!isAuthError(error)) {
    return en ? "Something went wrong. Try again." : "Une erreur est survenue. Réessayez."
  }
  if (error.failure === "exists") {
    return en ? "An account with this email already exists." : "Un compte avec cet e-mail existe déjà."
  }
  if (error.failure === "invalid") {
    return en ? "Email or password is not recognized." : "E-mail ou mot de passe non reconnu."
  }
  if (error.failure === "weak") {
    return en ? "The password is too weak." : "Le mot de passe est trop faible."
  }
  if (error.failure === "missing") {
    return en ? "No account matches this email." : "Aucun compte ne correspond à cet e-mail."
  }
  if (error.failure === "rate") {
    return en ? "Too many attempts. Try again in a few minutes." : "Trop de tentatives. Réessayez dans quelques minutes."
  }
  if (error.failure === "rejected") {
    return en ? "The request could not be verified. Reload the page." : "La requête n'a pas pu être vérifiée. Rechargez la page."
  }
  return en
    ? "Authentication is not connected. Set a real auth service before using this in production."
    : "L'authentification n'est pas reliée. Il faut un service de comptes avant une utilisation réelle."
}
