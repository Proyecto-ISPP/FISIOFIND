"use client";

import React, { useState, useEffect, useRef } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getApiBaseUrl } from "@/utils/api"; // Make sure this path is correct
import axios from 'axios'; // Make sure axios is installed

// --- DemoWindow Component (No changes needed) ---
interface DemoWindowProps {
  youtubeVideoId: string;
  title: string;
  isModal?: boolean;
  onClick?: () => void;
  isThumbnail?: boolean; // Para los items del carrusel
}

function DemoWindow({ youtubeVideoId, title, isModal = false, onClick, isThumbnail = false }: DemoWindowProps) {
  const embedUrl = `https://www.youtube.com/embed/${youtubeVideoId}${isModal && !isThumbnail ? '?autoplay=1' : ''}`; // Use standard youtube.com embed URL
  const thumbnailUrl = `https://i.ytimg.com/vi/${youtubeVideoId}/mqdefault.jpg`; // Standard YouTube thumbnail URL

  if (isThumbnail) {
    return (
      <div
        className="w-full rounded overflow-hidden relative shadow cursor-pointer group"
        onClick={onClick}
        title={`Ver: ${title}`}
      >
        <img src={thumbnailUrl} alt={title} className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105" />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-300 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white opacity-0 group-hover:opacity-90 transition-opacity duration-300">
            <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
          </svg>
        </div>
        <p className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs p-1 truncate">{title}</p>
      </div>
    );
  }

  // Main window (modal or page)
  return (
    <div
      className={`${
        isModal ? 'w-full max-w-4xl' : 'w-full'
      } mx-auto rounded-xl overflow-hidden relative shadow-xl transition-transform duration-300 ${
        !isModal && !isThumbnail ? 'cursor-pointer bg-gray-100 hover:scale-105' : 'bg-gray-100'
      }`}
      onClick={!isModal && !isThumbnail ? onClick : undefined}
    >
      {/* Simulated top bar */}
      <div className="h-8 flex items-center px-4 bg-opacity-90" style={{ backgroundColor: '#E9E9E9' }}>
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
          <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
        </div>
      </div>

      {/* Video container */}
      <div className="aspect-video relative z-10">
        {youtubeVideoId ? (
          <iframe
            className={`w-full h-full absolute top-0 left-0 ${
              !isModal ? 'pointer-events-none' : ''
            }`}
            src={embedUrl}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen={isModal}
          ></iframe>
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            ID de video no válido.
          </div>
        )}
      </div>
    </div>
  );
}
// --- End DemoWindow Component ---


