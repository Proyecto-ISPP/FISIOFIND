"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { getApiBaseUrl } from "@/utils/api";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Physiotherapist {
  id: string;
  name: string;
  specializations: string;
  gender: string;
  rating: number;
  price: number;
  postalCode: string;
  image?: string;
}

const SearchPage = () => {
  const router = useRouter();
  const apiBaseurl = getApiBaseUrl();
  const scrollRef = useRef<HTMLDivElement>(null);

  const initialFilters = {
    specialization: "",
    schedule: "",
    maxPrice: "",
    postalCode: "",
    gender: "",
    name: "",
    plan: { name: "" },
  };

  const [specializations, setSpecializations] = useState<string[]>([]);
  const [filters, setFilters] = useState<typeof initialFilters>(initialFilters);
  const [results, setResults] = useState<Physiotherapist[]>([]);
  const [suggested, setSuggested] = useState<Physiotherapist[]>([]);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(3);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setCardsPerPage(1);
      } else if (window.innerWidth < 1024) {
        setCardsPerPage(2);
      } else {
        setCardsPerPage(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const response = await axios.get(`${apiBaseurl}/api/guest_session/specializations/`);
        if (response.status === 200 && response.data?.length) {
          setSpecializations(response.data);
        }
      } catch (error) {
        console.error("Error loading specializations:", error);
      }
    };

    fetchSpecializations();
  }, [apiBaseurl]);

  const displayResults = results.length > 0 ? results : suggested;

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const el = scrollRef.current;
      if (!el || displayResults.length <= cardsPerPage) return;

      const isTrackpad = Math.abs(e.deltaX) > Math.abs(e.deltaY); // movimiento horizontal
      const isMouseScrollWithShift = e.shiftKey && Math.abs(e.deltaY) > Math.abs(e.deltaX);

      if (isTrackpad || isMouseScrollWithShift) {
        e.preventDefault();

        // Controlar velocidad del scroll — solo mover si el desplazamiento es suficientemente grande
        const threshold = 30; // sensibilidad
        if (e.deltaX > threshold || (e.shiftKey && e.deltaY > threshold)) {
          nextSlide();
        } else if (e.deltaX < -threshold || (e.shiftKey && e.deltaY < -threshold)) {
          prevSlide();
        }
      }
    };

    const el = scrollRef.current;
    if (el) {
      el.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      if (el) {
        el.removeEventListener("wheel", handleWheel);
      }
    };
  }, [activeIndex, displayResults.length, cardsPerPage]);

  const clearField = (field: keyof typeof filters) => {
    setFilters((prev) => ({ ...prev, [field]: "" }));
  };

  const handleReset = () => {
    setFilters(initialFilters);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = async () => {
    setSearchAttempted(true);
    setIsLoading(true);
    try {
      const response = await axios.post(`${apiBaseurl}/api/guest_session/advanced-search/`, filters);
      if (response.status === 200) {
        const { exactMatches, suggestedMatches } = response.data;
        setResults(exactMatches);
        setSuggested(suggestedMatches);
        setActiveIndex(0);
      }
    } catch (error) {
      console.error("Error during search:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const maxIndex = Math.max(0, Math.ceil(displayResults.length / cardsPerPage) - 1);

  const calculateTranslateX = () => {
    if (displayResults.length <= cardsPerPage) return 0;

    const maxTranslate = (displayResults.length - cardsPerPage) * (100 / cardsPerPage);
    const translatePerStep = maxTranslate / maxIndex;
    const translate = Math.min(activeIndex * translatePerStep, maxTranslate);
    return translate + (isDragging ? dragOffset / 10 : 0);
  };

  const nextSlide = () => {
    setActiveIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setActiveIndex((prev) => Math.max(prev - 1, 0));
  };

  const goToSlide = (index: number) => {
    setActiveIndex(Math.min(Math.max(0, index), maxIndex));
  };

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    setDragStartX(clientX);
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const diff = clientX - dragStartX;
    setDragOffset(diff);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = 100;
    if (dragOffset > threshold) {
      prevSlide();
    } else if (dragOffset < -threshold) {
      nextSlide();
    }

    setDragOffset(0);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const roundedRating = Math.round(rating * 2) / 2;

    for (let i = 1; i <= 5; i++) {
      if (i <= roundedRating) {
        stars.push(<Star key={i} className="text-amber-400 fill-amber-400" size={16} />);
      } else if (i - 0.5 === roundedRating) {
        stars.push(<Star key={i} className="text-amber-400 fill-amber-400" size={16} />);
      } else {
        stars.push(<Star key={i} className="text-gray-300" size={16} />);
      }
    }

    return (
      <div className="flex items-center">
        {stars}
        <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen px-4 py-8 bg-[#F8FAFC]" style={{ backgroundColor: "rgb(238, 251, 250)" }}>
      <h1 className="text-4xl font-bold text-center text-[#334155] mb-6">
        Búsqueda avanzada de fisioterapeutas
      </h1>

      <section className="max-w-4xl mx-auto mb-8 bg-white shadow-md rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <select
            name="specialization"
            value={filters.specialization}
            onChange={handleInputChange}
            className="input w-full"
          >
            <option value="">Especialidad</option>
            {specializations.map((spec, i) => (
              <option key={i} value={spec}>{spec}</option>
            ))}
          </select>

          <select
            name="schedule"
            value={filters.schedule}
            onChange={handleInputChange}
            className="h-[42px] border border-gray-200 px-4 py-2 rounded-md w-full"
          >
            <option value="">Preferencia horaria</option>
            <option value="mañana">Mañana (06:00 - 14:00)</option>
            <option value="tarde">Tarde (14:00 - 20:00)</option>
            <option value="noche">Noche (20:00 - 23:00)</option>
          </select>

          <div className="flex items-center h-[42px] border border-gray-200 rounded-md px-2 w-full">
            <input
              name="maxPrice"
              type="number"
              min="0"
              placeholder="Precio máximo (€)"
              value={filters.maxPrice}
              onChange={handleInputChange}
              className="input w-full"
            />
            {filters.maxPrice && (
              <button onClick={() => clearField("maxPrice")} className="text-red-500 ml-2">
                🗑️
              </button>
            )}
          </div>

          <div className="flex items-center h-[42px] border border-gray-200 rounded-md px-2 w-full">
            <input
              name="postalCode"
              placeholder="Código Postal"
              value={filters.postalCode}
              onChange={handleInputChange}
              className="w-full px-2 outline-none h-full"
            />
            {filters.postalCode && (
              <button onClick={() => clearField("postalCode")} className="text-red-500 ml-2">
                🗑️
              </button>
            )}
          </div>

          <select
            name="gender"
            value={filters.gender}
            onChange={handleInputChange}
            className="h-[42px] border border-gray-200 px-4 py-2 rounded-md w-full"
          >
            <option value="">Género del profesional</option>
            <option value="male">Hombre</option>
            <option value="female">Mujer</option>
            <option value="indifferent">Me da igual</option>
          </select>

          <div className="flex items-center h-[42px] border border-gray-200 rounded-md px-2 w-full">
            <input
              name="name"
              placeholder="Nombre del fisioterapeuta"
              value={filters.name}
              onChange={handleInputChange}
              className="w-full px-2 outline-none h-full"
            />
            {filters.name && (
              <button onClick={() => clearField("name")} className="text-red-500 ml-2">
                🗑️
              </button>
            )}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex justify-end">
            <button
              onClick={handleSearch}
              className="bg-[#1E5ACD] hover:bg-[#5ab3a8] text-white font-bold py-2 px-8 rounded-full transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1 active:translate-y-0 duration-200 w-full md:w-auto"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Buscando...
                </div>
              ) : (
                "Buscar"
              )}
            </button>
          </div>

          <div className="flex justify-start">
            <button
              type="button"
              onClick={handleReset}
              className="relative w-[150px] h-[40px] cursor-pointer flex items-center border-2 border-[#dedede] bg-[#e53935] rounded-[10px] overflow-hidden transition-all duration-300 hover:bg-[#e53935] active:translate-x-[3px] active:translate-y-[3px] group"
            >
              <span className="button__text translate-x-[22px] text-[#FFFFFF] font-semibold transition-all duration-300 group-hover:text-transparent whitespace-nowrap">
                Restaurar
              </span>
              <span className="button__icon absolute translate-x-[115px] h-full w-[39px] bg-[#c62828] flex items-center justify-center transition-all duration-300 group-hover:w-[148px] group-hover:translate-x-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 512 512"
                  className="fill-[#FFFFFF]"
                >
                  <path
                    style={{
                      fill: "none",
                      stroke: "#fff",
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      strokeWidth: "32px",
                    }}
                    d="M112,112l20,320c.95,18.49,14.4,32,32,32H348c17.67,0,30.87-13.51,32-32l20-320"
                  />
                  <line
                    y2="112"
                    y1="112"
                    x2="432"
                    x1="80"
                    style={{
                      stroke: "#fff",
                      strokeLinecap: "round",
                      strokeMiterlimit: "10",
                      strokeWidth: "32px",
                    }}
                  />
                  <path
                    style={{
                      fill: "none",
                      stroke: "#fff",
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      strokeWidth: "32px",
                    }}
                    d="M192,112V72h0a23.93,23.93,0,0,1,24-24h80a23.93,23.93,0,0,1,24,24h0v40"
                  />
                  <line
                    y2="400"
                    y1="176"
                    x2="256"
                    x1="256"
                    style={{
                      fill: "none",
                      stroke: "#fff",
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      strokeWidth: "32px",
                    }}
                  />
                  <line
                    y2="400"
                    y1="176"
                    x2="192"
                    x1="184"
                    style={{
                      fill: "none",
                      stroke: "#fff",
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      strokeWidth: "32px",
                    }}
                  />
                  <line
                    y2="400"
                    y1="176"
                    x2="320"
                    x1="328"
                    style={{
                      fill: "none",
                      stroke: "#fff",
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      strokeWidth: "32px",
                    }}
                  />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Resultados */}
      {searchAttempted && (
        <section className="max-w-6xl mx-auto mb-12">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#4F46E5]"></div>
            </div>
          ) : (
            <>
              {results.length === 0 && suggested.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium text-gray-600">
                    No se encontraron resultados para tu búsqueda
                  </h3>
                  <p className="mt-2 text-gray-500">
                    Intenta con diferentes criterios de búsqueda
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-[#334155]">
                      {results.length > 0
                        ? `Resultados (${results.length})`
                        : `Sugerencias (${suggested.length})`}
                    </h2>
                  </div>

                  {results.length === 0 && suggested.length > 0 && (
                    <div className="text-center mb-6 bg-amber-50 border border-amber-200 p-3 rounded-lg">
                      <p className="text-amber-700">
                        No se encontraron resultados exactos para tu búsqueda. Te mostramos algunas sugerencias:
                      </p>
                    </div>
                  )}

                  {/* Contenedor principal con posición relativa para los botones de navegación */}
                  <div className="relative overflow-hidden rounded-2xl">
                    {/* Indicador de arrastre */}
                    {isDragging && (
                      <div className="absolute inset-0 z-10 bg-gradient-to-r from-indigo-500/20 via-transparent to-indigo-500/20 pointer-events-none" />
                    )}

                    {/* Degradados laterales */}
                    <div className="absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-[#F8FAFC] to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-[#F8FAFC] to-transparent z-10 pointer-events-none" />

                    {/* Botones de navegación */}
                    {displayResults.length > cardsPerPage && (
                      <>
                        <button
                          onClick={prevSlide}
                          disabled={activeIndex === 0}
                          className={`absolute left-2 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full shadow-lg backdrop-blur-sm ${activeIndex === 0
                            ? "bg-gray-200/70 text-gray-400 cursor-not-allowed"
                            : "bg-white/80 text-[#4F46E5] hover:bg-[#4F46E5] hover:text-white"
                            } transition-all focus:outline-none transform hover:scale-110`}
                          aria-label="Anterior"
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <button
                          onClick={nextSlide}
                          disabled={activeIndex >= maxIndex}
                          className={`absolute right-2 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full shadow-lg backdrop-blur-sm ${activeIndex >= maxIndex
                            ? "bg-gray-200/70 text-gray-400 cursor-not-allowed"
                            : "bg-white/80 text-[#4F46E5] hover:bg-[#4F46E5] hover:text-white"
                            } transition-all focus:outline-none transform hover:scale-110`}
                          aria-label="Siguiente"
                        >
                          <ChevronRight size={20} />
                        </button>
                      </>
                    )}

                    {/* Contenedor del carrusel */}
                    <div
                      className="pl-6 pr-0 overflow-hidden cursor-grab select-none"
                      ref={scrollRef}
                      onMouseDown={handleDragStart}
                      onMouseMove={handleDragMove}
                      onMouseUp={handleDragEnd}
                      onMouseLeave={handleDragEnd}
                      onTouchStart={handleDragStart}
                      onTouchMove={handleDragMove}
                      onTouchEnd={handleDragEnd}
                    >
                      <div
                        className="flex transition-transform duration-500 ease-[cubic-bezier(0.25, 0.1, 0.25, 1)] gap-6 pr-12"
                        style={{
                          transform: `translateX(-${calculateTranslateX()}%)`,
                        }}
                      >
                        <AnimatePresence>
                          {displayResults.map((physio, i) => (
                            <motion.div
                              key={physio.id || i}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ duration: 0.3, delay: i * 0.1 }}
                              className={`flex-shrink-0 p-4 ${displayResults.length === 1 ? "mx-auto" : ""
                                }`}
                              style={{
                                minWidth: `${100 / cardsPerPage}%`,
                                maxWidth: `${100 / cardsPerPage}%`,
                              }}
                            >
                              <CardContainer className="h-full">
                                <CardBody className="group bg-white rounded-xl shadow-xl border border-gray-100 hover:shadow-2xl hover:border-indigo-100 transition-all duration-300 overflow-hidden flex flex-col h-full">
                                  <div className="relative w-full aspect-[4/3] overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <Image
                                      src={
                                        physio.image ||
                                        "/static/fisioterapeuta_sample.webp"
                                      }
                                      alt={physio.name}
                                      fill
                                      className="object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    />
                                  </div>

                                  <div className="p-6 flex flex-col flex-grow">
                                    <CardItem
                                      translateZ="20"
                                      className="text-lg font-bold text-[#334155] group-hover:text-[#4F46E5] transition-colors"
                                    >
                                      {physio.name}
                                    </CardItem>

                                    <CardItem
                                      translateZ="30"
                                      className="text-xs text-gray-600 mt-1 line-clamp-1"
                                    >
                                      {physio.specializations}
                                    </CardItem>

                                    <CardItem translateZ="40" className="mt-3">
                                      {renderStars(physio.rating || 4.5)}
                                    </CardItem>

                                    <div className="flex justify-between items-center mt-auto pt-4">
                                      <CardItem
                                        translateZ="20"
                                        className="text-[#4F46E5] font-semibold"
                                      >
                                        {physio.price ? `${physio.price}€` : ""}
                                      </CardItem>

                                      <CardItem
                                        translateZ="20"
                                        className="text-xs text-gray-500"
                                      >
                                        {physio.postalCode
                                          ? `CP: ${physio.postalCode}`
                                          : ""}
                                      </CardItem>
                                    </div>

                                    <CardItem translateZ="50" className="mt-4 w-full">
                                      <button
                                        onClick={() =>
                                          router.push(
                                            `/appointments/create/${physio.id}`
                                          )
                                        }
                                        className="w-full py-3 bg-gradient-to-r from-[#65C2C9] to-[#65C2C9] hover:from-[#05918F] hover:to-[#05918F] text-white rounded-full font-medium shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                                      >
                                        Reservar cita
                                      </button>
                                    </CardItem>
                                  </div>
                                </CardBody>
                              </CardContainer>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>

                  {/* Pagination indicators improved */}
                  {displayResults.length > cardsPerPage && (
                    <div className="flex justify-center mt-8 space-x-2">
                      {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => goToSlide(idx)}
                          className={`h-2 rounded-full transition-all transform ${activeIndex === idx
                            ? "w-8 bg-[#4F46E5] scale-y-150"
                            : "w-2 bg-gray-300 hover:bg-gray-400 hover:scale-125"
                            }`}
                          aria-label={`Ir a página ${idx + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </section>
      )}
    </div>
  );
};

export default SearchPage;