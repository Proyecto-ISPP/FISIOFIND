"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent, useRef } from "react";
import { useParams } from "next/navigation";
import { getApiBaseUrl } from "@/utils/api";
import axios from "axios";
import { UploadCloud, Edit2, Trash } from "lucide-react";
import Alert from "@/components/ui/Alert";

const PhysioVideo = () => {
  const params = useParams();
  const id = params?.id as string;
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [file, setFileKey] = useState<File | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingVideos, setLoadingVideos] = useState<boolean>(false);  // Estado para cargar los videos
  const [videos, setVideos] = useState<any[]>([]);  // Estado para los videos
  const [editingVideo, setEditingVideo] = useState<number | null>(null);  // Estado para controlar qué video estamos editando
  const [editTitle, setEditTitle] = useState<string>("");  // Título del video a editar
  const [editDescription, setEditDescription] = useState<string>("");  // Descripción del video a editar
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [alert, setAlert] = useState<{
    show: boolean;
    type: "success" | "error" | "info" | "warning";
    message: string;
  }>({
    show: false,
    type: "info",
    message: ""
  });

  // Function to show alerts
  const showAlert = (type: "success" | "error" | "info" | "warning", message: string) => {
    setAlert({
      show: true,
      type,
      message
    });
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);

    // Solicitar los videos al cargar la página
    const fetchVideos = async () => {
      setLoadingVideos(true); // Establecer que estamos cargando videos
      try {
        const response = await axios.get(
          `${getApiBaseUrl()}/api/cloud/videos/list-videos/`, 
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
            params: {
              treatment: id // Add treatment ID as a query parameter
            }
          }
        );
        // Check if response.data is an array (even if empty)
        if (Array.isArray(response.data)) {
          setVideos(response.data);
        } else {
          setVideos([]);
        }
      } catch (error) {
        setVideos([]);
      } finally {
        setLoadingVideos(false);
      }
    };

    fetchVideos(); // Llamar a la función para obtener los videos
  }, [id]); // Add id as a dependency

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFileKey(event.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validaciones
    if (!file) {
      showAlert("error", "Por favor selecciona un archivo.");
      return;
    }

    if (!title.trim()) {
      showAlert("error", "El título no puede estar vacío.");
      return;
    }

    // Add character limit validation for title
    if (title.length > 100) {
      showAlert("error", "El título no puede exceder los 100 caracteres.");
      return;
    }

    if (!description.trim()) {
      showAlert("error", "La descripción no puede estar vacía.");
      return;
    }

    // Add character limit validation for description
    if (description.length > 255) {
      showAlert("error", "La descripción no puede exceder los 255 caracteres.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("file", file);
    formData.append("treatment", id);

    try {
      const response = await axios.post(
        `${getApiBaseUrl()}/api/cloud/videos/create-video/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      showAlert("success", "Video subido correctamente.");
      setTitle("");
      setDescription("");
      setFileKey(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Volver a cargar los videos después de subir uno
      const fetchVideos = async () => {
        try {
          const response = await axios.get(
            `${getApiBaseUrl()}/api/cloud/videos/list-videos/`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setVideos(response.data);
        } catch (error) {
          showAlert("error", error.response?.data?.detail || "No se pudieron cargar los videos.");
        }
      };
      fetchVideos();
    } catch (error) {
      showAlert("error", error.response?.data?.detail || "Error al subir el vídeo. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (video) => {
    showAlert("warning", "Desliza hacia abajo para editar el video")
    setEditingVideo(video.id);
    setEditTitle(video.title);
    setEditDescription(video.description);
  };

  const handleUpdate = async (event) => {
    event.preventDefault(); // Esto evita el refresco de la página
    if (!editTitle.trim()) {
      showAlert("error", "El título no puede estar vacío.");
      return;
    }

    // Add character limit validation for edit title
    if (editTitle.length > 100) {
      showAlert("error", "El título no puede exceder los 100 caracteres.");
      return;
    }

    if (!editDescription.trim()) {
      showAlert("error", "La descripción no puede estar vacía");
      return;
    }

    // Add character limit validation for edit description
    if (editDescription.length > 255) {
      showAlert("error", "La descripción no puede exceder los 255 caracteres.");
      return;
    }

    try {
      const response = await axios.put(
        `${getApiBaseUrl()}/api/cloud/videos/update-video/${editingVideo}/`,
        {
          title: editTitle,
          description: editDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      showAlert("success", "Video actualizado correctamente.");
      setEditingVideo(null); // Finalizar edición
      // Recargar videos
      const fetchVideos = async () => {
        try {
          const response = await axios.get(
            `${getApiBaseUrl()}/api/cloud/videos/list-videos/`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setVideos(response.data);
        } catch (error) {
          showAlert("error", error.response?.data?.detail || "No se pudieron cargar los videos.");
        }
      };
      fetchVideos();
    } catch (error) {
      showAlert("error", error.response?.data?.detail || "Error al actualizar el video. Intenta nuevamente.");
    }
  };

  // Add state for delete confirmation
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    show: boolean;
    videoId: number | null;
  }>({
    show: false,
    videoId: null
  });

  // Function to show delete confirmation
  const confirmDelete = (videoId: number) => {
    setDeleteConfirmation({
      show: true,
      videoId
    });
  };

  // Function to cancel delete
  const cancelDelete = () => {
    setDeleteConfirmation({
      show: false,
      videoId: null
    });
  };

  // Modify handleDelete to be called after confirmation
  const handleDelete = async (videoId) => {
    // Close the confirmation modal
    setDeleteConfirmation({
      show: false,
      videoId: null
    });
    
    try {
      // Make sure we have a token
      if (!token) {
        showAlert("error", "No hay token de autenticación disponible.");
        return;
      }

      await axios.delete(
        `${getApiBaseUrl()}/api/cloud/videos/delete-video/${videoId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      showAlert("success", "Video eliminado correctamente.");
      
      // Refresh videos list by filtering out the deleted video
      setVideos(videos.filter(video => video.id !== videoId));
      
      // Also fetch fresh data from the server
      const fetchVideos = async () => {
        try {
          const response = await axios.get(
            `${getApiBaseUrl()}/api/cloud/videos/list-videos/`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              params: {
                treatment: id
              }
            }
          );
          if (Array.isArray(response.data)) {
            setVideos(response.data);
          } else {
            setVideos([]);
          }
        } catch (fetchError) {
          // Just set to empty array if there's an error
          setVideos([]);
        }
      };
      
      fetchVideos();
    } catch (error) {
      // Check if the error is a 404 (video already deleted)
      if (error.response && error.response.status === 404) {
        showAlert("success", "Video eliminado correctamente.");
        // Refresh the video list by filtering out the deleted video
        setVideos(videos.filter(video => video.id !== videoId));
      } else {
        showAlert("error", error.response?.data?.detail || "Error al eliminar el video. Intenta nuevamente.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5" style={{ background: "rgb(238, 251, 250)" }}>
      {alert.show && (
        <Alert 
          type={alert.type} 
          message={alert.message} 
          onClose={() => setAlert({ ...alert, show: false })} 
        />
      )}
      
      {/* Delete Confirmation Modal */}
      {deleteConfirmation.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h3 className="text-xl font-bold mb-4">Confirmar eliminación</h3>
            <p className="mb-6">¿Estás seguro de que deseas eliminar este video? Esta acción no se puede deshacer.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmation.videoId)}
                className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-xl p-10 transition-all duration-300" style={{ boxShadow: "0 20px 60px rgba(0, 0, 0, 0.08)" }}>
        <div className="text-center mb-9">
          <h1 className="text-3xl font-bold mb-2" style={{
            background: "linear-gradient(90deg, #1E5ACD, #3a6fd8)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Videos del Tratamiento
          </h1>
          <p className="text-gray-600">Administra los videos para tus pacientes</p>
        </div>

        {/* Videos list moved to the top */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Videos Disponibles</h2>

          {loadingVideos ? (
            <p className="text-center">Cargando videos...</p>
          ) : (
            <>
              {videos.length > 0 ? (
                <ul className="space-y-4">
                  {videos.map((video) => (
                    <li key={video.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl shadow-md">
                      <div>
                        <h3 className="font-semibold">{video.title}</h3>
                        <p>{video.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(video)}
                          className="bg-[#05AC9C] text-white p-2 rounded-xl hover:bg-[#05918F] transition-all duration-200"
                          title="Editar video"
                        >
                          <Edit2 size={18} />
                        </button>
                        
                        <button
                          onClick={() => confirmDelete(video.id)}
                          className="bg-red-500 text-white p-2 rounded-xl hover:bg-red-600 transition-all duration-200"
                          title="Eliminar video"
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center">No hay videos disponibles para este tratamiento.</p>
              )}
            </>
          )}
        </div>

        {/* Upload form made smaller */}
        <div className="border-t pt-6">
          <h2 className="text-xl font-bold mb-4">Subir Nuevo Video</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Título"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full py-3 px-4 text-sm border-2 border-gray-200 rounded-xl transition-all duration-200 outline-none focus:border-[#1E5ACD] focus:shadow-[0_0_0_4px_rgba(30,90,205,0.1)]"
                maxLength={100}
              />
              <div className="text-right text-xs text-gray-500 mt-1">
                {title.length}/100 caracteres
              </div>
            </div>

            <div className="relative">
              <textarea
                placeholder="Descripción"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full py-3 px-4 text-sm border-2 border-gray-200 rounded-xl transition-all duration-200 outline-none focus:border-[#1E5ACD] focus:shadow-[0_0_0_4px_rgba(30,90,205,0.1)]"
                rows={2}
                maxLength={255}
              />
              <div className="text-right text-xs text-gray-500 mt-1">
                {description.length}/255 caracteres
              </div>
            </div>

            <div className="relative">
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="w-full py-2 px-4 text-sm border-2 border-gray-200 rounded-xl transition-all duration-200 outline-none focus:border-[#1E5ACD] focus:shadow-[0_0_0_4px_rgba(30,90,205,0.1)]"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-200 flex items-center justify-center"
            >
              <UploadCloud className="mr-2" size={18} />
              {loading ? "Subiendo..." : "Subir Video"}
            </button>
          </form>
        </div>

        {editingVideo && (
          <div className="mt-8 border-t pt-6">
            <h2 className="text-xl font-bold mb-4">Editar Video</h2>
            <form onSubmit={handleUpdate} className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Título"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full py-3 px-4 text-sm border-2 border-gray-200 rounded-xl transition-all duration-200 outline-none focus:border-[#1E5ACD] focus:shadow-[0_0_0_4px_rgba(30,90,205,0.1)]"
                  maxLength={100}
                />
                <div className="text-right text-xs text-gray-500 mt-1">
                  {editTitle.length}/100 caracteres
                </div>
              </div>

              <div className="relative">
                <textarea
                  placeholder="Descripción"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full py-3 px-4 text-sm border-2 border-gray-200 rounded-xl transition-all duration-200 outline-none focus:border-[#1E5ACD] focus:shadow-[0_0_0_4px_rgba(30,90,205,0.1)]"
                  rows={2}
                  maxLength={255}
                />
                <div className="text-right text-xs text-gray-500 mt-1">
                  {editDescription.length}/255 caracteres
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setEditingVideo(null)}
                  className="w-1/2 border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-xl hover:bg-gray-100 transition-all duration-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-200"
                >
                  Actualizar
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhysioVideo;
