"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { getApiBaseUrl } from "@/utils/api";
import { Play, AlertCircle, X, Loader2, ArrowLeft, Download, Eye } from 'lucide-react';
import { useParams, useRouter } from "next/navigation";
import Alert from "@/components/ui/Alert";

const getAuthToken = () => {
  return localStorage.getItem("token");
};

const PhysioFiles = () => {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>("");
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

        if (response.data && response.data.user_role === "physiotherapist") {
          setIsAuthenticated(true);
        } else {
          console.log("User is not a physioterapist, redirecting to not-found");
          window.location.href = "/not-found";
        }
      } catch (error) {
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
    
    const fetchFiles = async () => {
      const storedToken = getAuthToken();
      if (!storedToken) {
        setMessage("Error: No hay token de autenticación.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${getApiBaseUrl()}/api/cloud/files/list-files/`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (response.data && Array.isArray(response.data)) {
          setFiles(response.data);
        } else {
          setMessage(" No se encontraron archivos.");
        }
      } catch (error) {
        showAlert("error", "Error al obtener los archivos.");
      } finally {
        setLoading(false); 
      }
    };

    fetchFiles();
  }, [isAuthenticated, isAuthChecking]);

  const handleDownload = async (fileId: string, fileName: string) => {
  const token = getAuthToken();
  try {
    const response = await axios.get(
      `${getApiBaseUrl()}/api/cloud/files/download/${fileId}/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob", // 👈 importante para obtener datos binarios
      }
    );

    // Crear un blob con la respuesta
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName); // nombre con el que se descargará
    document.body.appendChild(link);
    link.click();
    link.remove();

    showAlert("success", "Descarga iniciada correctamente.");
  } catch (error) {
    console.error("Error al descargar el archivo:", error);
    showAlert("error", "No se pudo descargar el archivo.");
  }
};

  
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

  const isImage = (fileUrl: string) => {
    return /\.(jpeg|jpg|png|gif|bmp|webp)$/i.test(fileUrl);
  };
  
  const isPDF = (fileUrl: string) => {
    return /\.pdf$/i.test(fileUrl);
  };
  

  
  return (
    <div className="min-h-screen flex items-center justify-center p-5" 
         style={{ background: "rgb(238, 251, 250)" }}>

      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-xl p-10 transition-all duration-300"
           style={{ boxShadow: "0 20px 60px rgba(0, 0, 0, 0.08)" }}>
        
        {/* Back to Treatment Button */}
        <button
          onClick={() => router.push(`/physio-management/follow-up/${id}`)}
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
            Archivos del Tratamiento
          </h1>
          <p className="text-gray-600">
            Lista de archivos relacionados con tu tratamiento
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

        {/* No Files Available */}
        {files.length === 0 && !loading && (
          <div className="text-center py-8 bg-gray-50 rounded-2xl border-2 border-gray-200">
            <p className="text-gray-500">No tienes archivos disponibles.</p>
          </div>
        )}

        {/* Files List */}
        {files.length > 0 && !loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {files.map((files) => (
              <div 
                key={files.id} 
                className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-4 transition-all duration-200 hover:shadow-md"
              >
                <div>
                  <h3 className="font-semibold text-lg text-gray-800 mb-2 truncate">
                    {files.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {files.description}
                  </p>
                  
                </div>
                
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PhysioFiles;
