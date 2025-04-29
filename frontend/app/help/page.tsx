"use client";

import React, { useState } from 'react';

// --- Componente DemoWindow Modificado ---
interface DemoWindowProps {
  youtubeVideoId: string;
  title: string;
  isModal?: boolean;
  onClick?: () => void;
}

function DemoWindow({ youtubeVideoId, title, isModal = false, onClick }: DemoWindowProps) {
  // URL de YouTube corregida y autoplay solo en modal
  const embedUrl = `https://www.youtube.com/embed/${youtubeVideoId}${isModal ? '?autoplay=1' : ''}`;

  return (
    <div
      className={`${
        isModal ? 'w-full max-w-4xl' : 'w-full'
      } mx-auto rounded-xl overflow-hidden relative shadow-xl transition-transform duration-300 ${
        !isModal ? 'cursor-pointer bg-gray-100 hover:scale-105' : 'bg-gray-100'
      }`}
      // El onClick sigue en el div principal
      onClick={!isModal ? onClick : undefined}
    >
      {/* Barra superior con botones decorativos */}
      <div className="h-8 flex items-center px-4 bg-opacity-90" style={{ backgroundColor: '#E9E9E9' }}>
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
          <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
        </div>
      </div>

      {/* Contenedor del video */}
      <div className="aspect-video relative z-10">
        {youtubeVideoId ? (
          <iframe
            // Clase condicional: pointer-events-none cuando NO es modal
            className={`w-full h-full absolute top-0 left-0 ${
              !isModal ? 'pointer-events-none' : ''  // <-- LA CLAVE ESTÁ AQUÍ
            }`}
            src={embedUrl}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen={isModal} // Permitir pantalla completa solo en el modal tiene más sentido
          ></iframe>
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            ID de video no válido.
          </div>
        )}
         {/* Opcional: Si quieres asegurarte al 100% en todos los navegadores,
             puedes añadir una capa transparente encima SOLO cuando no es modal.
         {!isModal && (
           <div className="absolute inset-0 w-full h-full z-20 cursor-pointer"></div>
         )}
         */}
      </div>
    </div>
  );
}

// --- Componente VideoModal (Con mejoras menores) ---
function VideoModal({ videoId, title, onClose }: { videoId: string; title: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"> {/* Añadido padding */}
      <div className="relative w-full max-w-4xl">
        <button
          onClick={onClose}
          // Posicionamiento mejorado del botón de cierre
          className="absolute -top-2 -right-2 sm:top-0 sm:-right-10 text-white bg-black bg-opacity-50 rounded-full p-1 hover:bg-opacity-75 transition-all z-10"
          aria-label="Cerrar modal"
        >
          <svg
             className="w-6 h-6 sm:w-8 sm:h-8" // Tamaño ajustado
             fill="none"
             stroke="currentColor"
             viewBox="0 0 24 24"
             xmlns="http://www.w3.org/2000/svg"
           >
            {/* Icono de X para cerrar */}
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        {/* El modal SÍ debe ser interactivo, por eso pasamos isModal={true} */}
        <DemoWindow youtubeVideoId={videoId} title={title} isModal={true} />
      </div>
    </div>
  );
}


