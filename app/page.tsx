import Link from 'next/link';
import { ArrowRight, Brain, Clock, TrendingUp, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-blue-200">
      
      {/* NAVBAR */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo agrandi : h-14 au lieu de h-10 */}
            <img src="/logo-light.png" alt="Repero" className="h-14 w-auto object-contain" />
          </div>
          <Link 
            href="/api/auth/login" 
            className="flex items-center gap-2 bg-[#0066FF] text-white px-6 py-2.5 rounded-full font-semibold hover:bg-[#0052CC] transition-colors shadow-lg shadow-blue-500/30"
          >
            Se connecter
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
                <Brain className="h-4 w-4" />
                <span>Basé sur les sciences cognitives</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#0A192F] tracking-tight mb-6 leading-tight">
                15 minutes par jour pour <br className="hidden md:block"/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0066FF] to-[#00D2FF]">
                  ne plus jamais oublier.
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-xl">
                L'IA qui réengage avant le décrochage. Repero transforme le diagnostic de vos compétences en une routine quotidienne ultra-efficace, personnalisée pour vous.
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Link 
                  href="/api/auth/login" 
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#0066FF] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#0052CC] transition-all hover:scale-105 shadow-xl shadow-blue-500/20"
                >
                  Commencer ma routine
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" /> 
                  Propulsé par OoStudy
                </p>
              </div>
            </div>

            {/* Image (temporaire : logo-dark pour ne pas avoir le texte cassé) */}
            <div className="relative">
              <div className="absolute -top-10 -right-10 w-72 h-72 rounded-full bg-blue-500/20 blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 w-72 h-72 rounded-full bg-cyan-500/20 blur-3xl"></div>
              
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-200 bg-[#0A192F] p-8">
                <img 
                  src="/logo-dark.png" 
                  alt="Repero" 
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0A192F] mb-4">Pourquoi Repero fonctionne ?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">Oubliez les sessions de révision de 2 heures le dimanche. La science est claire : la régularité bat l'intensité.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-[#F8FAFC] rounded-3xl border border-gray-100 hover:border-blue-200 transition-colors hover:shadow-lg">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                <Clock className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-[#0A192F] mb-3">La répétition espacée</h3>
              <p className="text-gray-600 leading-relaxed">Notre algorithme planifie vos révisions juste avant que votre cerveau n'oublie. Vous révisez au meilleur moment, pas trop tôt, pas trop tard.</p>
            </div>

            <div className="p-8 bg-[#F8FAFC] rounded-3xl border border-gray-100 hover:border-blue-200 transition-colors hover:shadow-lg">
              <div className="w-14 h-14 bg-cyan-100 rounded-2xl flex items-center justify-center text-cyan-600 mb-6">
                <Brain className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-[#0A192F] mb-3">La détection des points faibles</h3>
              <p className="text-gray-600 leading-relaxed">Notre IA détecte vos compétences les plus fragiles et vous propose des exercices ciblés. Vous ne perdez plus de temps sur ce que vous maîtrisez déjà.</p>
            </div>

            <div className="p-8 bg-[#F8FAFC] rounded-3xl border border-gray-100 hover:border-blue-200 transition-colors hover:shadow-lg">
              <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 mb-6">
                <TrendingUp className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-[#0A192F] mb-3">La métacognition</h3>
              <p className="text-gray-600 leading-relaxed">Apprenez à juger ce que vous savez vraiment. Déclarez votre confiance, et Repero vous aide à caler votre jugement sur la réalité.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-24 bg-[#0A192F] relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl"></div>

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Prêt à prendre de l'avance ?
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Rejoignez les élèves qui consolident leurs acquis chaque jour. 15 minutes, et c'est tout.
          </p>
          <Link 
            href="/api/auth/login" 
            className="inline-flex items-center gap-2 bg-white text-[#0A192F] px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all hover:scale-105 shadow-xl"
          >
            Se connecter avec OoStudy
            <ArrowRight className="h-5 w-5" />
          </Link>
          
          <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-gray-400">
            <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-400"/> Aucun engagement</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-400"/> Données sécurisées</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-400"/> Conforme RGPD & Loi 09-08</span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <img src="/logo-light.png" alt="Repero" className="h-10 w-auto object-contain" />
            <span className="text-gray-400 text-sm">© 2026 Repero. Un produit OoStudy.</span>
          </div>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="#" className="hover:text-[#0066FF] transition-colors">Mentions légales</Link>
            <Link href="#" className="hover:text-[#0066FF] transition-colors">Confidentialité</Link>
            <Link href="#" className="hover:text-[#0066FF] transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}