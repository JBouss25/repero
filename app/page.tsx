import Link from 'next/link';
import {
  ArrowRight,

  Bell,
  Brain,
  CalendarCheck,
  CheckCircle2,
  ChevronDown,
  Clock,
  Flame,
  GraduationCap,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react';
import { WaitlistForm } from '@/components/WaitlistForm';

// Contenus de la page d'accueil — centralisés pour faciliter les mises à jour
const NAV_LINKS = [
  { href: '#methode', label: 'La méthode' },
  { href: '#fonctionnement', label: 'Comment ça marche' },
  { href: '#pour-qui', label: 'Pour qui' },
  { href: '#faq', label: 'FAQ' },
];

const PILLARS = [
  { icon: Clock, label: '15 min par jour' },
  { icon: CalendarCheck, label: 'Répétition espacée' },
  { icon: Target, label: 'Exercices ciblés' },
  { icon: Bell, label: 'Rappels quotidiens' },
];

const FEATURES = [
  {
    icon: Clock,
    tone: 'bg-blue-50 text-[#0066FF] ring-blue-100',
    title: 'La répétition espacée',
    text: "Notre algorithme planifie chaque révision juste avant que votre cerveau n'oublie. Ni trop tôt, ni trop tard : au meilleur moment.",
  },
  {
    icon: Brain,
    tone: 'bg-cyan-50 text-cyan-600 ring-cyan-100',
    title: 'La détection des points faibles',
    text: "L'IA repère vos compétences les plus fragiles et vous propose des exercices ciblés. Plus de temps perdu sur ce que vous maîtrisez déjà.",
  },
  {
    icon: TrendingUp,
    tone: 'bg-amber-50 text-amber-600 ring-amber-100',
    title: 'La métacognition',
    text: 'Déclarez votre niveau de confiance avant chaque réponse. Repero vous aide à caler votre jugement sur la réalité.',
  },
];

const STEPS = [
  {
    n: '01',
    title: 'Connectez-vous avec OoStudy',
    text: 'Un seul compte, aucune configuration. Repero récupère votre niveau et vos compétences à consolider.',
  },
  {
    n: '02',
    title: 'Faites votre session du jour',
    text: "Quelques questions choisies pour vous, chaque jour. 15 minutes chrono, depuis votre téléphone ou votre ordinateur.",
  },
  {
    n: '03',
    title: 'Regardez vos jauges monter',
    text: 'Suivez votre maîtrise compétence par compétence et gardez votre série active. Les progrès deviennent visibles.',
  },
];

const AUDIENCES = [
  {
    icon: GraduationCap,
    title: 'Élèves',
    text: "Une routine courte qui consolide vos acquis au lieu de tout réviser la veille de l'examen.",
    points: ['Session du jour personnalisée', 'Série quotidienne motivante', 'Jauges de maîtrise'],
  },
  {
    icon: Users,
    title: 'Enseignants & tuteurs',
    text: 'Repérez les élèves qui décrochent avant qu’il ne soit trop tard, et intervenez au bon moment.',
    points: ['Vue d’ensemble de la classe', 'Alertes de décrochage', 'Compétences à retravailler'],
  },
  {
    icon: HeartHandshake,
    title: 'Parents',
    text: "Restez informés de la régularité et des progrès de votre enfant, sans avoir à surveiller.",
    points: ['Rapport hebdomadaire', 'Régularité de travail', 'Progrès mesurables'],
  },
];

const FAQ = [
  {
    q: 'Est-ce que 15 minutes par jour suffisent vraiment ?',
    a: "Oui, pour consolider. Les sciences cognitives montrent que des révisions courtes et régulières, bien espacées dans le temps, ancrent durablement les connaissances bien mieux qu'une longue session ponctuelle.",
  },
  {
    q: "Repero remplace-t-il les cours ?",
    a: "Non. Repero intervient après le cours : il vous aide à ne pas oublier ce que vous avez appris et à repérer ce qui reste fragile.",
  },
  {
    q: 'Comment me connecter ?',
    a: 'Avec votre compte OoStudy. Cliquez sur « Se connecter » et utilisez vos identifiants habituels.',
  },
  {
    q: 'Mes données sont-elles protégées ?',
    a: 'Oui. Vos données sont hébergées de façon sécurisée et traitées conformément au RGPD et à la loi marocaine 09-08.',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white font-sans text-slate-900 selection:bg-blue-200">
      {/* NAVBAR */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-lg">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-8">
          <Link href="/" className="flex items-center" aria-label="Repero — accueil">
            <img src="/logo-light.png" alt="Repero" width={1423} height={1267} className="h-11 w-auto lg:h-14" />
          </Link>

          <ul className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="transition-colors hover:text-[#0066FF]">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/api/auth/login"
              className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              Se connecter
            </Link>
            <a
              href="#acces"
              className="hidden items-center gap-1.5 rounded-full bg-[#0A192F] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#13294b] sm:inline-flex"
            >
              Accès anticipé
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </nav>
      </header>

      <main>
        {/* HERO */}
        <section id="acces" className="relative scroll-mt-24 px-4 pt-28 pb-20 sm:px-6 lg:pt-40 lg:pb-28">
          {/* Fond décoratif */}
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#EAF2FF_0%,_#FFFFFF_60%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#0A192F08_1px,transparent_1px),linear-gradient(to_bottom,#0A192F08_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
          </div>

          <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
            {/* Texte */}
            <div className="text-center lg:text-left">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-[#0066FF] shadow-sm ring-1 ring-blue-100">
                <Sparkles className="h-4 w-4" />
                Basé sur les sciences cognitives
              </div>

              <h1 className="mb-6 text-4xl leading-[1.08] font-extrabold tracking-tight text-[#0A192F] sm:text-5xl lg:text-6xl xl:text-7xl">
                15 minutes par jour pour{' '}
                <span className="bg-gradient-to-r from-[#0066FF] to-[#00B8F0] bg-clip-text text-transparent">
                  ne plus jamais oublier.
                </span>
              </h1>

              <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-slate-600 sm:text-xl lg:mx-0">
                L&apos;IA qui réengage avant le décrochage. Repero transforme le diagnostic de vos compétences en une
                routine quotidienne courte, ciblée et personnalisée.
              </p>

              <div className="mx-auto flex max-w-lg flex-col items-center gap-5 lg:mx-0 lg:items-start">
                <WaitlistForm />
                <Link
                  href="/api/auth/login"
                  className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-[#0066FF]"
                >
                  Déjà inscrit sur OoStudy ? Commencer ma routine
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>

            {/* Visuel produit */}
            <div className="relative mx-auto w-full max-w-[22rem] sm:max-w-sm lg:max-w-md">
              <div aria-hidden className="absolute top-10 -right-6 h-72 w-72 rounded-full bg-[#0066FF]/25 blur-3xl" />
              <div aria-hidden className="absolute bottom-6 -left-6 h-64 w-64 rounded-full bg-cyan-400/25 blur-3xl" />

              <img
                src="/hero-image.png"
                alt="Écran d'accueil de l'application Repero avec la session du jour et les jauges de maîtrise"
                width={1857}
                height={3096}
                fetchPriority="high"
                className="relative mx-auto w-[78%] drop-shadow-2xl"
              />

              {/* Pastilles flottantes (illustration de l'interface) */}
              <div className="absolute top-[18%] -left-2 flex items-center gap-3 rounded-2xl bg-white/95 px-4 py-3 shadow-xl ring-1 shadow-slate-900/10 ring-slate-200 backdrop-blur sm:-left-8">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100 text-orange-500">
                  <Flame className="h-5 w-5" />
                </span>
                <div className="text-left leading-tight">
                  <p className="text-xs text-slate-500">Série en cours</p>
                  <p className="font-bold text-slate-900">7 jours</p>
                </div>
              </div>

              <div className="absolute -right-2 bottom-[22%] flex items-center gap-3 rounded-2xl bg-white/95 px-4 py-3 shadow-xl ring-1 shadow-slate-900/10 ring-slate-200 backdrop-blur sm:-right-6">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                  <TrendingUp className="h-5 w-5" />
                </span>
                <div className="text-left leading-tight">
                  <p className="text-xs text-slate-500">Maîtrise</p>
                  <p className="font-bold text-slate-900">en hausse</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bandeau des piliers */}
          <ul className="mx-auto mt-16 grid max-w-5xl grid-cols-2 gap-3 sm:gap-4 lg:mt-24 lg:grid-cols-4">
            {PILLARS.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-center justify-center gap-2.5 rounded-2xl bg-white/70 px-4 py-4 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 backdrop-blur sm:text-base"
              >
                <Icon className="h-5 w-5 shrink-0 text-[#0066FF]" />
                {label}
              </li>
            ))}
          </ul>
        </section>

        {/* LE PROBLÈME : COURBE DE L'OUBLI */}
        <section className="bg-slate-50 px-4 py-20 sm:px-6 lg:py-28">
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <p className="mb-3 text-sm font-bold tracking-widest text-[#0066FF] uppercase">Le constat</p>
              <h2 className="mb-6 text-3xl font-bold tracking-tight text-[#0A192F] sm:text-4xl lg:text-5xl">
                Sans révision, on oublie l&apos;essentiel en quelques jours.
              </h2>
              <p className="mb-6 text-lg leading-relaxed text-slate-600">
                C&apos;est la courbe de l&apos;oubli : ce qu&apos;on vient d&apos;apprendre s&apos;efface très vite… sauf
                si on le réactive au bon moment. Chaque rappel bien placé rend le souvenir plus solide et plus durable.
              </p>
              <p className="text-lg leading-relaxed text-slate-600">
                Oubliez les sessions de 2 heures le dimanche.{' '}
                <strong className="text-slate-900">La régularité bat l&apos;intensité.</strong>
              </p>
            </div>

            <figure className="rounded-3xl bg-white p-6 shadow-xl ring-1 shadow-slate-900/5 ring-slate-200 sm:p-8">
              <svg viewBox="0 0 400 240" className="h-auto w-full" role="img" aria-labelledby="oubli-titre">
                <title id="oubli-titre">
                  Courbe de l&apos;oubli : sans révision la mémoire chute, avec des rappels espacés elle reste élevée
                </title>
                {/* Grille */}
                {[40, 90, 140, 190].map((y) => (
                  <line key={y} x1="40" x2="390" y1={y} y2={y} stroke="#E2E8F0" strokeDasharray="4 4" />
                ))}
                <line x1="40" x2="40" y1="20" y2="200" stroke="#CBD5E1" />
                <line x1="40" x2="390" y1="200" y2="200" stroke="#CBD5E1" />
                <text x="34" y="44" textAnchor="end" fontSize="11" fill="#94A3B8">100%</text>
                <text x="34" y="204" textAnchor="end" fontSize="11" fill="#94A3B8">0%</text>
                <text x="215" y="225" textAnchor="middle" fontSize="11" fill="#94A3B8">Jours après le cours →</text>

                {/* Sans révision */}
                <path d="M40 40 C 70 130, 110 165, 200 178 S 340 186, 390 188" fill="none" stroke="#F87171" strokeWidth="3" />

                {/* Avec Repero : chutes de plus en plus lentes, réactivées à chaque rappel */}
                <path
                  d="M40 40 C 55 80, 70 92, 90 96 L 90 40 C 115 70, 135 78, 165 80 L 165 40 C 200 60, 230 66, 265 68 L 265 40 C 310 52, 350 56, 390 58"
                  fill="none"
                  stroke="#0066FF"
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
                {[90, 165, 265].map((x) => (
                  <circle key={x} cx={x} cy="40" r="5" fill="#0066FF" stroke="#fff" strokeWidth="2" />
                ))}
              </svg>
              <figcaption className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
                <span className="flex items-center gap-2">
                  <span className="h-1 w-5 rounded-full bg-red-400" /> Sans révision
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-1 w-5 rounded-full bg-[#0066FF]" /> Avec des rappels Repero
                </span>
              </figcaption>
            </figure>
          </div>
        </section>

        {/* LA MÉTHODE */}
        <section id="methode" className="scroll-mt-20 px-4 py-20 sm:px-6 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto mb-14 max-w-3xl text-center lg:mb-20">
              <p className="mb-3 text-sm font-bold tracking-widest text-[#0066FF] uppercase">La méthode</p>
              <h2 className="mb-5 text-3xl font-bold tracking-tight text-[#0A192F] sm:text-4xl lg:text-5xl">
                Pourquoi Repero fonctionne
              </h2>
              <p className="text-lg leading-relaxed text-slate-600 sm:text-xl">
                Trois principes issus de la recherche en sciences cognitives, réunis dans une seule routine.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3 lg:gap-8">
              {FEATURES.map(({ icon: Icon, tone, title, text }) => (
                <article
                  key={title}
                  className="group rounded-3xl bg-white p-8 ring-1 ring-slate-200 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/5 hover:ring-blue-200 lg:p-10"
                >
                  <div className={`mb-7 flex h-14 w-14 items-center justify-center rounded-2xl ring-1 ${tone}`}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-[#0A192F] lg:text-2xl">{title}</h3>
                  <p className="leading-relaxed text-slate-600">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* COMMENT ÇA MARCHE */}
        <section id="fonctionnement" className="scroll-mt-20 bg-[#0A192F] px-4 py-20 text-white sm:px-6 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto mb-14 max-w-3xl text-center lg:mb-20">
              <p className="mb-3 text-sm font-bold tracking-widest text-cyan-300 uppercase">Comment ça marche</p>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Trois étapes, zéro prise de tête.
              </h2>
            </div>

            <div className="relative">
              <div
                aria-hidden
                className="absolute top-7 right-[16%] left-[16%] hidden h-px bg-gradient-to-r from-transparent via-white/25 to-transparent md:block"
              />
            <ol className="relative grid gap-10 md:grid-cols-3 md:gap-8">
              {STEPS.map((s) => (
                <li key={s.n} className="relative text-center">
                  <span className="relative mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0066FF] to-[#00B8F0] text-lg font-bold shadow-lg shadow-blue-500/30">
                    {s.n}
                  </span>
                  <h3 className="mb-3 text-xl font-bold">{s.title}</h3>
                  <p className="mx-auto max-w-xs leading-relaxed text-slate-300">{s.text}</p>
                </li>
              ))}
            </ol>
            </div>
          </div>
        </section>

        {/* POUR QUI */}
        <section id="pour-qui" className="scroll-mt-20 px-4 py-20 sm:px-6 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto mb-14 max-w-3xl text-center lg:mb-20">
              <p className="mb-3 text-sm font-bold tracking-widest text-[#0066FF] uppercase">Pour qui</p>
              <h2 className="mb-5 text-3xl font-bold tracking-tight text-[#0A192F] sm:text-4xl lg:text-5xl">
                Tout le monde avance ensemble
              </h2>
              <p className="text-lg leading-relaxed text-slate-600 sm:text-xl">
                L&apos;élève révise, l&apos;enseignant repère, le parent est rassuré.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3 lg:gap-8">
              {AUDIENCES.map(({ icon: Icon, title, text, points }) => (
                <article key={title} className="flex flex-col rounded-3xl bg-slate-50 p-8 ring-1 ring-slate-200 lg:p-10">
                  <div className="mb-6 flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#0066FF] shadow-sm ring-1 ring-slate-200">
                      <Icon className="h-6 w-6" />
                    </span>
                    <h3 className="text-xl font-bold text-[#0A192F] lg:text-2xl">{title}</h3>
                  </div>
                  <p className="mb-6 leading-relaxed text-slate-600">{text}</p>
                  <ul className="mt-auto space-y-3">
                    {points.map((p) => (
                      <li key={p} className="flex items-start gap-2.5 text-sm font-medium text-slate-700">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-20 bg-slate-50 px-4 py-20 sm:px-6 lg:py-28">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-10 text-center text-3xl font-bold tracking-tight text-[#0A192F] sm:text-4xl lg:mb-14">
              Questions fréquentes
            </h2>
            <div className="space-y-3">
              {FAQ.map(({ q, a }) => (
                <details
                  key={q}
                  className="group rounded-2xl bg-white px-6 py-5 ring-1 ring-slate-200 open:shadow-lg open:shadow-slate-900/5"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-slate-900 [&::-webkit-details-marker]:hidden">
                    {q}
                    <ChevronDown className="h-5 w-5 shrink-0 text-slate-400 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 leading-relaxed text-slate-600">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="relative overflow-hidden bg-[#0A192F] px-4 py-20 sm:px-6 lg:py-28">
          <div aria-hidden className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[#0066FF]/20 blur-3xl" />
          <div aria-hidden className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-cyan-400/15 blur-3xl" />

          <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
            <h2 className="mb-5 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-6xl">
              Prêt à prendre de l&apos;avance&nbsp;?
            </h2>
            <p className="mb-10 max-w-2xl text-lg leading-relaxed text-slate-300 sm:text-xl">
              Rejoignez les élèves qui consolident leurs acquis chaque jour. 15 minutes, et c&apos;est tout.
            </p>

            <WaitlistForm variant="dark" />

            <Link
              href="/api/auth/login"
              className="group mt-6 inline-flex items-center gap-2 font-semibold text-white/90 hover:text-white"
            >
              Se connecter avec OoStudy
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>

            <ul className="mt-14 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" /> Aucun engagement
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-400" /> Données sécurisées
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" /> Conforme RGPD & Loi 09-08
              </li>
            </ul>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white px-4 py-12 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
            <img src="/logo-light.png" alt="Repero" width={1423} height={1267} className="h-9 w-auto" />
            <span className="text-sm text-slate-500">© {new Date().getFullYear()} Repero. Un produit OoStudy.</span>
          </div>
          <nav className="flex gap-6 text-sm text-slate-500 sm:gap-8" aria-label="Liens légaux">
            <Link href="#" className="transition-colors hover:text-[#0066FF]">
              Mentions légales
            </Link>
            <Link href="#" className="transition-colors hover:text-[#0066FF]">
              Confidentialité
            </Link>
            <Link href="#" className="transition-colors hover:text-[#0066FF]">
              Contact
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
