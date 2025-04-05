"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Modal from "@/components/ui/Modal";
import Link from "next/link";
import axios from "axios";
import { getApiBaseUrl } from "@/utils/api";
import { useAppointment } from "@/context/appointmentContext";
import DraftModal from "@/components/ui/draftAppointmentModal";
import { DemoWindow } from "@/components/demo-window";
import { GradientButton } from "@/components/ui/gradient-button";
import { CookieConsent } from "@/components/CookieConsent";
import TopRatings from "@/components/ratings";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";

interface Physiotherapist {
  id: string;
  name: string;
  speciality: string;
  rating: number;
  image: string;
  location: string;
  reviews: number;
  specializations?: string;
}

const Home = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isPhysioModalOpen, setIsPhysioModalOpen] = useState(false);

  const openPhysioModal = () => setIsPhysioModalOpen(true);
  const closePhysioModal = () => setIsPhysioModalOpen(false);
  const [isClient, setIsClient] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const apiBaseurl = getApiBaseUrl();
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [draftData, setDraftData] = useState<any>(null);
  const { dispatch } = useAppointment();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Si el usuario está autenticado se abre el modal, si no, redirige al perfil público
  const handleViewPhysio = (physioName: string) => {
    if (isAuthenticated) {
      openPhysioModal();
    } else {
      router.push(`/profile/${physioName}`);
    }
  };

  // Solo comprueba la existencia del token en localStorage
  useEffect(() => {
    if (isClient) {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
      setIsAuthenticated(!!token);
    }
  }, [isClient, token]);

  // Efecto para mover imágenes flotantes al hacer scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const floatingImages = document.querySelectorAll(".floating-image");

      // Only apply floating effect if screen is large enough
      if (window.innerWidth > 1240) {
        floatingImages.forEach((image, index) => {
          const offset = (index + 1) * 50;
          (image as HTMLElement).style.transform = `translateX(${
            scrollY / offset
          }px)`;
        });
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const SearchPhysiotherapists = () => {
    const [searchResults, setSearchResults] = useState<Physiotherapist[]>([]);
    const [specialization, setSpecialization] = useState("");
    const [specializations, setSpecializations] = useState<string[]>([]);
    const [searchAttempted, setSearchAttempted] = useState(false);

    useEffect(() => {
      const checkScriptLoaded = () => {
        if (
          typeof window !== "undefined" &&
          typeof window.customElements !== "undefined" &&
          window.customElements.get("animated-icons")
        ) {
        } else {
          setTimeout(checkScriptLoaded, 200);
        }
      };

      checkScriptLoaded();
    }, []);

    useEffect(() => {
      const fetchSpecializations = async () => {
        try {
          const response = await axios.get(
            `${getApiBaseUrl()}/api/guest_session/specializations/`
          );

          if (response.status === 200) {
            if (response.data && response.data.length > 0) {
              setSpecializations(["", ...response.data]);
            } else {
              console.warn("Specializations list is empty.");
              setSpecializations([]); // Set an empty list if no data is returned
            }
          } else {
            console.warn("Unexpected response status:", response.status);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchSpecializations();
    }, []);

    // const handleSearch = async () => {
    //   setSearchAttempted(true);

    //   if (!specialization) {
    //     return;
    //   }

    //   try {
    //     const searchUrl = `${apiBaseurl}/api/guest_session/physios-with-specializations/?specialization=${specialization}`;
    //     const response = await axios.get(searchUrl);

    //     if (response.status === 200) {
    //       const results = response.data.map(
    //         (physio: {
    //           id: string;
    //           first_name: string;
    //           last_name: string;
    //           specializations: string[];
    //         }) => ({
    //           id: physio.id,
    //           name: `${physio.first_name} ${physio.last_name}`,
    //           specializations: physio.specializations.join(", "),
    //         })
    //       );
    //       console.log(results);
    //       setSearchResults(results);
    //     } else {
    //       alert(response.data.detail || "No se encontraron resultados.");
    //       setSearchResults([]);
    //     }
    //   } catch (error) {
    //     console.error("Error fetching data:", error);
    //     setSearchResults([]);
    //   }
    // };

    return (
      <div className="w-full flex items-center relative">
        {showDraftModal && draftData && (
          <DraftModal
            draftData={draftData}
            onResume={handleResumeDraft}
            onDiscard={handleDiscardDraft}
          />
        )}
        <section className="w-full py-4 relative overflow-hidden">
          <h2 className="text-3xl text-[#253240] font-bold mb-2 text-center">
            Encuentra a tu fisioterapeuta ideal
          </h2>
          <div className="max-w-6xl mx-auto px-4">
            <div className="max-w-2xl mx-auto flex justify-center">
              <button
                type="button"
                className="flex items-center space-x-3 bg-[#1E5ACD] hover:bg-[#5ab3a8] text-white font-bold py-2 px-6 rounded-full shadow transition-all"
                onClick={() => router.push('/advanced-search')}
              >
                <Image
                  src="/static/search.svg"
                  alt="Search Icon"
                  width={24}
                  height={24}
                />
                <span>Búsqueda avanzada</span>
              </button>
            </div>          
          </div>
        </section>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full z=90" style={{ backgroundColor: "rgb(238, 251, 250)" }}>
      {/* Add CookieConsent component */}
      <CookieConsent />
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center relative overflow-hidden mb-8">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="floating-image" style={{ right: "70%", top: "35%" }}>
              <Image
                src="/static/9_girl.webp"
                alt="Floating Image 3"
                width={250}
                height={250}
              />
            </div>
            <div className="floating-image" style={{ left: "30%", top: "10%" }}>
              <Image
                src="/static/1_heart.webp"
                alt="Floating Image 1"
                width={70}
                height={70}
              />
            </div>
            <div className="floating-image" style={{ right: "30%", top: "10%" }}>
              <Image
                src="/static/7_treatment.webp"
                alt="Floating Image 3"
                width={80}
                height={80}
              />
            </div>
            <div className="floating-image" style={{ right: "10%", top: "35%" }}>
              <Image
                src="/static/2_liftweights.webp"
                alt="Floating Image 3"
                width={150}
                height={150}
              />
            </div>
          </div>
          <div className="flex flex-col items-center mt-8">
            <Image
              src="/static/logo_fisio_find_smaller.webp"
              alt="Fisio Find Logo"
              width={250}
              height={250}
              className="mb-12 relative z-10 w-[250px] h-auto"
            />
            <h1 className="text-7xl font-bold mb-12 font-alfa-slab-one relative z-10">
              <span className="text-white drop-shadow-[0_2.5px_3.5px_#41B8D5]">Fisio Find</span>
            </h1>
            <div className="max-w-4xl mx-auto relative z-10 text-[#253240] mt-16">
              <HeroHighlight containerClassName="h-auto py-12 bg-[rgb(238, 251, 250)]">
                <p className="text-xl font-bold leading-relaxed">
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
            </div>
          </div>
      </section>


      {/* Search Section */}
      {/* Unified Search Bar */}
      <SearchPhysiotherapists />

      {/* Focus Cards Section: solo se muestra si NO está autenticado */}
      {!isAuthenticated && (
        <section className="flex flex-col items-center justify-center text-center py-12 dark:bg-neutral-900">
          <br />
          <h2 className="text-3xl text-[#253240] font-bold mb-4">
            Únete a Fisio Find
          </h2>
          <p className="text-lg mb-8">
            Crea una cuenta o inicia sesión para disfrutar de todas nuestras
            posibilidades.
          </p>
          <div className="flex flex-col gap-4">
            <GradientButton
              variant="create" 
              fullWidth
              onClick={() => router.push("/register")}
            >
              Crea una cuenta
            </GradientButton>
            <p className="text-lg">Si ya tienes una cuenta ...</p>
            <GradientButton
              variant="edit" 
              fullWidth
              onClick={() => router.push("/login")}
            >
              Inicia sesión
            </GradientButton>
          </div>
          <section className="w-full bg-[#1E5ACD] py-4 text-center text-white rounded-lg mx-auto mt-8 max-w-4xl shadow-lg">
            <div className="px-4 flex flex-col sm:flex-row items-center justify-center">
              <p className="font-bold text-lg sm:text-xl mb-2 sm:mb-0">
                ¿Eres fisioterapeuta?
              </p>
              <button
                className="ml-0 sm:ml-3 px-4 py-2 bg-white text-[#1E5ACD] rounded-md font-semibold hover:bg-gray-100 transition-all"
                onClick={() =>
                  window.open(
                    "https://fisiofind-landing-page.netlify.app/",
                    "_blank"
                  )
                }
              >
                Para más información, accede aquí
              </button>
            </div>
          </section>
          <br />
        </section>
      )}
    

      {/* Ratings Section */}
      <section className="max-w-7xl mx-auto px-4 mb-12">
        <h2 className="text-3xl text-[#253240] font-bold mb-8 text-center">
          La opinión de fisioterapeutas profesionales
        </h2>
        <TopRatings />
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
          <p>© 2025 Fisio Find. Bajo licencia MIT</p>
        </div>
      </footer>

      {/* Modal para usuarios no autenticados */}
      {isPhysioModalOpen && (
        <Modal onClose={closePhysioModal}>
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Acceso requerido</h2>
            <p className="mb-4">
              Por favor, inicia sesión o crea una cuenta para ver el perfil del
              fisioterapeuta.
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                onClick={closePhysioModal}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={() => router.push("/profile/login")}
              >
                Iniciar sesión
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                onClick={() => router.push("/profile/signup")}
              >
                Crear cuenta
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default function Main() {
  return <Home />;
}