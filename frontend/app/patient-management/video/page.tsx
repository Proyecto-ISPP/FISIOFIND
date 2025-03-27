"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { getApiBaseUrl } from "@/utils/api";
import { Loader2, Play, AlertCircle, X } from 'lucide-react';

const getAuthToken = () => {
  return localStorage.getItem("token"); // Obtiene el token JWT
};

const PatientVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true); // Cargando inicialmente
  const [message, setMessage] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [isVideoLoading, setIsVideoLoading] = useState(false); // Para controlar el modal de carga del video
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // Check authentication and role
  useEffect(() => {
    const checkAuthAndRole = async () => {
      setIsAuthChecking(true);
      const storedToken = getAuthToken();
      
      if (!storedToken) {
        console.log("No token found, redirecting to login");
        window.location.href = "/login";
        return;
      }

      try {
        // Check user role
        const response = await axios.get(`${getApiBaseUrl()}/api/app_user/check-role/`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (response.data && response.data.user_role === "patient") {
          setIsAuthenticated(true);
        } else {
          console.log("User is not a patient, redirecting to not-found");
          window.location.href = "/not-found";
        }
      } catch (error) {
        console.error("Error checking user role:", error);
        if (error.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem("token");
          window.location.href = "/login";
        } else {
          // Other errors, redirect to not-found
          window.location.href = "/not-found";
        }
      } finally {
        setIsAuthChecking(false);
      }
    };

    checkAuthAndRole();
  }, []);

  useEffect(() => {
    if (!isAuthenticated || isAuthChecking) return;
    
    const fetchVideos = async () => {
      const storedToken = getAuthToken();
      if (!storedToken) {
        console.error("❌ No hay token disponible.");
        setMessage("Error: No hay token de autenticación.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${getApiBaseUrl()}/api/app_user/videos/list-my-videos/`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (response.data && Array.isArray(response.data)) {
          setVideos(response.data);
        } else {
          setMessage("❌ No se encontraron videos.");
        }
      } catch (error) {
        console.error("⚠️ Error al obtener los videos:", error);
        setMessage("❌ Error al obtener los videos.");
      } finally {
        setLoading(false); // Al finalizar la carga de videos, cambia el estado
      }
    };

    fetchVideos();
  }, [isAuthenticated, isAuthChecking]);

  const handleVideoClick = async (videoId) => {
    const storedToken = getAuthToken();
    if (!storedToken) {
      console.error("❌ No hay token disponible.");
      setMessage("Error: No hay token de autenticación.");
      return;
    }

    setIsVideoLoading(true); // Mostrar el modal de "Cargando video"

    try {
      const response = await axios.get(`${getApiBaseUrl()}/api/app_user/videos/stream-video/${videoId}/`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
        responseType: 'blob', // Necesario para manejar el video como un archivo binario
      });

      const videoUrl = URL.createObjectURL(response.data); // Crear una URL temporal para el archivo blob
      setVideoUrl(videoUrl); // Establecer la URL del video

    } catch (error) {
      console.error("⚠️ Error al obtener el video:", error);
      setMessage("❌ Error al obtener el video.");
      setTimeout(() => setMessage(""), 5000);
    } finally {
      setIsVideoLoading(false); // Ocultar el modal de "Cargando video" cuando el video esté listo
    }
  };

  // Loading state
  if (isAuthChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-blue-200 mb-4"></div>
          <div className="h-4 w-24 bg-blue-200 rounded"></div>
        </div>
      </div>
    );
  }

  // If not authenticated (this is a fallback, the redirect should happen in useEffect)
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center p-5" 
         style={{ background: "rgb(238, 251, 250)" }}>
      
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-xl p-10 transition-all duration-300"
           style={{ boxShadow: "0 20px 60px rgba(0, 0, 0, 0.08)" }}>
        
        <div className="text-center mb-9">
          <h1 className="text-3xl font-bold mb-2"
              style={{ 
                background: "linear-gradient(90deg, #1E5ACD, #3a6fd8)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>
            Mis Videos
          </h1>
          <p className="text-gray-600">
            Videos compartidos por tu fisioterapeuta
          </p>
        </div>
        
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1E5ACD]"></div>
          </div>
        )}
        
        {/* Error Message */}
        {message && (
          <div
            className="mt-4 p-4 rounded-xl text-center bg-red-50 text-red-600 border border-red-100 flex items-center justify-center"
          >
            <AlertCircle className="mr-2" size={20} />
            <span>{message}</span>
          </div>
        )}
        
        {/* No Videos Available */}
        {videos.length === 0 && !loading && (
          <div className="text-center py-8 bg-gray-50 rounded-2xl border-2 border-gray-200">
            <p className="text-gray-500">No tienes videos disponibles.</p>
          </div>
        )}
        
        {/* Video List */}
        {videos.length > 0 && !loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div 
                key={video.id} 
                className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-4 transition-all duration-200 hover:shadow-md"
              >
                <div>
                  <h3 className="font-semibold text-lg text-gray-800 mb-2 truncate">
                    {video.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {video.description}
                  </p>
                  <button
                    onClick={() => handleVideoClick(video.id)}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center"
                  >
                    <Play className="mr-2" size={20} />
                    Ver Video
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Video Loading Modal */}
      {isVideoLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-3xl shadow-xl max-w-sm w-full transition-all duration-300"
               style={{ boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)" }}>
            <Loader2 className="animate-spin mx-auto mb-4 text-blue-600" size={48} />
            <p className="text-center text-gray-700">
              Estamos cargando tu video, espera un momentito...
            </p>
          </div>
        </div>
      )}
      
      {/* Video Player */}
      {videoUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="relative max-w-4xl w-full p-4">
            <button 
              onClick={() => setVideoUrl(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-all duration-200 flex items-center"
            >
              <X size={24} className="mr-2" />
              Cerrar
            </button>
            <video 
              controls 
              autoPlay
              className="w-full rounded-xl shadow-2xl"
              src={videoUrl}
            >
              Tu navegador no soporta la etiqueta de video.
            </video>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientVideos;
