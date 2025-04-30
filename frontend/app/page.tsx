"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAppointment } from "@/context/appointmentContext";
import { CookieConsent } from "@/components/CookieConsent";
import TopRatings from "@/components/ratings";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";
import { GradientButton } from "@/components/ui/gradient-button";
import { PhysioCallToAction } from "@/components/ui/physio-cta";
import { DemoWindow } from "@/components/demo-window";


const Home = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [draftData, setDraftData] = useState<any>(null);
  const { dispatch } = useAppointment();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
      setIsAuthenticated(!!storedToken);
    }
  }, [isClient]);


  useEffect(() => {
    const storedDraft = sessionStorage.getItem("appointmentDraft");
    if (storedDraft) {
      const parsedDraft = JSON.parse(storedDraft);
      setDraftData(parsedDraft);
      setShowDraftModal(true);
    }
  }, []);

  const handleResumeDraft = useCallback(() => {
    if (draftData) {
      dispatch({ type: "LOAD_DRAFT", payload: draftData.appointmentData });
      setShowDraftModal(false);

      if (draftData.returnUrl) {
        router.push(draftData.returnUrl);
      }
    }
  }, [draftData, dispatch, router]);

  const handleDiscardDraft = useCallback(() => {
    sessionStorage.removeItem("appointmentDraft");
    dispatch({ type: "DESELECT_SERVICE" });
    setShowDraftModal(false);
  }, [dispatch]);

  return (
    <div
      className="min-h-screen w-full z=90"
      style={{ backgroundColor: "rgb(238, 251, 250)" }}
    >
      <CookieConsent />

      {!isAuthenticated && (
        <header className="bg-[rgb(238, 251, 250)] shadow-md py-4">
          <div className="max-w-screen-xl mx-auto px-4 flex justify-end items-center">
            <div className="flex items-center space-x-3 md:space-x-3">
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
                  online donde te conectamos con el
                  <Highlight className="from-[#41B8D5] to-[#1E5ACD] dark:from-[#41B8D5] dark:to-[#1E5ACD]">
                    profesional
                  </Highlight>
                  que mejor se ajusta a tus necesidades.
                </p>
              </HeroHighlight>
              <br></br>
              <GradientButton
                onClick={() => router.push("/advanced-search")}
                className="mt-6 border-none text-white font-inherit text-[17px] py-[0.6em] px-[1.5em] rounded-[20px] bg-gradient-to-r from-[#0400ff] to-[#4ce3f7] bg-[length:100%_auto] hover:bg-[length:200%_auto] hover:bg-right-center flex items-center justify-center animate-[pulse512_1.5s_infinite]"
              >
                <span>Encuentra a tu fisioterapeuta ideal  </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </GradientButton>
            </div>

            <div className="relative hidden md:block">
              {/* Floating images around the logo */}
              <div className="absolute top-0 left-0 w-full h-full hidden lg:block">
                <div
                  className="floating-image"
                  style={{ right: "50%", top: "55%" }}
                >
                  <Image
                    src="/static/9_girl.webp"
                    alt="Floating Image 3"
                    width={400}
                    height={400}
                    loading="lazy"
                  />
                </div>
                <div
                  className="floating-image"
                  style={{ left: "10%", top: "-5%" }}
                >
                  <Image
                    src="/static/1_heart.webp"
                    alt="Floating Image 1"
                    width={150}
                    height={150}
                    loading="lazy"
                  />
                </div>
                <div
                  className="floating-image"
                  style={{ right: "0%", top: "-15%" }}
                >
                  <Image
                    src="/static/7_treatment.webp"
                    alt="Floating Image 3"
                    width={180}
                    height={180}
                    loading="lazy"
                  />
                </div>
                <div
                  className="floating-image"
                  style={{ right: "-20%", top: "30%" }}
                >
                  <Image
                    src="/static/2_liftweights.webp"
                    alt="Floating Image 3"
                    width={300}
                    height={300}
                    loading="lazy"
                  />
                </div>
              </div>

              <Image
                src="/static/fisio_find_logo_white.webp"
                alt="Hero Image"
                width={500}
                height={400}
                className="filter blur-[2px]"
                loading="lazy"
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
            className="block w-full h-[120px]"
          >
            <path d="M0,32L80,48C160,64,320,96,480,96C640,96,800,64,960,48C1120,32,1280,32,1360,32L1440,32L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* How it works Section */}
      <section className="pt-16 pb-16 bg-[rgb(238, 251, 250)] relative -mt-1">
        {" "}
        <div className="max-w-screen-xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-[#253240] mb-12 text-center">
            ¿Cómo funciona Fisio Find?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl hover:shadow-lg transition-all">
              <div className="bg-[#f0f9fa] rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-[#05AC9C]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#253240] mb-4">
                Encuentra a tu fisioterapeuta
              </h3>
              <p className="text-gray-600">
                Podrás comparar entre diferentes profesionales y escoger el que
                mejor se adapte a tus necesidades.
              </p>
            </div>

            <div className="text-center p-6 rounded-xl hover:shadow-lg transition-all">
              <div className="bg-[#f0f9fa] rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-[#05AC9C]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#253240] mb-4">
                Contacta y reserva tu sesión
              </h3>
              <p className="text-gray-600">
                Selecciona el día y la hora en la agenda de tu fisio de forma
                rápida y segura.
              </p>
            </div>

            <div className="text-center p-6 rounded-xl hover:shadow-lg transition-all">
              <div className="bg-[#f0f9fa] rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-[#05AC9C]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#253240] mb-4">
                Videoconsulta Especializada
              </h3>
              <p className="text-gray-600">
                Consultas online con herramientas específicas de diagnóstico y
                seguimiento personalizado.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Video */}
      <section className="px-4 py-16 relative z-10">
        <DemoWindow />
      </section>

      {/* Authentication Section */}
      {!isAuthenticated && (
        <section className="py-16 bg-[rgb(238, 251, 250)]">
          <div className="max-w-screen-xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-[#253240] mb-12 text-center">
              Únete a Fisio Find
            </h2>

            <div className="max-w-md mx-auto">
              <div className="mb-6">
                <GradientButton
                  onClick={() => router.push("/register")}
                  className="w-full py-4 text-lg"
                >
                  Crea una cuenta
                </GradientButton>
              </div>

              <p className="text-center text-gray-600 mb-6">
                Si ya tienes una cuenta...
              </p>

              <div className="mb-6">
                <GradientButton
                  variant="edit"
                  onClick={() => router.push("/login")}
                  className="w-full py-4 text-lg"
                >
                  Inicia sesión
                </GradientButton>
              </div>

              <PhysioCallToAction />


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
      <footer className="bg-gradient-to-br from-[#05668D] to-[#6BC9BE] text-white py-16 relative">
        <div className="absolute top-0 left-0 right-0 transform rotate-180">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 120"
            fill="rgb(238, 251, 250)"
            preserveAspectRatio="none"
            className="block w-full h-[120px]"
          >
            <path d="M0,32L80,48C160,64,320,96,480,96C640,96,800,64,960,48C1120,32,1280,32,1360,32L1440,32L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>

        <div className="container mx-auto px-6 pt-8 relative z-10">
          <div className="flex justify-center mb-8">
            <div className="flex items-center">
              <Image
                src="/static/fisio_find_logo_white.webp"
                alt="Fisio Find Logo"
                width={60}
                height={60}
                className="mr-3"
              />
              <span className="text-2xl font-bold">Fisio Find</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-10 max-w-6xl mx-auto">

          <div className="flex flex-col items-center">
            <h3 className="text-xl font-bold mb-4 relative">
              <span className="relative z-10">Sobre Fisio Find</span>
              <span className="absolute left-1/2 -translate-x-1/2 bottom-0 w-12 h-1 bg-[#41B8D5] rounded-full"></span>
            </h3>
            <p className="text-center max-w-xs mx-auto ml-4">
              Una plataforma innovadora diseñada para conectar pacientes con los
              mejores fisioterapeutas especializados en todo España.
            </p>
            <div className="flex space-x-4 mt-6">
              <a
                href="https://www.linkedin.com/company/fisiofindapp/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-full transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/fisiofindapp"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-full transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://www.youtube.com/@fisiofindapp"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-full transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <h3 className="text-xl font-bold mb-4 relative">
              <span className="relative z-10">Enlaces Útiles</span>
              <span className="absolute left-1/2 -translate-x-1/2 bottom-0 w-12 h-1 bg-[#41B8D5] rounded-full"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://fisiofind-landing-page.netlify.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#41B8D5] transition-colors flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Conoce Fisio Find
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/Proyecto-ISPP/FISIOFIND"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#41B8D5] transition-colors flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Repositorio GitHub
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  className="hover:text-[#41B8D5] transition-colors flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Política de Privacidad
                </a>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-[#41B8D5] transition-colors flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Términos de Servicio
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col items-center">
            <h3 className="text-xl font-bold mb-4 relative">
              <span className="relative z-10">Contacto</span>
              <span className="absolute left-1/2 -translate-x-1/2 bottom-0 w-12 h-1 bg-[#41B8D5] rounded-full"></span>
            </h3>
            <div className="space-y-3">
              <p className="flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-3 text-[#41B8D5]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <a href="mailto:info@fisiofind.com" className="hover:underline">
                  info@fisiofind.com
                </a>
              </p>
              <p className="flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-3 text-[#41B8D5]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <a
                  href="mailto:denuncias@fisiofind.com"
                  className="hover:underline"
                >
                  denuncias@fisiofind.com
                </a>
              </p>
              <p className="flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-3 text-[#41B8D5]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Sevilla, España
              </p>
            </div>
          </div>
        </div>

        <div className="text-center pt-8">
          <div className="flex flex-wrap justify-center gap">
            <p>© 2025 Fisio Find. Bajo licencia MIT</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function Main() {
  return <Home />;
}
