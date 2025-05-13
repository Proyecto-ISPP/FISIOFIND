"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { getApiBaseUrl } from "@/utils/api";
import { Play, AlertCircle, X, Loader2, ArrowLeft } from 'lucide-react';
import { useParams, useRouter } from "next/navigation";
import Alert from "@/components/ui/Alert";

const getAuthToken = () => {
  return localStorage.getItem("token");
};

const Pacientes = () => {
  const { id: treatmentId } = useParams();
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>("");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isVideoLoading, setIsVideoLoading] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);


  const [alert, setAlert] = useState<{
    show: boolean;
    type: "success" | "error" | "info" | "warning";
    message: string;
  }>({
    show: false,
    type: "info",
    message: ""
  });
  
  const showAlert = (type: "success" | "error" | "info" | "warning", message: string) => {
    setAlert({
      show: true,
      type,
      message
    });
  };

  
  // Check authentication and role
  useEffect(() => {
    const checkAuthAndRole = async () => {
      setIsAuthChecking(true);
      const storedToken = getAuthToken();
      
      if (!storedToken) {
        console.log("No token found, redirecting to login");
        router.push("/login");
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
          router.push("/not-found");
        }
      } catch (error) {
        if (error.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem("token");
          router.push("/login");
        } else {
          // Other errors, redirect to not-found
          router.push("/not-found");
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
        setMessage("Error: No hay token de autenticación.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${getApiBaseUrl()}/api/cloud/videos/list-videos/${id}`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (response.data && Array.isArray(response.data)) {
          setVideos(response.data);
        } else {
          setMessage(" No se encontraron videos.");
        }
      } catch (error) {
        showAlert("error", "Error al obtener los videos.");
      } finally {
        setLoading(false); // Al finalizar la carga de videos, cambia el estado
      }
    };

    fetchVideos();
  }, [isAuthenticated, isAuthChecking]);

  const handleVideoClick = async (videoId: string) => {
    const storedToken = getAuthToken();
    if (!storedToken) {
      showAlert("error", "Error: No hay token de autenticación.");
      return;
    }

    setIsVideoLoading(true);

    try {
      const response = await axios.get(`${getApiBaseUrl()}/api/cloud/videos/stream-video/${videoId}/`, {
        headers: { Authorization: `Bearer ${storedToken}` },
        responseType: "blob",
      });

      if (response.status === 403) {
        showAlert("error", "No tienes permiso para acceder a este video.");
        return;
      }

      const videoUrl = URL.createObjectURL(response.data);
      setVideoUrl(videoUrl);
    } catch (error) {
      if (error.response?.status === 403) {
        showAlert("error", "No tienes permiso para acceder a este video.");
      } else {
        showAlert("error", "Error al obtener el video.");
      }
    } finally {
      setIsVideoLoading(false);
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
        
        {/* Back to Treatment Button */}
        <button
          onClick={() => router.push(`/patient-management/follow-up/${id}`)}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 font-medium"
        >
          <ArrowLeft className="mr-2" size={20} />
          Volver al tratamiento
        </button>

        <div className="text-center mb-9">
          <h1 className="text-3xl font-bold mb-2"
              style={{ 
                background: "linear-gradient(90deg, #1E5ACD, #3a6fd8)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>
            Videos del Tratamiento
          </h1>
          <p className="text-gray-600">
            Lista de videos relacionados con tu tratamiento
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
      <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center backdrop-blur-sm pointer-events-auto">
        <div className="relative max-w-4xl w-full p-4">
          
          <button 
            onClick={() => setVideoUrl(null)} 
            className="absolute top-4 right-4 bg-gray-900 text-white hover:bg-gray-800 transition-all duration-200 flex items-center rounded-full p-3 shadow-lg z-50 border border-white"
            style={{
              zIndex: 1000,
              backgroundColor: "rgba(0, 0, 0, 0.7)",
            }}
          >
            <X size={24} />
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

export default Pacientes;
