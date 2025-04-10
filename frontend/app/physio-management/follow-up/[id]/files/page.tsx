"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { getApiBaseUrl } from "@/utils/api";
import { Eye, AlertCircle, X, Loader2, ArrowLeft, Download } from 'lucide-react';
import { useParams, useRouter } from "next/navigation";
import Alert from "@/components/ui/Alert";


const PhysioFiles = () => {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);
  const [alert, setAlert] = useState<{ show: boolean; type: "success" | "error" | "info" | "warning"; message: string; }>({
    show: false,
    type: "info",
    message: ""
  });
  const [previewFile, setPreviewFile] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string>("");

  const showAlert = (type: "success" | "error" | "info" | "warning", message: string) => {
    setAlert({
      show: true,
      type,
      message
    });
  };

  const getAuthToken = () => {
      return localStorage.getItem("token");
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
            const response = await axios.get(`${getApiBaseUrl()}/api/app_user/check-role/`, {
              headers: {
                Authorization: `Bearer ${storedToken}`,
              },
            });
    
            if (response.data && response.data.user_role === "physiotherapist") {
              setIsAuthenticated(true);
            } else {
              console.log("User is not a physiotherapist, redirecting to not-found");
              window.location.href = "/not-found";
            }
          } catch (error) {
            if (error.response?.status === 401) {
              localStorage.removeItem("token");
              window.location.href = "/login";
            } else {
              window.location.href = "/not-found";
            }
          } finally {
            setIsAuthChecking(false);
          }
        };
    
        checkAuthAndRole();
      }, []);

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
        const response = await axios.get(`${getApiBaseUrl()}/api/app_user/check-role/`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (response.data && response.data.user_role === "physiotherapist") {
          setIsAuthenticated(true);
        } else {
          console.log("User is not a physiotherapist, redirecting to not-found");
          window.location.href = "/not-found";
        }
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        } else {
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
          setMessage("No se encontraron archivos.");
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
        `${getApiBaseUrl()}/api/cloud/files/view-file/${fileId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      const mimeType = response.headers["content-type"] || getMimeTypeFromFilename(fileName);
      const blob = new Blob([response.data], { type: mimeType });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();

      showAlert("success", "Descarga iniciada correctamente.");
    } catch (error) {
      console.error("Error al descargar el archivo:", error);
      showAlert("error", "No se pudo descargar el archivo.");
    }
  };

  const getMimeTypeFromFilename = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase();
    const mimeMap: Record<string, string> = {
      pdf: 'application/pdf',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      dicom: 'application/dicom',
    };
    return mimeMap[ext || ''] || 'application/octet-stream';
  };

  const handlePreview = async (fileId: string, fileName: string) => {
    const token = getAuthToken();
    try {
      const response = await axios.get(`${getApiBaseUrl()}/api/cloud/files/view-file/${fileId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      });

      const contentType = response.headers["content-type"];
      const blob = new Blob([response.data], { type: contentType });
      const fileURL = URL.createObjectURL(blob);

      if (contentType.includes("pdf")) {
        setFileType("pdf");
      } else if (contentType.includes("image")) {
        setFileType("image");
      } else {
        setFileType("other");
      }

      setPreviewFile(fileURL);
    } catch (error) {
      console.error("Error al obtener el archivo para vista previa:", error);
      showAlert("error", "No se pudo obtener el archivo para vista previa.");
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

  return (
      <div className="min-h-screen flex items-center justify-center p-5" style={{ background: "rgb(238, 251, 250)" }}>
        <div className="bg-white w-full max-w-4xl rounded-3xl shadow-xl p-10 transition-all duration-300" style={{ boxShadow: "0 20px 60px rgba(0, 0, 0, 0.08)" }}>
          <button onClick={() => router.push(`/physio-management/follow-up/${id}`)} className="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 font-medium">
            <ArrowLeft className="mr-2" size={20} />
            Volver al tratamiento
          </button>
          <div className="text-center mb-9">
            <h1 className="text-3xl font-bold mb-2" style={{ background: "linear-gradient(90deg, #1E5ACD, #3a6fd8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Archivos del Tratamiento
            </h1>
            <p className="text-gray-600">Lista de archivos relacionados con tu tratamiento</p>
          </div>
    
          {loading && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1E5ACD]"></div>
            </div>
          )}
    
          {message && (
            <div className="mt-4 p-4 rounded-xl text-center bg-red-50 text-red-600 border border-red-100 flex items-center justify-center">
              <AlertCircle className="mr-2" size={20} />
              <span>{message}</span>
            </div>
          )}
    
          {files.length === 0 && !loading && (
            <div className="text-center py-8 bg-gray-50 rounded-2xl border-2 border-gray-200">
              <p className="text-gray-500">No tienes archivos disponibles.</p>
            </div>
          )}
    
          {files.length > 0 && !loading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {files.map((file) => (
                <div key={file.id} className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-4 transition-all duration-200 hover:shadow-md">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800 mb-2 truncate">{file.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{file.description}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handlePreview(file.id, file.title)}
                        className="flex items-center gap-1 bg-[#6bc9be] text-white px-3 py-2 rounded-xl hover:bg-[#5ab8ad] transition-all duration-200"
                        title="Vista previa"
                      >
                        <Eye size={18} />
                        <span className="text-sm">Ver</span>
                      </button>
                      <button
                        onClick={() => handleDownload(file.id, file.title)}
                        className="flex items-center gap-1 bg-blue-500 text-white px-3 py-2 rounded-xl hover:bg-blue-400 transition-all duration-200"
                        title="Descargar"
                      >
                        <Download size={18} />
                        <span className="text-sm">Descargar</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
    
        {previewFile && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="relative max-w-4xl w-full p-4">
              <button onClick={() => setPreviewFile(null)} className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-200 flex items-center rounded-full p-2 shadow-lg">
                <X size={24} />
                <span className="ml-1 mr-1">Cerrar</span>
              </button>
    
              {fileType === 'image' && <img src={previewFile} alt="Vista previa" className="max-w-full max-h-[80vh] mx-auto object-contain" />}
              {fileType === 'pdf' && (
                <iframe 
                  src={previewFile}
                  width="100%" 
                  height="600vh" 
                  title="PDF Viewer"
                  className="bg-white rounded-lg"
                />
              )}
              {fileType === 'other' && (
                <div className="text-white text-center">
                  <p>No se puede mostrar vista previa de este tipo de archivo.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
    
};

export default PhysioFiles;
