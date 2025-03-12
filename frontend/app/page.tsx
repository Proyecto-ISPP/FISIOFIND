"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import Modal from "@/components/ui/Modal";

interface Physiotherapist {
  name: string;
  specialty: string;
  rating: number;
  image: string;
  location: string;
  reviews: number;
}

const Home = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchResults, setSearchResults] = useState<Physiotherapist[]>([]);
  const [isPhysioModalOpen, setIsPhysioModalOpen] = useState(false);

  const openPhysioModal = () => setIsPhysioModalOpen(true);
  const closePhysioModal = () => setIsPhysioModalOpen(false);

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
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  // Efecto para mover imágenes flotantes al hacer scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const floatingImages = document.querySelectorAll(".floating-image");
      floatingImages.forEach((image, index) => {
        const offset = (index + 1) * 50;
        (image as HTMLElement).style.transform = `translateX(${scrollY / offset}px)`;
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Datos de ejemplo para los fisioterapeutas destacados
  const topPhysiotherapists: Physiotherapist[] = [
    {
      name: "Dr. Ana García",
      specialty: "Fisioterapia Deportiva",
      rating: 4.9,
      image:
        "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=3328&auto=format&fit=crop",
      location: "Madrid",
      reviews: 128,
    },
    {
      name: "Dr. Carlos Rodríguez",
      specialty: "Rehabilitación Neurológica",
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=3270&auto=format&fit=crop",
      location: "Barcelona",
      reviews: 96,
    },
    {
      name: "Dra. Laura Martínez",
      specialty: "Fisioterapia Pediátrica",
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=3270&auto=format&fit=crop",
      location: "Valencia",
      reviews: 112,
    },
  ];

  // Simula una búsqueda de fisioterapeutas
  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const mockResults: Physiotherapist[] = [
      {
        name: "Dr. Ana García",
        specialty: "Fisioterapia Deportiva",
        rating: 4.9,
        image:
          "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=3328&auto=format&fit=crop",
        location: "Madrid",
        reviews: 128,
      },
      {
        name: "Dr. Carlos Rodríguez",
        specialty: "Rehabilitación Neurológica",
        rating: 4.8,
        image:
          "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=3270&auto=format&fit=crop",
        location: "Barcelona",
        reviews: 96,
      },
    ];
    setSearchResults(mockResults);
  };

  return (
    <div className="min-h-screen w-full">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="floating-image" style={{ left: "10%", top: "20%" }}>
            <Image src="/static/1_heart.webp" alt="Floating Image 1" width={100} height={100} />
          </div>
          <div className="floating-image" style={{ right: "12%", bottom: "30%" }}>
            <Image src="/static/4_shine.webp" alt="Floating Image 2" width={100} height={100} />
          </div>
          <div className="floating-image" style={{ right: "5%", top: "10%" }}>
            <Image src="/static/7_treatment.webp" alt="Floating Image 3" width={100} height={100} />
          </div>
        </div>
        <Image
          src="/static/fisio_find_logo.webp"
          alt="Fisio Find Logo"
          width={256}
          height={256}
          className="mb-8"
        />
        <h1 className="text-6xl font-bold mb-4 font-alfa-slab-one">
          <span className="text-[#1E5ACD]">Fisio </span>
          <span className="text-[#253240]">Find</span>
        </h1>
        <p className="text-xl mb-8 max-w-2xl">
          Una plataforma innovadora diseñada para conectar pacientes con los mejores fisioterapeutas.
        </p>
      </section>

      {/* Sección “¿Eres fisioterapeuta?” */}
      <section className="w-full bg-teal-500 py-2 text-center text-white rounded-lg mx-auto mt-4 max-w-4xl">
        <div className="px-4 flex items-center justify-center">
          <p className="font-bold text-sm sm:text-base">
            ¿Eres fisioterapeuta? 
            <button
              className="ml-3 px-3 py-1 bg-white text-teal-600 rounded-md font-semibold hover:bg-gray-100 transition-all"
              onClick={() => window.open("https://fisiofind.netlify.app", "_blank")}
            >
              Para más información, accede aquí
            </button>
          </p>
        </div>
      </section>

      {/* Focus Cards Section: solo se muestra si NO está autenticado */}
      {!isAuthenticated && (
        <section className="flex flex-col items-center justify-center text-center py-12 dark:bg-neutral-900">
          <br />
          <h2 className="text-3xl text-[#253240] font-bold mb-4">Únete a Fisio Find</h2>
          <p className="text-lg mb-8">
            Crea una cuenta o inicia sesión para disfrutar de todas nuestras posibilidades.
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
          <br />
        </section>
      )}

      {/* Top Physiotherapists Section */}
      <section className="max-w-7xl mx-auto px-4 mb-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Top Fisioterapeutas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topPhysiotherapists.map((physio, index) => (
            <CardContainer key={index}>
              <CardBody className="bg-gradient-to-bl from-white to-[#65C2C9]/50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-blue-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full h-auto rounded-xl p-6 border">
                <CardItem translateZ="50" className="text-xl font-bold text-neutral-600 dark:text-white">
                  {physio.name}
                </CardItem>
                <CardItem
                  as="p"
                  translateZ="40"
                  className="text-neutral-500 text-sm mt-2 dark:text-neutral-300"
                >
                  {physio.specialty}
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
                    <span className="text-sm text-neutral-500">({physio.reviews} reviews)</span>
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
        </div>
      </section>

      {/* Search Section */}
      <section className="max-w-3xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Buscar Fisioterapeutas</h2>
        <div className="relative">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Buscar fisioterapeutas..."
              className="w-full px-6 py-4 text-lg rounded-2xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#1E5ACD] focus:border-transparent transition-all duration-200 shadow-sm"
            />
            <button
              type="submit"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#1E5ACD] hover:bg-[#1848A3] text-white px-6 py-2 rounded-xl transition-all duration-200 flex items-center gap-2"
            >
              <span>Buscar</span>
            </button>
          </form>
        </div>
        {searchResults.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((physio, index) => (
              <CardContainer key={index}>
                <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-blue-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full h-auto rounded-xl p-6 border">
                  <CardItem translateZ="50" className="text-xl font-bold text-neutral-600 dark:text-white">
                    {physio.name}
                  </CardItem>
                  <CardItem
                    as="p"
                    translateZ="40"
                    className="text-neutral-500 text-sm mt-2 dark:text-neutral-300"
                  >
                    {physio.specialty}
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
                      <span className="text-sm text-neutral-500">({physio.reviews} reviews)</span>
                    </CardItem>
                    <CardItem
                      translateZ="20"
                      as="button"
                      className="px-4 py-2 rounded-xl bg-[#1E5ACD] text-white text-sm font-bold hover:bg-[#1848A3] transition-colors"
                    >
                      Ver perfil
                    </CardItem>
                  </div>
                </CardBody>
              </CardContainer>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="py-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 pt-8 gap-8 border-t border-gray-700">
          <div>
            <h3 className="text-lg font-bold mb-4">Sobre Fisio Find</h3>
            <p>
              Una plataforma innovadora diseñada para conectar pacientes con los mejores fisioterapeutas.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Enlaces Útiles</h3>
            <ul>
              <li>
                <a href="https://fisiofind.netlify.app" target="_blank" rel="noopener noreferrer">
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
                <a href="https://fisiofind.vercel.app">Documentación</a>
              </li>
              <li>
                <a href="/">Términos de Servicio</a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Contacto</h3>
            <p>Correo: support@fisiofind.com</p>
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
              Por favor, inicia sesión o crea una cuenta para ver el perfil del fisioterapeuta.
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
