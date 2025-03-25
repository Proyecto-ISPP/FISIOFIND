"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import Modal from "@/components/ui/Modal";
import Link from "next/link";
import axios from "axios";
import { getApiBaseUrl } from "@/utils/api";
import { CookieConsent } from "@/components/CookieConsent";

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
  // Modify the floating images styles
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const floatingImages = document.querySelectorAll(".floating-image");
      
      // Only apply floating effect if screen is large enough
      if (window.innerWidth > 1240) {
        floatingImages.forEach((image, index) => {
          const offset = (index + 1) * 50;
          (image as HTMLElement).style.transform = `translateX(${scrollY / offset}px)`;
        });
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Datos de ejemplo para los fisioterapeutas destacados
  // const topPhysiotherapists: Physiotherapist[] = [
  //   {
  //     name: "Dr. Ana García",
  //     speciality: "Fisioterapia Deportiva",
  //     rating: 4.9,
  //     image:
  //       "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=3328&auto=format&fit=crop",
  //     location: "Madrid",
  //     reviews: 128,
  //   },
  //   {
  //     name: "Dr. Carlos Rodríguez",
  //     speciality: "Rehabilitación Neurológica",
  //     rating: 4.8,
  //     image:
  //       "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=3270&auto=format&fit=crop",
  //     location: "Barcelona",
  //     reviews: 96,
  //   },
  //   {
  //     name: "Dra. Laura Martínez",
  //     speciality: "Fisioterapia Pediátrica",
  //     rating: 4.8,
  //     image:
  //       "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=3270&auto=format&fit=crop",
  //     location: "Valencia",
  //     reviews: 112,
  //   },
  // ];

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

    const handleSearch = async () => {
      setSearchAttempted(true);

      if (!specialization) {
        return;
      }

      try {
        const searchUrl = `${apiBaseurl}/api/guest_session/physios-with-specializations/?specialization=${specialization}`;
        const response = await axios.get(searchUrl);

        if (response.status === 200) {
          const results = response.data.map(
            (physio: {
              id: string;
              first_name: string;
              last_name: string;
              specializations: string[];
            }) => ({
              id: physio.id,
              name: `${physio.first_name} ${physio.last_name}`,
              specializations: physio.specializations.join(", "),
            })
          );
          console.log(results);
          setSearchResults(results);
        } else {
          alert(response.data.detail || "No se encontraron resultados.");
          setSearchResults([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setSearchResults([]);
      }
    };

    return (
      <div className="w-full flex items-center relative">
        <section className="w-full py-4 relative overflow-hidden">
          <h2 className="text-3xl text-[#253240] font-bold mb-2 text-center">
            Encuentra a tu fisioterapeuta ideal
          </h2>
          <p className="text-lg mx-auto text-center mb-4 max-w-2xl">
            Busca por especialidad
          </p>
          <div className="max-w-6xl mx-auto px-4">
            <form className="max-w-2xl mx-auto">
              {/* Contenedor flex para el dropdown de especialidades y el botón de búsqueda */}
              <div className="flex items-center space-x-4 mx-auto">
                {/* Dropdown para especialidad */}
                <div className="w-3/4 mx-auto">
                  <select
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    className="border border-gray-300 rounded-md px-4 py-2 w-full"
                  >
                    <option value="" disabled>
                      Especialidad
                    </option>
                    {specializations.map((spec, index) => (
                      <option key={index} value={spec}>
                        {spec}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Botón de búsqueda */}
                <button
                  type="button"
                  className="hover:bg-gray-300 text-gray-700 w-16 flex items-center justify-center rounded-full transition-all"
                  id="search-button"
                  onClick={handleSearch}
                >
                  <div className="flex items-center justify-center">
                    <Image
                      src="./static/search.svg"
                      alt="Search Icon"
                      width={24}
                      height={24}
                    />
                  </div>
                </button>
              </div>
            </form>

            {/* Mostrar la alerta si no se selecciona una especialidad */}
            {searchAttempted && !specialization && (
              <div className="error flex justify-center items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-xs z-10">
                <div className="error__icon">
                  {/* Aquí puede ir un icono de advertencia */}
                </div>
                <div className="error__title">
                  Por favor, selecciona una especialidad
                </div>
                <div
                  className="error__close"
                  onClick={() => setSpecialization("")}
                >
                  {/* Icono de cerrar */}
                </div>
              </div>
            )}

            {/* Mostrar los resultados de la búsqueda */}
            {searchResults.length > 0 && (
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((physio, index) => (
                  <CardContainer key={index}>
                    <CardBody className="bg-gradient-to-bl from-white to-[#65C2C9]/50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-blue-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full min-h-[400px] rounded-xl p-6 border flex flex-col">
                      {/* Nombre */}
                      <CardItem
                        translateZ="50"
                        className="text-xl font-bold text-neutral-600 dark:text-white"
                      >
                        {physio.name}
                      </CardItem>
                      {/* Especialidades */}
                      <CardItem
                        as="p"
                        translateZ="40"
                        className="text-neutral-500 text-sm mt-2 dark:text-neutral-300"
                      >
                        {physio.specializations}
                      </CardItem>
                      {/* Imagen estática del fisioterapeuta */}
                      <CardItem translateZ="60" className="w-full mt-4 z-20">
                        <Image
                          src="/static/fisioterapeuta_sample.webp"
                          className="h-48 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                          alt="Fisioterapeuta"
                          width={500}
                          height={500}
                        />
                      </CardItem>
                      {/* Botón para ver el perfil del fisioterapeuta */}
                      <button>
                        <CardItem
                          translateZ="20"
                          className="px-4 py-2 rounded-xl bg-[#1E5ACD] text-white text-sm font-bold hover:bg-[#1848A3] transition-colors"
                          onClick={() => router.push(`/appointments/create/${physio.id}`)}
                        >
                          Reservar cita
                        </CardItem>
                      </button>
                    </CardBody>
                  </CardContainer>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full z=90">
      {/* Add CookieConsent component */}
      <CookieConsent />
      
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center relative overflow-hidden mb-8 py-12">
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
          <div
            className="floating-image"
            style={{ right: "38%", bottom: "29%" }}
          >
            <Image
              src="/static/4_shine.webp"
              alt="Floating Image 2"
              width={40}
              height={40}
            />
          </div>
          <div
            className="floating-image"
            style={{ left: "37%", bottom: "41%" }}
          >
            <Image
              src="/static/4_shine.webp"
              alt="Floating Image 2"
              width={40}
              height={40}
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
          <div className="floating-image" style={{ right: "10%", top: "55%" }}>
            <Image
              src="/static/2_liftweights.webp"
              alt="Floating Image 3"
              width={150}
              height={150}
            />
          </div>
        </div>
        <Image
          src="/static/logo_fisio_find_smaller.webp"
          alt="Fisio Find Logo"
          width={150}
          height={150}
          className="mb-4"
        />
        <h1 className="text-5xl font-bold mb-2 font-alfa-slab-one">
          <span className="text-[#05668d]">Fisio </span>
          <span className="text-[#018b89]">Find</span>
        </h1>
        <p className="text-lg mb-4 max-w-2xl">
          La plataforma especializada en fisioterapia online donde te conectamos
          con el profesional que mejor se ajusta a tus necesidades.
        </p>
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
            <button
              className="shadow__btn bg-[#1E5ACD] text-white px-4 py-3 rounded font-bold hover:bg-[#1848A3] transition-colors"
              onClick={() => router.push("/register")}
            >
              Crea una cuenta
            </button>
            <p className="text-lg">Si ya tienes una cuenta ...</p>
            <button
              className="shadow__btn text-white rounded font-bold hover:bg-[#0A7487] transition-colors text-sm"
              onClick={() => router.push("/login")}
              style={{ "--shadow-color": "#0A7487" } as React.CSSProperties}
            >
              Inicia sesión
            </button>
          </div>
            <section className="w-full bg-[#1E5ACD] py-4 text-center text-white rounded-lg mx-auto mt-8 max-w-4xl shadow-lg">
            <div className="px-4 flex flex-col sm:flex-row items-center justify-center">
              <p className="font-bold text-lg sm:text-xl mb-2 sm:mb-0">
              ¿Eres fisioterapeuta?
              </p>
              <button
              className="ml-0 sm:ml-3 px-4 py-2 bg-white text-[#1E5ACD] rounded-md font-semibold hover:bg-gray-100 transition-all"
              onClick={() => window.open("https://fisiofind-landing-page.netlify.app/", "_blank")}
              >
              Para más información, accede aquí
              </button>
            </div>
            </section>
          <br />
        </section>
      )}
      {/* Sección “¿Eres fisioterapeuta?” */}


      {/* Top Physiotherapists Section */}
      <section className="max-w-7xl mx-auto px-4 mb-12">
        <h2 className="text-3xl text-[#253240] font-bold mb-8 text-center">
          Top Fisioterapeutas
        </h2>
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topPhysiotherapists.map((physio, index) => (
            <CardContainer key={index}>
              <CardBody className="bg-gradient-to-bl from-white to-[#65C2C9]/50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-blue-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full h-auto rounded-xl p-6 border">
                <CardItem
                  translateZ="50"
                  className="text-xl font-bold text-neutral-600 dark:text-white"
                >
                  {physio.name}
                </CardItem>
                <CardItem
                  as="p"
                  translateZ="40"
                  className="text-neutral-500 text-sm mt-2 dark:text-neutral-300"
                >
                  {physio.speciality}
                </CardItem>
                <CardItem translateZ="60" className="w-full mt-4">
                  <img
                    src={physio.image}
                    className="h-48 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                    alt={physio.name}
                  />
                </CardItem>
                <div className="flex justify-between items-center mt-6">
                  <CardItem translateZ="20" className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span className="font-semibold">{physio.rating}</span>
                    <span className="text-sm text-neutral-500">
                      ({physio.reviews} reviews)
                    </span>
                  </CardItem>
                  <CardItem
                    translateZ="20"
                    as="button"
                    className="px-4 py-2 rounded-xl bg-[#1E5ACD] text-white text-sm font-bold hover:bg-[#1848A3] transition-colors"
                    onClick={() => handleViewPhysio(physio.name)}
                  >
                    Ver perfil
                  </CardItem>
                </div>
              </CardBody>
            </CardContainer>
          ))}
        </div> */}
      </section>

      {/* Footer */}
      <footer className="py-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 pt-8 gap-8 border-t border-gray-700">
          <div>
            <h3 className="text-lg font-bold mb-4">Sobre Fisio Find</h3>
            <p>
              Una plataforma innovadora diseñada para conectar pacientes con los
              mejores fisioterapeutas.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Enlaces Útiles</h3>
            <ul>
              <li>
                <a href="https://fisiofind-landing-page.netlify.app/" target="_blank" rel="noopener noreferrer">
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
          <div>
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
