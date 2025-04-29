"use client";

import React, { useState, useEffect, useRef } from 'react';
import Slider from 'react-slick';

// Asegúrate de tener estos CSS importados en tu proyecto globalmente o aquí
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// --- DemoWindow Component (Sin cambios recientes) ---
interface DemoWindowProps {
  youtubeVideoId: string;
  title: string;
  isModal?: boolean;
  onClick?: () => void;
  isThumbnail?: boolean; // Para los items del carrusel
}

function DemoWindow({ youtubeVideoId, title, isModal = false, onClick, isThumbnail = false }: DemoWindowProps) {
  const embedUrl = `https://www.youtube.com/embed/${youtubeVideoId}${isModal && !isThumbnail ? '?autoplay=1' : ''}`;
  const thumbnailUrl = `https://img.youtube.com/vi/${youtubeVideoId}/mqdefault.jpg`; // Miniatura de calidad media

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

  // Ventana de demostración principal (dentro del modal o en la página)
  return (
    <div
      className={`${
        isModal ? 'w-full max-w-4xl' : 'w-full' // El tamaño del iframe se limita aquí si es necesario
      } mx-auto rounded-xl overflow-hidden relative shadow-xl transition-transform duration-300 ${
        !isModal && !isThumbnail ? 'cursor-pointer bg-gray-100 hover:scale-105' : 'bg-gray-100'
      }`}
      onClick={!isModal && !isThumbnail ? onClick : undefined}
    >
      {/* Barra superior simulada */}
      <div className="h-8 flex items-center px-4 bg-opacity-90" style={{ backgroundColor: '#E9E9E9' }}>
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
          <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
        </div>
      </div>

      {/* Contenedor del vídeo */}
      <div className="aspect-video relative z-10">
        {youtubeVideoId ? (
          <iframe
            className={`w-full h-full absolute top-0 left-0 ${
              !isModal ? 'pointer-events-none' : '' // Deshabilitar clics si no es modal
            }`}
            src={embedUrl}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen={isModal} // Permitir pantalla completa solo en el modal
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
// --- Fin DemoWindow Component ---


interface VideoModalProps {
  videoId: string;
  title: string;
  onClose: () => void;
  roleVideos: { id: string; title: string }[];
  onVideoSelect: (video: { id: string; title: string }) => void;
  currentRole: 'paciente' | 'fisio';
}

// --- VideoModal Component (Con modificaciones solicitadas) ---
function VideoModal({ videoId, title, onClose, roleVideos, onVideoSelect, currentRole }: VideoModalProps) {

    const sliderRef = useRef<Slider>(null);
    const carouselVideos = roleVideos.filter(v => v.id !== videoId);

    const sliderSettings = {
      dots: false,
      infinite: carouselVideos.length > 4,
      speed: 5000, // Velocidad del autoplay continuo
      autoplay: true,
      autoplaySpeed: 0, // Necesario para cssEase: linear
      cssEase: 'linear', // Movimiento continuo
      slidesToShow: Math.min(4, carouselVideos.length), // Mostrar hasta 4 slides
      slidesToScroll: 1, // Mover 1 a la vez
      pauseOnHover: true,
      arrows: false,
      variableWidth: true,
      responsive: [
       {
         breakpoint: 1024, // lg
         settings: {
           slidesToShow: Math.min(3, carouselVideos.length), // 3 en pantallas grandes
           infinite: carouselVideos.length > 3, // Ajustar infinite
         }
       },
       {
         breakpoint: 768, // md
         settings: {
           slidesToShow: Math.min(2, carouselVideos.length), // 2 en medianas
           infinite: carouselVideos.length > 2, // Ajustar infinite
           centerMode: carouselVideos.length > 1, // Activar centerMode si hay más de 1
           centerPadding: '20px', // Padding para centerMode
           variableWidth: carouselVideos.length <= 2 ? false : true, // Desactivar si solo caben 1 o 2
         }
       },
       {
         breakpoint: 640, // sm (ajuste para móviles pequeños)
         settings: {
           slidesToShow: 1, // Mostrar 1 slide principal
           infinite: carouselVideos.length > 1, // Ajustar infinite
           centerMode: true, // Mantener centerMode para ver los adyacentes
           centerPadding: '30px', // Aumentar padding para mejor visualización
           variableWidth: false, // Desactivar ancho variable para simplificar
         }
       }
       // No se necesita breakpoint 480 explícito si 640 ya cubre móviles
      ]
    };

    const currentVideo = roleVideos.find(v => v.id === videoId);

  return (
    // Fondo del modal
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 overflow-y-auto" onClick={onClose}>
      {/* Contenedor del contenido del modal */}
      <div className="relative w-full max-w-6xl rounded-lg p-4 pt-12 sm:pt-4" onClick={(e) => e.stopPropagation()}>
        {/* Botón de cerrar */}
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

        {/* Carousel Section (Fondo transparente, bordes redondeados) */}
        {carouselVideos.length > 0 && (
          // MODIFICADO: Se quita bg-gray-900 para fondo transparente. Se mantiene rounded-lg.
          // Se añade un borde opcional si se desea más visibilidad (ej: border border-gray-600)
          <div className="mt-6 p-4 rounded-lg">
            {/* Título del carrusel (Ajustar color si es necesario para contraste con el fondo del modal) */}
            <h4 className="text-lg font-semibold text-gray-200 mb-3 px-1">Otros vídeos para {currentRole === 'paciente' ? 'Pacientes' : 'Fisioterapeutas'}:</h4>
             <Slider ref={sliderRef} {...sliderSettings}>
               {carouselVideos.map((video) => (
                 // Contenedor de cada item del carrusel
                 <div key={video.id} className="px-2 sm:px-3" style={{ width: 240 }}> {/* Ajustar width según sea necesario */}
                     <DemoWindow
                       youtubeVideoId={video.id}
                       title={video.title}
                       isThumbnail={true} // Indicar que es una miniatura
                       onClick={() => onVideoSelect(video)} // Permitir seleccionar este vídeo
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
// --- Fin VideoModal Component ---


// --- Componente Principal HelpCenterPage (Sin cambios aquí) ---
const HelpCenterPage = () => {
  const [selectedRole, setSelectedRole] = useState<'paciente' | 'fisio'>('paciente');
  const [selectedVideo, setSelectedVideo] = useState<{ id: string; title: string } | null>(null);

  // Función para descargar el manual
  const handleDownloadManual = () => {
    const pdfUrl = "/manuals/FisioFind_UserManual_v1.pdf"; // Asegúrate que esta ruta es correcta
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
      // Aquí podrías mostrar un mensaje al usuario
    }
  };

  // Datos de los vídeos (asegúrate que los IDs son correctos y únicos donde necesites)
  const videoData = {
    paciente: [
      { id: 'dQw4w9WgXcQ', title: 'Paciente: Demostración General' }, // Ejemplo Rick Astley
      { id: 'd0eIS9UhSs4', title: 'Paciente: Cómo Reservar Cita' },
      { id: 'pCaqG-oPJ-I', title: 'Paciente: Realizar Videoconsulta' },
      { id: 'OhPLSPGAVZE', title: 'Paciente: Gestionar Perfil' },
      { id: 'PA24Cw2eMA4', title: 'Paciente: Buscar Fisioterapeutas' },
      { id: 'LIQiTrk6UVA', title: 'Paciente: Dejar una Reseña' },
    ],
    fisio: [
      { id: 'L_LUpnjgPso', title: 'Fisio: Configurar Perfil Profesional' },
      { id: 'y6120QOlsfU', title: 'Fisio: Gestionar Disponibilidad' }, // ID Ejemplo diferente
      { id: 'g7XOehIYrL8', title: 'Fisio: Atender Videoconsulta' },
      { id: '5YPO-qPmuoE', title: 'Fisio: Gestionar Citas Recibidas' },
      { id: 'Zjo6gUHbL70', title: 'Fisio: Revisar Historial de Pacientes' },
      { id: 'zy3CD3UUNv0', title: 'Fisio: Entendiendo Pagos y Facturación' },
    ],
  };

  // Abrir el modal con el vídeo seleccionado
  const handleOpenModal = (video: { id: string; title: string }) => {
     setSelectedVideo(video);
  };

  // Cerrar el modal
  const handleCloseModal = () => {
     setSelectedVideo(null);
  };

  // Cambiar el vídeo dentro del modal cuando se selecciona uno del carrusel
  const handleModalVideoSelect = (video: { id: string; title: string }) => {
       setSelectedVideo(video);
  };

  return (
    <div className="min-h-screen bg-[rgb(238, 251, 250)] py-12 sm:py-16 px-4 relative">
      {/* Contenedor principal de la página */}
      <div className="max-w-screen-xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#05668D] mb-10 sm:mb-12 text-center">
          Centro de Ayuda
        </h1>

        {/* Sección Manual de Usuario */}
        <section className="mb-12 bg-white p-6 sm:p-8 rounded-lg shadow-md max-w-screen-lg mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#253240] mb-5 sm:mb-6">Manual de Usuario</h2>
          <p className="text-gray-700 mb-4 sm:mb-6 text-base sm:text-lg">
            Bienvenido al manual de usuario de Fisio Find. Aquí encontrarás toda la información necesaria para sacar el máximo provecho de nuestra plataforma, tanto si eres paciente como fisioterapeuta.
          </p>
          <p className="text-gray-700 mb-6 sm:mb-8 text-sm sm:text-base">
            Explora las diferentes secciones para familiarizarte con todas las funcionalidades, desde el registro inicial hasta la gestión avanzada de tu cuenta y citas.
          </p>
           <ul className="list-disc list-inside space-y-2 mb-8 text-gray-700 text-sm sm:text-base">
             <li>Registro e Inicio de Sesión</li>
             <li>Búsqueda y Selección de Fisioterapeutas (para pacientes)</li>
             <li>Configuración del Perfil Profesional (para fisios)</li>
             <li>Proceso de Reserva y Gestión de Citas</li>
             <li>Realización y Recepción de Videoconsultas</li>
             <li>Sistema de Valoraciones y Reseñas</li>
             <li>Pagos y Facturación (para fisios)</li>
             <li>Resolución de Problemas Comunes</li>
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

        {/* Sección Videotutoriales */}
        <section className="mb-12">
          {/* Contenedor de selección de rol */}
          <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md mb-8 max-w-screen-lg mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#253240] mb-4 text-center sm:text-left">Videotutoriales</h2>
            <p className="text-gray-700 text-base sm:text-lg mb-6 text-center sm:text-left">
              Selecciona tu rol para ver los videos relevantes. Estas guías visuales te ayudarán a navegar por la plataforma fácilmente.
            </p>
            {/* Botones de selección de rol */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-4 sm:mb-8">
              <button
                onClick={() => setSelectedRole('paciente')}
                className={`w-full sm:w-auto px-6 py-2 rounded-full font-medium transition-all duration-200 text-base sm:text-lg shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  selectedRole === 'paciente'
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
          </div>

          {/* Grid de vídeos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 lg:gap-x-8 gap-y-8 lg:gap-y-10">
            {videoData[selectedRole].map((video) => (
              <div key={video.id}>
                 {/* Título del vídeo */}
                 <div>
                   <h3 className="text-base sm:text-lg font-semibold text-[#05668D] line-clamp-2 mb-2 h-10 sm:h-12"> {/* Altura fija para alinear */}
                     {video.title}
                   </h3>
                 </div>
                 {/* Componente DemoWindow para mostrar la miniatura clickeable */}
                <DemoWindow
                  youtubeVideoId={video.id}
                  title={video.title}
                  onClick={() => handleOpenModal(video)} // Abre el modal al hacer clic
                />
              </div>
            ))}
          </div>
        </section>

        {/* Renderizar el Modal si hay un vídeo seleccionado */}
        {selectedVideo && (
          <VideoModal
            videoId={selectedVideo.id}
            title={selectedVideo.title}
            onClose={handleCloseModal}
            roleVideos={videoData[selectedRole]} // Pasa la lista completa del rol actual
            onVideoSelect={handleModalVideoSelect} // Función para cambiar video desde el carrusel
            currentRole={selectedRole} // Pasa el rol actual para el título del carrusel
          />
        )}
      </div> {/* Fin max-w-screen-xl */}
    </div> // Fin contenedor principal de la página
  );
};

export default HelpCenterPage; // Exportar el componente