// --- Componente HelpCenterPage (Completo y con ajustes) ---
const HelpCenterPage = () => {
  // El estado showManualModal no parecía usarse, si lo necesitas para algo, mantenlo.
  // const [showManualModal, setShowManualModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'paciente' | 'fisio'>('paciente'); // Nombre del setter corregido
  const [selectedVideo, setSelectedVideo] = useState<{ id: string; title: string } | null>(null);

  const handleDownloadManual = () => {
    // Lógica de descarga (sin cambios)
    const pdfUrl = "/manuals/FisioFind_UserManual_v1.pdf"; // Asegúrate que esta ruta es correcta en tu proyecto
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
        // Aquí podrías mostrar un mensaje de error al usuario
    }
    // setShowManualModal(false); // Si usaras el estado showManualModal
  };

  // Datos de ejemplo para los videos
  const videoData = {
    paciente: [
      { id: 'dQw4w9WgXcQ', title: 'Paciente: Demostración General' }, // Ejemplo clásico
      { id: 'd0eIS9UhSs4', title: 'Paciente: Cómo Reservar Cita' },
      { id: 'pCaqG-oPJ-I', title: 'Paciente: Realizar Videoconsulta' },
      { id: 'OhPLSPGAVZE', title: 'Paciente: Gestionar Perfil' },
      { id: 'PA24Cw2eMA4', title: 'Paciente: Buscar Fisioterapeutas' },
      { id: 'LIQiTrk6UVA', title: 'Paciente: Dejar una Reseña' },
    ],
    fisio: [
      { id: 'L_LUpnjgPso', title: 'Fisio: Configurar Perfil Profesional' },
      { id: 'dQw4w9WgXcQ', title: 'Fisio: Gestionar Disponibilidad' }, // Puedes usar IDs diferentes
      { id: 'g7XOehIYrL8', title: 'Fisio: Atender Videoconsulta' },
      { id: '5YPO-qPmuoE', title: 'Fisio: Gestionar Citas Recibidas' },
      { id: 'Zjo6gUHbL70', title: 'Fisio: Revisar Historial de Pacientes' },
      { id: 'zy3CD3UUNv0', title: 'Fisio: Entendiendo Pagos y Facturación' },
    ],
  };

  return (
    // Contenedor principal de la página
    <div className="min-h-screen bg-[rgb(238, 251, 250)] py-12 sm:py-16 px-4 relative">
      <div className="max-w-screen-xl mx-auto">
        {/* Título principal */}
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
            {/* Botón de Descarga */}
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
          {/* Contenedor para título y botones de rol */}
          <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md mb-8 max-w-screen-lg mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#253240] mb-4 text-center sm:text-left">Videotutoriales</h2>
            <p className="text-gray-700 text-base sm:text-lg mb-6 text-center sm:text-left">
              Selecciona tu rol para ver los videos relevantes. Estas guías visuales te ayudarán a navegar por la plataforma fácilmente.
            </p>
            {/* Botones para seleccionar rol */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-4 sm:mb-8">
              <button
                onClick={() => setSelectedRole('paciente')}
                className={`w-full sm:w-auto px-6 py-2 rounded-full font-medium transition-all duration-200 text-base sm:text-lg shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  selectedRole === 'paciente'
                    ? 'bg-[#05668D] text-white scale-105 ring-[#05668D]' // Efecto de selección
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 ring-transparent'
                }`}
              >
                Soy Paciente
              </button>
              <button
                onClick={() => setSelectedRole('fisio')}
                 className={`w-full sm:w-auto px-6 py-2 rounded-full font-medium transition-all duration-200 text-base sm:text-lg shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  selectedRole === 'fisio'
                    ? 'bg-[#05668D] text-white scale-105 ring-[#05668D]' // Efecto de selección
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 ring-transparent'
                }`}
              >
                Soy Fisioterapeuta
              </button>
            </div>
          </div>

          {/* Grid de Videos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Mapeo de los videos según el rol seleccionado */}
            {videoData[selectedRole].map((video) => (
              // Contenedor de cada tarjeta de video
              <div key={video.id}>
                 {/* Contenedor del título */}
                 <div> {/* Menos padding abajo para acercarlo al video */}
                   <h3 className="text-base sm:text-lg font-semibold text-[#05668D] line-clamp-2"> {/* Limita a 2 líneas */}
                     {video.title}
                   </h3>
                 </div>
                {/* Componente DemoWindow para mostrar la miniatura/video */}
                <DemoWindow
                  youtubeVideoId={video.id}
                  title={video.title}
                  // Se pasa la función para manejar el clic y abrir el modal
                  onClick={() => setSelectedVideo({ id: video.id, title: video.title })}
                  // isModal es false por defecto
                />
              </div>
            ))}
          </div>
        </section>

        {/* Renderizado Condicional del Modal */}
        {selectedVideo && (
          <VideoModal
            videoId={selectedVideo.id}
            title={selectedVideo.title}
            // Función para cerrar el modal al hacer clic en el botón de cierre o fondo
            onClose={() => setSelectedVideo(null)}
          />
        )}
      </div>
    </div>
  );
};

// Exportación del componente principal de la página
export default HelpCenterPage;