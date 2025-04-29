"use client";

import React, { useState } from 'react';

interface DemoWindowProps {
  youtubeVideoId: string;
  title: string;
}

// Componente DemoWindow con URL de embed corregida
function DemoWindow({ youtubeVideoId, title }: DemoWindowProps) {
  const embedUrl = `https://www.youtube.com/embed/${youtubeVideoId}`; // URL estándar de YouTube Embed

  return (
    <div className={`w-full mx-auto rounded-xl overflow-hidden relative shadow-xl transition-transform duration-300 hover:scale-105 bg-gray-100`}>
      <div className="h-8 flex items-center px-4 bg-opacity-90" style={{ backgroundColor: '#E9E9E9' }}>
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
          <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
        </div>
      </div>
      <div className="aspect-video relative z-10">
        {youtubeVideoId ? (
          <iframe
            className="w-full h-full absolute top-0 left-0"
            src={embedUrl}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">ID de video no válido.</div>
        )}
      </div>
    </div>
  );
}


const HelpCenterPage = () => {
  const [showManualModal, setShowManualModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'paciente' | 'fisio'>('paciente'); // Estado para el rol

  const handleDownloadManual = () => {
    const pdfUrl = "/manuals/FisioFind_UserManual_v1.pdf";
    const pdfFile = "FisioFind_UserManual_v1.pdf";
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = pdfFile;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowManualModal(false);
  };

  // IDs de video de ejemplo por rol (Reemplaza con tus IDs reales)
  const videoData = {
    paciente: [
      { id: 'dQw4w9WgXcQ', title: 'Paciente: Demostración General' },
      { id: 'd0eIS9UhSs4', title: 'Paciente: Cómo Reservar Cita' },
      { id: 'pCaqG-oPJ-I', title: 'Paciente: Realizar Videoconsulta' },
      { id: 'OhPLSPGAVZE', title: 'Paciente: Gestionar Perfil' },
      { id: 'PA24Cw2eMA4', title: 'Paciente: Buscar Fisioterapeutas' },
      { id: 'LIQiTrk6UVA', title: 'Paciente: Dejar una Reseña' },
    ],
    fisio: [
      { id: 'L_LUpnjgPso', title: 'Fisio: Configurar Perfil Profesional' },
      { id: 'dQw4w9WgXcQ', title: 'Fisio: Gestionar Disponibilidad' },
      { id: 'g7XOehIYrL8', title: 'Fisio: Atender Videoconsulta' },
      { id: '5YPO-qPmuoE', title: 'Fisio: Gestionar Citas Recibidas' },
      { id: 'Zjo6gUHbL70', title: 'Fisio: Revisar Historial de Pacientes' },
      { id: 'zy3CD3UUNv0', title: 'Fisio: Entendiendo Pagos y Facturación' },
    ]
  };

  return (
    <div className="min-h-screen bg-[rgb(238, 251, 250)] py-16 px-4 relative">
      <div className="max-w-screen-xl mx-auto">
        <h1 className="text-4xl font-bold text-[#05668D] mb-12 text-center">
          Centro de Ayuda
        </h1>

        {/* Sección Manual de Usuario */}
        <section className="mb-12 bg-white p-8 rounded-lg shadow-md max-w-screen-lg mx-auto">
          <h2 className="text-3xl font-bold text-[#253240] mb-6">Manual de Usuario</h2>
          <p className="text-gray-700 mb-6 text-lg">
            Bienvenido al manual de usuario de Fisio Find. Aquí encontrarás toda la información necesaria para sacar el máximo provecho de nuestra plataforma...
          </p>
          <p className="text-gray-700 mb-6">
            Explora las diferentes secciones...
          </p>
          <ul className="list-disc list-inside space-y-2 mb-8 text-gray-700">
            <li>Registro e Inicio de Sesión</li>
            <li>Búsqueda y Selección de Fisioterapeutas</li>
            <li>Proceso de Reserva de Citas</li>
            <li>Gestión de tu Perfil y Citas</li>
            <li>Realización de Videoconsultas</li>
            <li>Sistema de Valoraciones y Reseñas</li>
            <li>Resolución de Problemas Comunes</li>
          </ul>
          <div className="text-center">
            <button
              onClick={handleDownloadManual}
              className="inline-block bg-[#41B8D5] hover:bg-[#05AC9C] text-white px-8 py-3 rounded-full font-medium transition-colors text-lg shadow hover:shadow-lg"
            >
              Descargar Manual Completo (PDF)
            </button>
          </div>
        </section>

        {/* Sección Videotutoriales con Selección de Rol */}
        <section className="mb-12">
            <div className="bg-white p-8 rounded-lg shadow-md mb-8">
                <h2 className="text-3xl font-bold text-[#253240] mb-4">Videotutoriales</h2>
                <p className="text-gray-700 text-lg mb-6">
                 Selecciona tu rol para ver los videos relevantes o explora las guías visuales que hemos preparado para ti.
                </p>
                {/* Botones de Selección de Rol */}
                <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
                    <button
                      onClick={() => setSelectedRole('paciente')}
                      className={`px-6 py-2 rounded-full font-medium transition-colors text-lg shadow hover:shadow-md ${
                        selectedRole === 'paciente'
                          ? 'bg-[#05668D] text-white scale-105'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Soy Paciente
                    </button>
                    <button
                      onClick={() => setSelectedRole('fisio')}
                      className={`px-6 py-2 rounded-full font-medium transition-colors text-lg shadow hover:shadow-md ${
                        selectedRole === 'fisio'
                          ? 'bg-[#05668D] text-white scale-105'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Soy Fisioterapeuta
                    </button>
                </div>
            </div>

            {/* Cuadrícula para los videos (Ajustada a 3 columnas en lg) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                {videoData[selectedRole].map((video) => (
                <div key={video.id}>
                    <h3 className="text-xl font-semibold text-[#05668D] mb-4 flex-grow">{video.title}</h3>
                    <DemoWindow youtubeVideoId={video.id} title={video.title} />
                </div>
                ))}
            </div>
        </section>

      </div>
    </div>
  );
};

export default HelpCenterPage;