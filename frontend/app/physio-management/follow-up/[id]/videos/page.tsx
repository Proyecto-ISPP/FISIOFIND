"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { getApiBaseUrl } from "@/utils/api";
import axios from "axios";
import { ArrowLeft, UploadCloud, Edit2, Trash, Play, X, Loader2 } from "lucide-react";
import Alert from "@/components/ui/Alert";

const PhysioVideo = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [file, setFileKey] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingVideos, setLoadingVideos] = useState<boolean>(false);
  const [videos, setVideos] = useState<any[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);
  const [editingVideo, setEditingVideo] = useState<number | null>(null);
  const [message, setMessage] = useState<string>("");
  const [alert, setAlert] = useState({
    show: false,
    type: "info" as "success" | "error" | "info" | "warning",
    message: ""
  });

  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isVideoLoading, setIsVideoLoading] = useState<boolean>(false);

  const showAlert = (type: "success" | "error" | "info" | "warning", message: string) => {
    setAlert({ show: true, type, message });
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
    if (!isAuthenticated || isAuthChecking) return;

    const fetchVideos = async () => {
      setLoadingVideos(true);
      const token = getAuthToken();
      if (!token) {
        setMessage("Error: No hay token de autenticación.");
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(`${getApiBaseUrl()}/api/cloud/videos/list-videos/`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { treatment_id: id } // Ensure the correct parameter name is used
        });
        setVideos(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        setVideos([]);
      } finally {
        setLoadingVideos(false);
      }
    };

    fetchVideos();
  }, [id, isAuthenticated, isAuthChecking]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      setFileKey(event.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = getAuthToken();

    // Validate required fields
    if (!title.trim()) {
      showAlert("error", "El título es obligatorio.");
      return;
    }
    if (title.length > 100) {
      showAlert("error", "El título no puede exceder los 100 caracteres.");
      return;
    }
    if (!description.trim()) {
      showAlert("error", "La descripción es obligatoria.");
      return;
    }
    if (description.length > 255) {
      showAlert("error", "La descripción no puede exceder los 255 caracteres.");
      return;
    }
    if (!file && editingVideo === null) {
      showAlert("error", "El archivo de video es obligatorio.");
      return;
    }

    setLoading(true);

    try {
      if (editingVideo !== null) {
        // Update video
        await axios.put(
          `${getApiBaseUrl()}/api/cloud/videos/update-video/${editingVideo}/`,
          { title, description },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        showAlert("success", "Video actualizado correctamente.");
      } else {
        // Create new video
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("file", file!);
        formData.append("treatment", id);

        await axios.post(`${getApiBaseUrl()}/api/cloud/videos/create-video/`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        showAlert("success", "Video subido correctamente.");
      }

      // Reset form and reload videos
      setTitle("");
      setDescription("");
      setFileKey(null);
      setEditingVideo(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      const response = await axios.get(`${getApiBaseUrl()}/api/cloud/videos/list-videos/`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { treatment: id },
      });
      setVideos(response.data);
    } catch (error) {
      showAlert("error", error.response?.data?.message || "Error al procesar el video.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (video) => {
    setEditingVideo(video.id);
    setTitle(video.title);
    setDescription(video.description);
    setFileKey(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const [deleteConfirmation, setDeleteConfirmation] = useState({ show: false, videoId: null });

  const confirmDelete = (videoId: number) => {
    setDeleteConfirmation({ show: true, videoId });
  };

  const cancelDelete = () => {
    setDeleteConfirmation({ show: false, videoId: null });
  };

  const handleDelete = async (videoId: number) => {
    const token = getAuthToken();
    setDeleteConfirmation({ show: false, videoId: null });
    try {
      await axios.delete(`${getApiBaseUrl()}/api/cloud/videos/delete-video/${videoId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showAlert("success", "Video eliminado correctamente.");
      setVideos(videos.filter((v) => v.id !== videoId));
    } catch (error) {
      showAlert("error", error.response?.data?.detail || "Error al eliminar el video.");
    }
  };

  const handleVideoClick = async (videoId: string) => {
    const token = getAuthToken();
    if (!token) {
      showAlert("error", "Error: No hay token de autenticación.");
      return;
    }

    setIsVideoLoading(true);

    try {
      const response = await axios.get(`${getApiBaseUrl()}/api/cloud/videos/stream-video/${videoId}/`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });

      if (response.status === 403) {
        showAlert("error", "No tienes permiso para acceder a este video. Verifica que tienes los permisos necesarios.");
        return;
      }

      const videoUrl = URL.createObjectURL(response.data);
      setVideoUrl(videoUrl);
    } catch (error) {
      if (error.response?.status === 403) {
        showAlert("error", "No tienes permiso para acceder a este video. Verifica que tienes los permisos necesarios.");
      } else if (error.response?.status === 404) {
        showAlert("error", "El video no fue encontrado. Verifica que el ID del video es correcto.");
      } else {
        showAlert("error", "Error al obtener el video. Intenta nuevamente más tarde.");
      }
    } finally {
      setIsVideoLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5" style={{ background: "rgb(238, 251, 250)" }}>
      {alert.show && (
        <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ ...alert, show: false })} />
      )}

      {deleteConfirmation.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h3 className="text-xl font-bold mb-4">Confirmar eliminación</h3>
            <p className="mb-6">¿Estás seguro de que deseas eliminar este video?</p>
            <div className="flex justify-end space-x-3">
              <button onClick={cancelDelete} className="px-4 py-2 border rounded-xl">Cancelar</button>
              <button onClick={() => handleDelete(deleteConfirmation.videoId!)} className="px-4 py-2 bg-red-500 text-white rounded-xl">Eliminar</button>
            </div>
          </div>
        </div>
      )}

      {isVideoLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div
            className="bg-white p-8 rounded-3xl shadow-xl max-w-sm w-full transition-all duration-300"
            style={{ boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)" }}
          >
            <Loader2 className="animate-spin mx-auto mb-4 text-blue-600" size={48} />
            <p className="text-center text-gray-700">Estamos cargando tu video, espera un momentito...</p>
          </div>
        </div>
      )}

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
            <video controls autoPlay className="w-full rounded-xl shadow-2xl" src={videoUrl}>
              Tu navegador no soporta la etiqueta de video.
            </video>
          </div>
        </div>
      )}

      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-xl p-10">
        <button onClick={() => router.push(`/physio-management/follow-up/${id}`)} className="mb-6 flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft className="mr-2" size={20} /> Volver al tratamiento
        </button>

        <div className="text-center mb-9">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-[#1E5ACD] to-[#3a6fd8] bg-clip-text text-transparent">Videos del Tratamiento</h1>
          <p className="text-gray-600">Administra los videos para tus pacientes</p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Videos Disponibles</h2>
          {loadingVideos ? (
            <p className="text-center">Cargando videos...</p>
          ) : videos.length ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <div
                  key={video.id}
                  className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-4 transition-all duration-200 hover:shadow-md"
                >
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800 mb-2 truncate">{video.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{video.description}</p>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleVideoClick(video.id)}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-200 flex items-center justify-center"
                      >
                        <Play className="mr-2" size={20} />
                        Ver Video
                      </button>
                      <button
                        onClick={() => handleEdit(video)}
                        className="w-10 h-10 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full flex items-center justify-center transition-all duration-200"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => confirmDelete(video.id)}
                        className="w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-200"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center">No hay videos disponibles para este tratamiento.</p>
          )}
        </div>

        <div className="border-t pt-6">
          <h2 className="text-xl font-bold mb-4">
            {editingVideo ? "Editar Video" : "Subir Nuevo Video"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <input
                type="text"
                placeholder="Título"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
                className="w-full py-3 px-4 text-sm border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:shadow"
              />
              <div className="text-right text-xs text-gray-500 mt-1">{title.length}/100 caracteres</div>
            </div>

            <div>
              <textarea
                placeholder="Descripción"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={255}
                rows={2}
                className="w-full py-3 px-4 text-sm border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:shadow"
              />
              <div className="text-right text-xs text-gray-500 mt-1">{description.length}/255 caracteres</div>
            </div>

            {!editingVideo && (
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="w-full py-2 px-4 text-sm border-2 border-gray-200 rounded-xl"
              />
            )}

            <div className="flex space-x-3">
              {editingVideo && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingVideo(null);
                    setTitle("");
                    setDescription("");
                    setFileKey(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="w-1/2 border border-gray-300 text-gray-700 py-2 rounded-xl hover:bg-gray-100"
                >
                  Cancelar
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-2 rounded-xl flex items-center justify-center"
              >
                <UploadCloud className="mr-2" size={18} />
                {loading ? "Procesando..." : editingVideo ? "Actualizar Video" : "Subir Video"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PhysioVideo;