// --- VideoModal Component (No changes needed) ---
interface VideoModalProps {
    videoId: string;
    title: string;
    onClose: () => void;
    roleVideos: { id: string; title: string }[];
    onVideoSelect: (video: { id: string; title: string }) => void;
    currentRole: 'paciente' | 'fisio';
  }

  function VideoModal({ videoId, title, onClose, roleVideos, onVideoSelect, currentRole }: VideoModalProps) {
    const sliderRef = useRef<Slider>(null);
    const carouselVideos = roleVideos.filter(v => v.id !== videoId);

    const sliderSettings = {
        dots: false,
        infinite: carouselVideos.length > 4,
        speed: 5000,
        autoplay: true,
        autoplaySpeed: 0,
        cssEase: 'linear',
        slidesToShow: Math.min(4, carouselVideos.length),
        slidesToScroll: 1,
        pauseOnHover: true,
        arrows: false,
        variableWidth: true,
        responsive: [
         {
           breakpoint: 1024, // lg
           settings: {
             slidesToShow: Math.min(3, carouselVideos.length),
             infinite: carouselVideos.length > 3,
           }
         },
         {
           breakpoint: 768, // md
           settings: {
             slidesToShow: Math.min(2, carouselVideos.length),
             infinite: carouselVideos.length > 2,
             centerMode: carouselVideos.length > 1,
             centerPadding: '20px',
             variableWidth: carouselVideos.length <= 2 ? false : true,
           }
         },
         {
           breakpoint: 640, // sm
           settings: {
             slidesToShow: 1,
             infinite: carouselVideos.length > 1,
             centerMode: true,
             centerPadding: '30px',
             variableWidth: false,
           }
         }
       ]
     };

    const currentVideo = roleVideos.find(v => v.id === videoId);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 overflow-y-auto" onClick={onClose}>
        <div className="relative w-full max-w-6xl rounded-lg p-4 pt-12 sm:pt-4" onClick={(e) => e.stopPropagation()}>
          <button
           onClick={onClose}
           className="absolute top-2 right-2 sm:top-3 sm:right-3 text-black bg-white bg-opacity-70 rounded-full p-1 hover:bg-opacity-90 transition-all z-30"
           aria-label="Cerrar modal"
          >
           <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          {/* Main Video Player */}
           {currentVideo && (
               <DemoWindow
                 youtubeVideoId={currentVideo.id}
                 title={currentVideo.title}
                 isModal={true}
               />
           )}

          {/* Carousel Section */}
          {carouselVideos.length > 0 && (
           <div className="mt-6 p-4 rounded-lg">
             <h4 className="text-lg font-semibold text-gray-200 mb-3 px-1">Otros vídeos para {currentRole === 'paciente' ? 'Pacientes' : 'Fisioterapeutas'}:</h4>
              <Slider ref={sliderRef} {...sliderSettings}>
               {carouselVideos.map((video) => (
                 <div key={video.id} className="px-2 sm:px-3" style={{ width: 240 }}>
                   <DemoWindow
                     youtubeVideoId={video.id}
                     title={video.title}
                     isThumbnail={true}
                     onClick={() => onVideoSelect(video)}
                   />
                 </div>
               ))}
              </Slider>
           </div>
          )}
        </div>
      </div>
    );
  }
// --- End VideoModal Component ---


