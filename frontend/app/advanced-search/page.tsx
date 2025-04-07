"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { getApiBaseUrl } from "@/utils/api";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GradientButton } from "@/components/ui/gradient-button";
import RestoreFilters from "@/components/ui/restore-filters";
import PhysiotherapistModal from "@/components/ui/PhysiotherapistModal";

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
  const [previewPhysio, setPreviewPhysio] = useState(-1); // Estado para el índice del fisioterapeuta en vista previa
  const [previewPhysioData, setPreviewPhysioData] = useState<Physiotherapist | null>(null); // Estado para los datos del fisioterapeuta en vista previa

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

  const maxIndex = Math.max(0, displayResults.length - 2);

  const calculateTranslateX = () => {
    if (displayResults.length <= cardsPerPage) return 0;

    const baseCardWidth = 100 / cardsPerPage;
    const adjustmentFactor = 0.05;

    const cardWidth = baseCardWidth * (1 + adjustmentFactor);

    const translate = activeIndex * cardWidth;

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
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-24"></div>
        {/* Header with decorative elements */}
        <div className="relative mb-12">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

          <h1 className="text-5xl font-extrabold text-center text-gray-800 mb-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-600">
              Búsqueda avanzada
            </span>
          </h1>
          <p className="text-center text-gray-500 text-lg max-w-2xl mx-auto">
            Encuentra al fisioterapeuta perfecto para tus necesidades específicas
          </p>
        </div>

        {/* Search Form Card */}
        <section className="max-w-4xl mx-auto mb-12 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="px-8 py-6 bg-gradient-to-r from-teal-500 to-blue-600">
            <h2 className="text-xl font-bold text-white flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Filtros de búsqueda
            </h2>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Specialization */}
              <div className="relative">
                <label className="block text-xs font-medium text-gray-700 mb-1 ml-1">Especialidad</label>
                <div className="relative">
                  <select
                    name="specialization"
                    value={filters.specialization}
                    onChange={handleInputChange}
                    className="w-full py-3 px-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 appearance-none"
                  >
                    <option value="">Todas las especialidades</option>
                    {specializations.map((spec, i) => (
                      <option key={i} value={spec}>{spec}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Schedule */}
              <div className="relative">
                <label className="block text-xs font-medium text-gray-700 mb-1 ml-1">Preferencia horaria</label>
                <div className="relative">
                  <select
                    name="schedule"
                    value={filters.schedule}
                    onChange={handleInputChange}
                    className="w-full py-3 px-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 appearance-none"
                  >
                    <option value="">Cualquier horario</option>
                    <option value="mañana">Mañana (06:00 - 14:00)</option>
                    <option value="tarde">Tarde (14:00 - 20:00)</option>
                    <option value="noche">Noche (20:00 - 23:00)</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="relative">
                <label className="block text-xs font-medium text-gray-700 mb-1 ml-1">Precio máximo (€)</label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-gray-400">€</div>
                  <input
                    name="maxPrice"
                    type="number"
                    min="0"
                    placeholder="Sin límite"
                    value={filters.maxPrice}
                    onChange={handleInputChange}
                    className="w-full py-3 pl-8 pr-10 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                  />
                  {filters.maxPrice && (
                    <button
                      onClick={() => clearField("maxPrice")}
                      className="absolute right-3 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Postal Code */}
              <div className="relative">
                <label className="block text-xs font-medium text-gray-700 mb-1 ml-1">Código Postal</label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    name="postalCode"
                    placeholder="Cualquier ubicación"
                    value={filters.postalCode}
                    onChange={handleInputChange}
                    className="w-full py-3 pl-10 pr-10 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                  />
                  {filters.postalCode && (
                    <button
                      onClick={() => clearField("postalCode")}
                      className="absolute right-3 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Gender */}
              <div className="relative">
                <label className="block text-xs font-medium text-gray-700 mb-1 ml-1">Género del profesional</label>
                <div className="relative">
                  <select
                    name="gender"
                    value={filters.gender}
                    onChange={handleInputChange}
                    className="w-full py-3 px-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 appearance-none"
                  >
                    <option value="">Cualquier género</option>
                    <option value="male">Hombre</option>
                    <option value="female">Mujer</option>
                    <option value="indifferent">Me da igual</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Name */}
              <div className="relative">
                <label className="block text-xs font-medium text-gray-700 mb-1 ml-1">Nombre del fisioterapeuta</label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    name="name"
                    placeholder="Buscar por nombre"
                    value={filters.name}
                    onChange={handleInputChange}
                    className="w-full py-3 pl-10 pr-10 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                  />
                  {filters.name && (
                    <button
                      onClick={() => clearField("name")}
                      className="absolute right-3 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex justify-center md:justify-end order-2 md:order-1">
                <RestoreFilters onClick={handleReset} />
              </div>

              <div className="flex justify-center md:justify-start order-1 md:order-2">
                <GradientButton
                  onClick={handleSearch}
                  disabled={isLoading}
                >
                  <span className="relative flex items-center gap-2">
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5"
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
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                        Buscar fisioterapeutas
                      </>
                    )}
                  </span>
                </GradientButton>
              </div>
            </div>
          </div>
        </section>

        {/* Results Section */}
        {searchAttempted && (
          <section className="max-w-6xl mx-auto mb-12">
            {isLoading ? (
              <div className="flex flex-col justify-center items-center h-64">
                <div className="w-16 h-16 relative">
                  <div className="absolute top-0 right-0 h-16 w-16 rounded-full border-4 border-t-teal-500 border-r-transparent border-b-blue-500 border-l-transparent animate-spin"></div>
                  <div className="absolute top-1 right-1 h-14 w-14 rounded-full border-4 border-t-transparent border-r-blue-400 border-b-transparent border-l-teal-400 animate-spin animation-delay-200"></div>
                </div>
                <p className="mt-4 text-gray-500 animate-pulse">Buscando los mejores profesionales...</p>
              </div>
            ) : (
              <>
                {results.length === 0 && suggested.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-2xl shadow-md">
                    <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-700 mb-2">
                      No se encontraron resultados
                    </h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      Prueba con diferentes criterios de búsqueda o elimina algunos filtros para ampliar los resultados
                    </p>
                    <div className="flex justify-center mt-6">
                      <RestoreFilters onClick={handleReset} />
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Results Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                      <div>
                        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-600">
                          {results.length > 0
                            ? `Resultados (${results.length})`
                            : `Sugerencias (${suggested.length})`}
                        </h2>
                        <p className="text-gray-500 mt-1">
                          Profesionales disponibles según tus preferencias
                        </p>
                      </div>
                    </div>

                    {results.length === 0 && suggested.length > 0 && (
                      <div className="mb-8 bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-amber-700">
                              No se encontraron resultados exactos para tu búsqueda. Te mostramos algunas sugerencias que podrían interesarte.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Carousel Container */}
                    <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg p-4 border border-gray-100">
                      {isDragging && (
                        <div className="absolute inset-0 z-10 bg-gradient-to-r from-teal-500/20 via-transparent to-blue-500/20 pointer-events-none" />
                      )}

                      <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                      <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

                      {displayResults.length > cardsPerPage && (
                        <>
                          <button
                            onClick={prevSlide}
                            disabled={activeIndex === 0}
                            className={`absolute left-4 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full shadow-lg ${activeIndex === 0
                              ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                              : "bg-white text-teal-500 hover:bg-gradient-to-r hover:from-teal-500 hover:to-blue-600 hover:text-white"
                              } transition-all duration-300 focus:outline-none transform hover:scale-110`}
                            aria-label="Anterior"
                          >
                            <ChevronLeft size={24} />
                          </button>
                          <button
                            onClick={nextSlide}
                            disabled={activeIndex >= maxIndex}
                            className={`absolute right-4 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full shadow-lg ${activeIndex >= maxIndex
                              ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                              : "bg-white text-teal-500 hover:bg-gradient-to-r hover:from-teal-500 hover:to-blue-600 hover:text-white"
                              } transition-all duration-300 focus:outline-none transform hover:scale-110`}
                            aria-label="Siguiente"
                          >
                            <ChevronRight size={24} />
                          </button>
                        </>
                      )}

                      <div
                        className="px-22 overflow-hidden cursor-grab select-none"
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
                          className="flex transition-transform duration-500 ease-[cubic-bezier(0.2, 0.1, 0.2, 1)] gap-8"
                          style={{
                            transform: `translateX(-${calculateTranslateX()}%)`,
                            paddingLeft: '4px',
                            paddingRight: `${100 - (100 / cardsPerPage)}%`
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
                                className={`flex-shrink-0 p-4 ${displayResults.length === 1 ? "mx-auto" : ""}`}
                                style={{
                                  width: `${100 / cardsPerPage}%`,
                                  paddingLeft: '185px',
                                  paddingRight: '185px',
                                  boxSizing: 'border-box'
                                }}
                              >
                                <CardContainer className="h-full">
                                  <CardBody className="group bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-2xl hover:border-indigo-100 transition-all duration-300 overflow-hidden flex flex-col h-full">
                                    <div className="relative w-full aspect-[4/3] overflow-hidden">
                                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                      <Image
                                        src={physio.image?.startsWith("http") ? physio.image : "/static/fisioterapeuta_sample.webp"}
                                        alt={physio.name}
                                        fill
                                        className="object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                      />
                                    </div>

                                    <div className="p-4 flex flex-col flex-grow">
                                      <CardItem
                                        translateZ="20"
                                        className="text-s font-bold text-[#334155] group-hover:text-[#4F46E5] transition-colors"
                                      >
                                        {physio.name}
                                      </CardItem>

                                      <CardItem
                                        translateZ="30"
                                        className="text-xs text-gray-600 mt-1 line-clamp-1"
                                      >
                                        {physio.specializations}
                                      </CardItem>

                                      <CardItem translateZ="40" className="mt-2">
                                        {renderStars(physio.rating || 4.5)}
                                      </CardItem>

                                      <CardItem
                                          translateZ="30"
                                          className="text-xs text-gray-600 mt-1 line-clamp-1"
                                        >
                                          {physio.postalCode
                                            ? `CP: ${physio.postalCode}`
                                            : ""}
                                        </CardItem>

                                      {/* Mostrar precio medio solo si no hay filtro de precio máximo */}
                                      {!filters.maxPrice.trim() && physio.price && (
                                        <div className="flex justify-between items-center mt-auto pt-3">
                                          <CardItem
                                            translateZ="20"
                                            className="text-sm text-gray-600"
                                          >
                                            Precio medio: <span className="font-semibold text-[#4F46E5]">{physio.price}€</span>
                                          </CardItem>
                                        </div>
                                      )}

                                      <CardItem translateZ="50" className="mt-3 w-full">
                                        <button
                                          onClick={() => {
                                            setPreviewPhysioData(physio);
                                            setPreviewPhysio(i);
                                          }}
                                          className="w-full py-2 bg-gradient-to-r from-[#65C2C9] to-[#65C2C9] hover:from-[#05918F] hover:to-[#05918F] text-white rounded-full font-medium shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
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
      <PhysiotherapistModal
        physio={previewPhysioData}
        isOpen={previewPhysio !== -1}
        onClose={() => {
          setPreviewPhysio(-1);
          setPreviewPhysioData(null);
        }}
        renderStars={renderStars} // Pasamos la función renderStars como prop
      />
    </div>
  );
};

export default SearchPage;