"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAppointment } from "@/context/appointmentContext";
import { CookieConsent } from "@/components/CookieConsent";
import TopRatings from "@/components/ratings";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";
import { GradientButton } from "@/components/ui/gradient-button";
import { DemoWindow } from "@/components/demo-window";

const Home = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isPhysioModalOpen, setIsPhysioModalOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [draftData, setDraftData] = useState<any>(null);
  const { dispatch } = useAppointment();

  useEffect(() => {
    setIsClient(true);
  }, []);


  // Solo comprueba la existencia del token en localStorage
  useEffect(() => {
    if (isClient) {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
      setIsAuthenticated(!!token);
    }
  }, [isClient, token]);

  // Efecto para cargar el borrador unificado
  useEffect(() => {
    const storedDraft = sessionStorage.getItem("appointmentDraft");
    if (storedDraft) {
      const parsedDraft = JSON.parse(storedDraft);
      setDraftData(parsedDraft);
      setShowDraftModal(true);
    }
  }, []);

  // Retomar borrador
  const handleResumeDraft = () => {
    if (draftData) {
      // Cargamos el appointmentData en el context
      dispatch({ type: "LOAD_DRAFT", payload: draftData.appointmentData });
      setShowDraftModal(false);

      // Redirigimos a la URL guardada (por ejemplo, Wizard)
      if (draftData.returnUrl) {
        router.push(draftData.returnUrl);
      }
    }
  };

  // Descartar borrador
  const handleDiscardDraft = () => {
    sessionStorage.removeItem("appointmentDraft");
    dispatch({ type: "DESELECT_SERVICE" });
    setDraftModal(false);
  };

  const setDraftModal = (value: boolean) => {
    setShowDraftModal(value);
  };


  return (
    <div className="min-h-screen w-full z=90" style={{ backgroundColor: "rgb(238, 251, 250)" }}>
      
      {/* Add CookieConsent component */}
      <CookieConsent />
      
      {/* Header */}
      {!isAuthenticated && (
        <header className="bg-[rgb(238, 251, 250)] shadow-md py-4">
          <div className="max-w-screen-xl mx-auto px-4 flex justify-between items-center">
            <div className="hidden md:flex items-center space-x-2">
              <button
                  type="button"
                  className="flex items-center space-x-3 bg-[#41B8D5] hover:bg-[#5ab3a8] text-white font-bold py-2 px-6 rounded-full shadow transition-all"
                  onClick={() => router.push('/advanced-search')}
                >
                  <Image
                    src="/static/search.svg"
                    alt="Search Icon"
                    width={24}
                    height={24}
                  />
                  <span>Encuentra el fisio que más se adapta a tí </span>
                </button>
            </div>
            <div className="flex items-center space-x-3 md:space-x-3 pl-10 md:pl-0">
              <button 
                className="text-[#05668D] hover:text-[#05AC9C] px-3 py-2 font-medium"
                onClick={() => router.push("/login")}
              >
                Iniciar sesión
              </button>
              <button 
                className="bg-[#41B8D5] hover:bg-[#05AC9C] text-white px-4 py-2 rounded-full font-medium"
                onClick={() => router.push("/register")}
              >
                Regístrate
              </button>
              <button 
                className="border border-[#1E5ACD] text-[#1E5ACD] hover:bg-[#1E5ACD] hover:text-white px-4 py-2 rounded-full font-medium"
                onClick={() => window.open("https://fisiofind-landing-page.netlify.app/", "_blank")}
              >
                ¿Eres fisio?
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#6BC9BE] to-[#05668D] text-white py-16">
        <div className="max-w-screen-xl mx-auto px-4 pb-16 pt-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="ml-8">
              <h1 className="text-7xl font-bold mb-6">Fisio Find</h1>
                <HeroHighlight containerClassName="h-auto py-12">
                  <p className="text-xl font-bold leading-loose">
                    La plataforma especializada en 
                    <Highlight className="from-[#41B8D5] to-[#1E5ACD] dark:from-[#41B8D5] dark:to-[#1E5ACD]">
                      fisioterapia
                    </Highlight> 
                    online donde te conectamos
                    con el 
                    <Highlight className="from-[#41B8D5] to-[#1E5ACD] dark:from-[#41B8D5] dark:to-[#1E5ACD]">
                      profesional
                    </Highlight> 
                    que mejor se ajusta a tus necesidades.
                  </p>
                </HeroHighlight>
                <br></br>
                <GradientButton
                  onClick={() => router.push('/advanced-search')}
                  className="mt-6 border-none text-white font-inherit text-[17px] py-[0.6em] px-[1.5em] rounded-[20px] bg-gradient-to-r from-[#0400ff] to-[#4ce3f7] bg-[length:100%_auto] hover:bg-[length:200%_auto] hover:bg-right-center flex items-center justify-center animate-[pulse512_1.5s_infinite]"
                  style={{
                    '@keyframes pulse512': {
                      '0%': { boxShadow: '0 0 0 0 #05bada66' },
                      '70%': { boxShadow: '0 0 0 10px rgb(218 103 68 / 0%)' },
                      '100%': { boxShadow: '0 0 0 0 rgb(218 103 68 / 0%)' }
                    }
                  }}
                >
                  <span>Accede a la Búsqueda Avanzada</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </GradientButton>
            </div>
          
            <div className="relative hidden md:block">
              {/* Floating images around the logo */}
              <div className="absolute top-0 left-0 w-full h-full hidden lg:block">
                <div className="floating-image" style={{ right: "50%", top: "55%" }}>
                  <Image
                    src="/static/9_girl.webp"
                    alt="Floating Image 3"
                    width={400}
                    height={400}
                  />
                </div>
                <div className="floating-image" style={{ left: "10%", top: "-5%" }}>
                  <Image
                    src="/static/1_heart.webp"
                    alt="Floating Image 1"
                    width={150}
                    height={150}
                  />
                </div>
                <div className="floating-image" style={{ right: "0%", top: "-15%" }}>
                  <Image
                    src="/static/7_treatment.webp"
                    alt="Floating Image 3"
                    width={180}
                    height={180}
                  />
                </div>
                <div className="floating-image" style={{ right: "-20%", top: "30%" }}>
                  <Image
                    src="/static/2_liftweights.webp"
                    alt="Floating Image 3"
                    width={300}
                    height={300}
                  />
                </div>
              </div>
              
              <Image
                src="/static/fisio_find_logo_white.webp"
                alt="Hero Image"
                width={500}
                height={400}
                className="filter blur-[2px]"
              />
            </div>
          </div>
        </div>
        
        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0 bg-[rgb(238, 251, 250)]">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 1440 120" 
            fill="rgb(238, 251, 250)" 
            preserveAspectRatio="none"
            className="block w-full h-[120px]" // Added explicit height
          >
            <path d="M0,32L80,48C160,64,320,96,480,96C640,96,800,64,960,48C1120,32,1280,32,1360,32L1440,32L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* How it works Section */}
      <section className="pt-16 pb-16 bg-[rgb(238, 251, 250)] relative -mt-1"> {/* Added relative and negative margin */}
        <div className="max-w-screen-xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-[#253240] mb-12 text-center">¿Cómo funciona Fisio Find?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl hover:shadow-lg transition-all">
              <div className="bg-[#f0f9fa] rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#05AC9C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#253240] mb-4">Encuentra a tu fisioterapeuta</h3>
              <p className="text-gray-600">Podrás comparar entre diferentes profesionales y escoger el que mejor se adapte a tus necesidades.</p>
            </div>
            
            <div className="text-center p-6 rounded-xl hover:shadow-lg transition-all">
              <div className="bg-[#f0f9fa] rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#05AC9C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#253240] mb-4">Contacta y reserva tu sesión</h3>
              <p className="text-gray-600">Selecciona el día y la hora en la agenda de tu fisio de forma rápida y segura.</p>
            </div>
            
            <div className="text-center p-6 rounded-xl hover:shadow-lg transition-all">
              <div className="bg-[#f0f9fa] rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#05AC9C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#253240] mb-4">Videoconsulta Especializada</h3>
              <p className="text-gray-600">Consultas online con herramientas específicas de diagnóstico y seguimiento personalizado.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Video */}
      <section className="px-4 py-16 relative z-10">
        <DemoWindow />
      </section>

      {/* Authentication Section: solo se muestra si NO está autenticado */}
      {!isAuthenticated && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-screen-xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-[#253240] mb-12 text-center">Únete a Fisio Find</h2>
            
            <div className="max-w-md mx-auto">
              <div className="mb-6">
                <GradientButton 
                  onClick={() => router.push("/register")}
                  className="w-full py-4 text-lg"
                >
                  Crea una cuenta
                </GradientButton>
              </div>
              
              <p className="text-center text-gray-600 mb-6">Si ya tienes una cuenta...</p>
              
              <div className="mb-6">
                <GradientButton 
                  variant="edit"
                  onClick={() => router.push("/login")}
                  className="w-full py-4 text-lg"
                >
                  Inicia sesión
                </GradientButton>
              </div>
              
              <div className="bg-[#1E5ACD] p-6 rounded-lg text-white text-center mt-12">
                <p className="font-bold text-lg mb-4">¿Eres fisioterapeuta?</p>
                <button
                  className="px-6 py-2 bg-white text-[#1E5ACD] rounded-lg font-semibold hover:bg-gray-100 transition-all"
                  onClick={() => window.open("https://fisiofind-landing-page.netlify.app/", "_blank")}
                >
                  Para más información, accede aquí
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Ratings Section */}
      <section className="py-16 bg-[rgb(238, 251, 250)]">
        <div className="max-w-screen-xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-[#253240] mb-12 text-center">
            La opinión de fisioterapeutas profesionales
          </h2>
          <TopRatings />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 pt-8 gap-8 border-t border-gray-700 text-center">
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-bold mb-4">Sobre Fisio Find</h3>
            <p>
              Una plataforma innovadora diseñada para conectar pacientes con los
              mejores fisioterapeutas.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-bold mb-4">Enlaces Útiles</h3>
            <ul>
              <li>
                <a
                  href="https://fisiofind-landing-page.netlify.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Conoce Fisio Find
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/Proyecto-ISPP/FISIOFIND"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Repositorio GitHub
                </a>
              </li>
              <li>
                <a href="/terms">Política de Privacidad</a>
              </li>
              <li>
                <Link href="/terms">Términos de Servicio</Link>
              </li>
            </ul>
          </div>
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-bold mb-4">Contacto</h3>
            <p>Correo: <a href="mailto:support@fisiofind.com" className="hover:underline">support@fisiofind.com</a></p>
            <p>Ubicación: Sevilla, España</p>
          </div>
        </div>
        <div className="text-center mt-8 pt-8 border-t border-gray-700">
          <p>© 2025 Fisio Find. Hola licencia MIT</p>
        </div>
      </footer>
    </div>
  );
};

export default function Main() {
  return <Home />;
}