// --- Main HelpCenterPage Component (MODIFIED) ---
const HelpCenterPage = () => {
  // State for the role fetched from API
  const [userRole, setUserRole] = useState<string | null>(null);
  // State for loading status
  const [isLoadingRole, setIsLoadingRole] = useState<boolean>(true);
  // State for the manually selected role (used if no role from API) or the fetched role
  const [selectedRole, setSelectedRole] = useState<'patient' | 'fisio'>('patient');
  // State for modal video
  const [selectedVideo, setSelectedVideo] = useState<{ id: string; title: string } | null>(null);


  // --- Fetch User Role ---
  useEffect(() => {
    const checkUserRole = async (): Promise<void> => {
      setIsLoadingRole(true); // Start loading
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("No token found, user not authenticated");
          setUserRole(null); // Ensure userRole is null if no token
          setIsLoadingRole(false); // Stop loading
          return;
        }

        // console.log("Token found:", token.substring(0, 10) + "..."); // Optional: for debugging

        const response = await axios.get(
          `${getApiBaseUrl()}/api/app_user/check-role/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = response.data;
        if (data) {
          setUserRole(data.user_role);
          setSelectedRole(data.user_role); // *** Automatically set selectedRole based on fetched role ***
          console.log("User role found:", data.user_role);
        } else {
          console.log("No valid role ('paciente' or 'fisio') found in the response, showing role selection.");
          setUserRole(null); // Treat invalid/missing role as null
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        setUserRole(null); // Set role to null on error
      } finally {
          setIsLoadingRole(false); // Stop loading regardless of outcome
      }
    };

    checkUserRole();
  }, []); 


  // Function to download manual (No changes needed)
  const handleDownloadManual = () => {
    const pdfUrl = "/manuals/FisioFind_UserManual_v1.pdf";
    const pdfFile = "FisioFind_UserManual_v1.pdf";
    try {
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = pdfFile;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error al intentar descargar el manual:", error);
    }
  };

  // Video data (No changes needed)
  const videoData = {
    paciente: [
      { id: 'dQw4w9WgXcQ', title: 'Demostración General para Pacientes' },
      { id: 'd0eIS9UhSs4', title: 'Cómo Reservar Cita' },
      { id: 'CVNLy1jwJQw', title: 'Realizar Videoconsulta como Paciente' },
      { id: 'OhPLSPGAVZE', title: 'Gestionar Perfil de Paciente' },
      { id: 'PA24Cw2eMA4', title: 'Buscar Fisioterapeutas' },
      { id: 'LIQiTrk6UVA', title: 'Dejar una Reseña' },
    ],
    fisio: [
      { id: 'L_LUpnjgPso', title: 'Configurar Perfil Profesional' },
      { id: 'y6120QOlsfU', title: 'Gestionar Disponibilidad y Horarios' },
      { id: 'g7XOehIYrL8', title: 'Atender Videoconsulta como Fisio' },
      { id: '5YPO-qPmuoE', title: 'Gestionar Citas Recibidas' },
      { id: 'Zjo6gUHbL70', title: 'Revisar Historial de Pacientes' },
      { id: 'zy3CD3UUNv0', title: 'Entendiendo Pagos y Facturación' },
    ],
  };

  // Modal handlers (No changes needed)
  const handleOpenModal = (video: { id: string; title: string }) => {
     setSelectedVideo(video);
  };

  const handleCloseModal = () => {
     setSelectedVideo(null);
  };

  const handleModalVideoSelect = (video: { id: string; title: string }) => {
      setSelectedVideo(video);
  };

  // Manual content (No changes needed)
  const manualContent = {
    paciente: {
      welcome: "Bienvenido al manual de usuario para Pacientes de Fisio Find. Aquí encontrarás toda la información necesaria para encontrar fisioterapeutas, reservar citas y realizar tus videoconsultas.",
      explore: "Explora las diferentes secciones para familiarizarte con todas las funcionalidades diseñadas para ti:",
      topics: [
        "Registro e Inicio de Sesión como Paciente",
        "Búsqueda y Selección de Fisioterapeutas",
        "Cómo entender el Perfil Profesional de un fisio",
        "Proceso de Reserva y Gestión de tus Citas",
        "Cómo Realizar una Videoconsulta",
        "Sistema de Valoraciones y cómo dejar Reseñas",
        "Gestión de tu perfil y datos personales",
        "Resolución de Problemas Comunes para Pacientes",
      ]
    },
    fisio: {
      welcome: "Bienvenido al manual de usuario para Fisioterapeutas de Fisio Find. Esta guía te ayudará a configurar tu perfil, gestionar tu disponibilidad y atender a tus pacientes a través de la plataforma.",
      explore: "Explora las diferentes secciones para sacar el máximo provecho a las herramientas profesionales:",
      topics: [
        "Registro e Inicio de Sesión como Fisioterapeuta",
        "Configuración Óptima de tu Perfil Profesional",
        "Gestión de tu Calendario y Disponibilidad",
        "Cómo Gestionar las Citas Recibidas",
        "Cómo Atender una Videoconsulta",
        "Revisión del Historial Clínico de Pacientes",
        "Sistema de Pagos y Facturación",
        "Resolución de Problemas Comunes para Fisioterapeutas",
      ]
    }
  };

  // --- RENDER LOGIC ---

  // Loading state indicator (optional but recommended)
  if (isLoadingRole) {
      return (
          <div className="min-h-screen bg-[rgb(238, 251, 250)] flex items-center justify-center">
              <p className="text-xl text-[#05668D]">Cargando información de usuario...</p>
              {/* You can add a spinner here */}
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-[rgb(238, 251, 250)] py-12 sm:py-16 px-4 relative">
      <div className="max-w-screen-xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#05668D] mb-10 sm:mb-12 text-center">
          Centro de Ayuda
        </h1>

        {/* --- Conditional Role Selection --- */}
        {userRole === null && !isLoadingRole && ( // Show buttons only if role is null AND not loading
          <>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#05668D] mb-6 text-center">
              ¿Cuál es tu rol en la aplicación?
            </h2>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-10">
              <button
                onClick={() => setSelectedRole('patient')}
                className={`w-full sm:w-auto px-6 py-2 rounded-full font-medium transition-all duration-200 text-base sm:text-lg shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  selectedRole === 'patient'
                  ? 'bg-[#05668D] text-white scale-105 ring-[#05668D]'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 ring-transparent'
                }`}
              >
                Soy Paciente
              </button>
              <button
                onClick={() => setSelectedRole('fisio')}
                className={`w-full sm:w-auto px-6 py-2 rounded-full font-medium transition-all duration-200 text-base sm:text-lg shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  selectedRole === 'fisio'
                  ? 'bg-[#05668D] text-white scale-105 ring-[#05668D]'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 ring-transparent'
                }`}
              >
                Soy Fisioterapeuta
              </button>
            </div>
          </>
        )}
<section className="mb-12 bg-white p-6 sm:p-8 rounded-lg shadow-md max-w-screen-lg mx-auto">
  <h2 className="text-2xl sm:text-3xl font-bold text-[#253240] mb-5 sm:mb-6">
    Manual de Usuario para {selectedRole === 'patient' ? 'Pacientes' : 'Fisioterapeutas'}
  </h2>
  <p className="text-gray-700 mb-4 sm:mb-6 text-base sm:text-lg">
    {/* Use optional chaining ?. */}
    {manualContent[selectedRole === 'patient' ? 'paciente' : 'fisio']?.welcome}
  </p>
  <p className="text-gray-700 mb-6 sm:mb-8 text-sm sm:text-base">
    {/* Use optional chaining ?. */}
    {manualContent[selectedRole === 'patient' ? 'paciente' : 'fisio']?.explore}
  </p>
  {/* Also add optional chaining before mapping topics */}
  <ul className="list-disc list-inside space-y-2 mb-8 text-gray-700 text-sm sm:text-base">
    {manualContent[selectedRole === 'patient' ? 'paciente' : 'fisio']?.topics?.map((topic, index) => (
      <li key={index}>{topic}</li>
    ))}
  </ul>
  <div className="text-center">
    <button
      onClick={handleDownloadManual}
      className="inline-block bg-[#41B8D5] hover:bg-[#05AC9C] text-white px-6 py-3 sm:px-8 rounded-full font-medium transition-colors text-base sm:text-lg shadow hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#41B8D5]"
    >
      Descargar Manual Completo (PDF)
    </button>
  </div>
</section>

        {/* Video Tutorials Section */}
        <section className="mb-12">
        <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#253240] mb-6 text-center sm:text-left">
            Videotutoriales para {selectedRole === 'patient' ? 'Pacientes' : 'Fisioterapeutas'}
            </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 lg:gap-x-8 gap-y-8 lg:gap-y-10">
            {videoData[selectedRole === 'patient' ? 'paciente' : 'fisio'].map((video) => (
            <div key={video.id}>
                <div>
                <h3 className="text-base sm:text-lg font-semibold text-[#05668D] line-clamp-2 mb-2 h-10 sm:h-12">
                    {video.title}
                </h3>
                </div>
                <DemoWindow
                youtubeVideoId={video.id}
                title={video.title}
                onClick={() => handleOpenModal(video)}
                />
            </div>
            ))}
        </div>
        </section>

        {/* Modal Rendering (No changes needed) */}
        {selectedVideo && (
          <VideoModal
          videoId={selectedVideo.id}
          title={selectedVideo.title}
          onClose={handleCloseModal}
          roleVideos={videoData[selectedRole === 'patient' ? 'paciente' : 'fisio']}
          onVideoSelect={handleModalVideoSelect}
          currentRole={selectedRole === 'patient' ? 'paciente' : 'fisio'}
            />
        )}
      </div>
    </div>
  );
};

export default HelpCenterPage;