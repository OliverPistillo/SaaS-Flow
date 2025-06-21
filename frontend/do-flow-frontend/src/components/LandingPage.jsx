import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  Shield, 
  Zap, 
  CheckCircle,
  ArrowRight,
  Play,
  Star
} from 'lucide-react';
import '../App.css';

const LandingPage = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const features = [
    {
      icon: <BarChart3 className="h-8 w-8 text-blue-600" />,
      title: "Pianificazione finanziaria",
      description: "Monitora il flusso di cassa, i margini, le tasse e altro ancora con l'analisi finanziaria in tempo reale."
    },
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: "Test attitudinali",
      description: "Scopri i migliori membri del team con test attitudinali basati sull'intelligenza artificiale pensati per la tua azienda."
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-blue-600" />,
      title: "Report e approfondimenti sull'intelligenza artificiale",
      description: "Ricevi report e avvisi automatizzati per prendere decisioni più intelligenti e rapide."
    }
  ];

  const benefits = [
    "Analisi finanziaria in tempo reale",
    "Team building più intelligente", 
    "Informazioni fruibili sull'intelligenza artificiale",
    "Una piattaforma semplice"
  ];

  const testimonials = [
    {
      name: "Marco Rossi",
      company: "TechStart SRL",
      rating: 5,
      text: "Do-Flow ha trasformato il modo in cui gestiamo le nostre finanze e il nostro team. Incredibile!"
    },
    {
      name: "Laura Bianchi", 
      company: "Innovate Solutions",
      rating: 5,
      text: "I test attitudinali AI ci hanno aiutato a trovare i talenti giusti. Risultati straordinari."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="relative z-50 bg-transparent">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">Do-Flow</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link to="#" className="text-gray-300 hover:text-white transition-colors">Home</Link>
              <Link to="#" className="text-gray-300 hover:text-white transition-colors">Soluzioni PMI</Link>
              <Link to="#" className="text-gray-300 hover:text-white transition-colors">Prezzi</Link>
              <Link to="#" className="text-gray-300 hover:text-white transition-colors">Test Attitudinali</Link>
              <Link to="#" className="text-gray-300 hover:text-white transition-colors">Piano Finanziario</Link>
              <Link to="#" className="text-gray-300 hover:text-white transition-colors">Contatti</Link>
            </div>

            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost" className="text-white hover:bg-white/10">
                  Accedi
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                  Avvia flusso primario
                </Button>
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Ottimizza la tua PMI con un<br />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              unico potente software
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Inizia oggi la tua prova gratuita di 7 giorni. Dopodiché pagherai solo 99 € al mese.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link to="/register">
              <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 text-lg">
                Avvia flusso primario
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-gray-600 text-white hover:bg-white/10 px-8 py-4 text-lg"
              onClick={() => setIsVideoPlaying(true)}
            >
              <Play className="mr-2 h-5 w-5" />
              Saperne di più
            </Button>
          </div>

          {/* Video Placeholder */}
          <div className="relative max-w-4xl mx-auto">
            <div className="aspect-video bg-gradient-to-br from-blue-800 to-purple-800 rounded-2xl flex items-center justify-center shadow-2xl">
              {!isVideoPlaying ? (
                <Button 
                  size="lg"
                  className="bg-white/20 hover:bg-white/30 text-white rounded-full p-6"
                  onClick={() => setIsVideoPlaying(true)}
                >
                  <Play className="h-8 w-8" />
                </Button>
              ) : (
                <div className="text-white text-xl">Video Demo - Do-Flow in Azione</div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-slate-800/50">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">
                La crescita del tuo<br />
                business, tutto in un<br />
                unico posto
              </h2>
              <p className="text-gray-300 text-lg mb-8">
                Do-Flow ti offre tutto ciò di cui hai bisogno per gestire le finanze aziendali e 
                valutare il potenziale del tuo team. Grazie a strumenti basati sull'intelligenza 
                artificiale e a insight intelligenti, avrai sempre una visione chiara delle 
                performance della tua azienda.
              </p>
              <Link to="/register">
                <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                  Inizia la tua prova gratuita
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="bg-slate-700/50 border-slate-600 hover:bg-slate-700/70 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      {feature.icon}
                      <CardTitle className="text-white">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-300">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">
                Come aiuta la tua<br />
                attività
              </h2>
              <p className="text-gray-300 text-lg mb-8">
                Do-Flow unisce pianificazione finanziaria e sviluppo del team, così puoi 
                concentrarti su ciò che conta di più: far crescere la tua attività. Con insight 
                automatizzati e un'interfaccia intuitiva, gestire le tue finanze e i tuoi talenti non è 
                mai stato così facile.
              </p>
            </div>

            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <CheckCircle className="h-6 w-6 text-blue-400 flex-shrink-0" />
                  <div>
                    <h3 className="text-white font-semibold text-lg">{benefit}</h3>
                    <p className="text-gray-400">
                      {index === 0 && "Tieni sotto controllo il flusso di cassa, le tasse e i margini con dati e previsioni in tempo reale."}
                      {index === 1 && "Identifica i tuoi migliori collaboratori con test attitudinali basati sull'intelligenza artificiale che rivelano i punti di forza individuali."}
                      {index === 2 && "Prendi decisioni consapevoli grazie ad avvisi automatici e riepiloghi delle prestazioni che si adattano alla tua attività."}
                      {index === 3 && "Accedi a tutto ciò di cui hai bisogno in un unico software intuitivo, dalla pianificazione finanziaria dettagliata alle valutazioni avanzate del team."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-slate-800/50">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-12">
            Come Do-Flow potenzia la tua attività
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-slate-700/50 border-slate-600">
                <CardHeader>
                  <div className="flex items-center justify-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardDescription className="text-gray-300 text-lg italic">
                    "{testimonial.text}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-white font-semibold">{testimonial.name}</div>
                  <div className="text-gray-400">{testimonial.company}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Pronto a trasformare la tua azienda?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Unisciti a centinaia di PMI che hanno già scelto Do-Flow per ottimizzare 
            le loro performance finanziarie e del team.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 text-lg">
                Inizia la prova gratuita
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="border-gray-600 text-white hover:bg-white/10 px-8 py-4 text-lg">
                Hai già un account? Accedi
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-slate-900 border-t border-slate-700">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">Do-Flow</span>
            </div>
            
            <div className="flex items-center space-x-6 text-gray-400">
              <Link to="#" className="hover:text-white transition-colors">Privacy</Link>
              <Link to="#" className="hover:text-white transition-colors">Termini</Link>
              <Link to="#" className="hover:text-white transition-colors">Supporto</Link>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-slate-700 text-center text-gray-400">
            <p>&copy; 2024 Do-Flow. Tutti i diritti riservati.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

