"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { getApiBaseUrl } from "@/utils/api";
import { useRouter } from "next/navigation";
import { UploadCloud, Edit2, Trash2 } from "lucide-react";

const getAuthToken = () => {
  return localStorage.getItem("token");
};

const UploadVideo = () => {
  const router = useRouter();
  const [file, setFileKey] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [patients, setPatients] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [videos, setVideos] = useState([]);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

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

        if (response.data && response.data.user_role === "physiotherapist") {
          setIsAuthenticated(true);
        } else {
          console.log("User is not a physiotherapist, redirecting to not-found");
          router.push("/not-found");
        }
      } catch (error) {
        console.error("Error checking user role:", error);
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
  }, [router]);

  // Only fetch videos if user is authenticated and is a physio
  useEffect(() => {
    if (!isAuthenticated || isAuthChecking) return;

    const fetchPhysioVideos = async () => {
      const storedToken = getAuthToken();
      if (!storedToken) {
        setMessage("Error: No hay token de autenticación.");
        return;
      }

      setLoadingVideos(true);
      setMessage("");

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
        if (error.response?.status === 401) {
          setMessage("❌ Sesión expirada. Por favor, inicia sesión nuevamente.");
          router.push("/login");
        } else {
          setMessage("❌ Error al obtener los videos.");
        }
        console.error("⚠️ Error al obtener los videos:", error);
      } finally {
        setLoadingVideos(false);
      }
    };

    fetchPhysioVideos();
  }, [isAuthenticated, isAuthChecking, router]);

  const handleFileChange = (event) => {
    setFileKey(event.target.files[0]);
  };

  const handlePatientsChange = (event) => {
    setPatients(event.target.value);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("❌ Por favor selecciona un archivo.");
      setTimeout(() => setMessage(""), 5000);
      return;
    }

    if (!title.trim()) {
      setMessage("❌ El título no puede estar vacío.");
      setTimeout(() => setMessage(""), 5000);
      return;
    }

    if (!description.trim()) {
      setMessage("❌ La descripción no puede estar vacía.");
      setTimeout(() => setMessage(""), 5000);
      return;
    }

    const storedToken = getAuthToken();
    if (!storedToken) {
      setMessage("Error: No hay token de autenticación.");
      setTimeout(() => setMessage(""), 5000);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const patientEmails = patients
      .split(",")
      .map((email) => email.trim())
      .filter((email) => emailRegex.test(email));
    
    if (patientEmails.length === 0) {
      setMessage("Debes ingresar al menos un email de paciente válido.");
      setTimeout(() => setMessage(""), 5000);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    
    // Format patients as the backend expects - as a JSON string
    formData.append("patients", JSON.stringify(patientEmails));

    // Debug what's being sent
    console.log("Sending data to server:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(
        `${getApiBaseUrl()}/api/app_user/videos/upload/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );

      // Reset form fields after successful upload
      setFileKey(null);
      setTitle("");
      setDescription("");
      setPatients("");
      
      // Refresh the video list
      const updatedVideosResponse = await axios.get(
        `${getApiBaseUrl()}/api/app_user/videos/list-my-videos/`, 
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );
      
      if (updatedVideosResponse.data && Array.isArray(updatedVideosResponse.data)) {
        setVideos(updatedVideosResponse.data);
      }

      setMessage("✅ Video subido correctamente.");
      setTimeout(() => setMessage(""), 5000);
    } catch (error) {
      //console.log("Error details:", error.response?.data);
      
      if (
        error.response &&
        error.response.data &&
        error.response.data.errorManaged
      ) {
        alert(error.response.data.errorManaged);
      } else {
        if (error.response?.status === 401) {
          setMessage("❌ Sesión expirada. Por favor, inicia sesión nuevamente.");
        } else {
          const errorMessage =
            error.response?.data?.detail ||
            error.response?.data ||
            error.message ||
            "Error desconocido al subir el video.";
  
          setMessage(`❌ ${errorMessage}`);
        }
      }

      setTimeout(() => setMessage(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  // Other handlers remain the same
  const handleDelete = async (videoId) => {
    setVideoToDelete(videoId);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    // Delete logic remains the same
    // ...
    const storedToken = getAuthToken();
    if (!storedToken) {
      setMessage("Error: No hay token de autenticación.");
      setTimeout(() => setMessage(""), 5000);
      return;
    }

    setMessage("");

    try {
      await axios.delete(`${getApiBaseUrl()}/api/app_user/videos/delete/${videoToDelete}/`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      setMessage("✅ Video eliminado correctamente.");
      setTimeout(() => setMessage(""), 5000);
      setVideos(videos.filter((video) => video.id !== videoToDelete));
      setShowModal(false);
    } catch (error) {
      // Error handling remains the same
      // ...
      if (error.response?.status === 401) {
        setMessage("❌ Sesión expirada. Por favor, inicia sesión nuevamente.");
      } else {
        setMessage("❌ Error al eliminar el video.");
      }
      setTimeout(() => setMessage(""), 5000);
    }
  };

  const handleCancelDelete = () => {
    setShowModal(false);
  };

  const [editingVideo, setEditingVideo] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPatients, setEditPatients] = useState("");

  const handleEdit = (video) => {
    setEditingVideo(video.id);
    setEditTitle(video.title);
    setEditDescription(video.description);
    setEditPatients(video.patients ? video.patients.join(", ") : "");
  };

  const handleUpdate = async (videoId) => {
    const storedToken = getAuthToken();
    if (!storedToken) {
      setMessage("Error: No hay token de autenticación.");
      setTimeout(() => setMessage(""), 5000);
      return;
    }

    // Parse patient IDs
    const patientEmails = editPatients
      .split(",")
      .map((id) => parseInt(id.trim(), 10))
      .filter((id) => !isNaN(id));

    try {
      const response = await axios.put(
        `${getApiBaseUrl()}/api/app_user/videos/update-video/${videoId}/`,
        {
          title: editTitle,
          description: editDescription,
          patients: patientEmails, // Send as array, backend will handle it
        },
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      setMessage("✅ Video actualizado correctamente.");
      setTimeout(() => setMessage(""), 5000);
      
      // Update the videos list with the updated video
      setVideos((prevVideos) =>
        prevVideos.map((video) =>
          video.id === videoId
            ? { ...video, title: editTitle, description: editDescription, patients: patientEmails }
            : video
        )
      );
      setEditingVideo(null);
      
      // Refresh the video list to ensure we have the latest data
      const updatedVideosResponse = await axios.get(
        `${getApiBaseUrl()}/api/app_user/videos/list-my-videos/`, 
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );
      
      if (updatedVideosResponse.data && Array.isArray(updatedVideosResponse.data)) {
        setVideos(updatedVideosResponse.data);
      }
    } catch (error) {
      console.error("Error updating video:", error.response?.data || error);
      setMessage("❌ Error al actualizar el video.");
      setTimeout(() => setMessage(""), 5000);
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

  // Updated UI with new background color
  return (
    <div className="min-h-screen flex items-center justify-center p-5" 
         style={{ background: "rgb(238, 251, 250)" }}>
      
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-xl p-10 transition-all duration-300"
           style={{ boxShadow: "0 20px 60px rgba(0, 0, 0, 0.08)" }}>
        
        <div className="text-center mb-9">
          <h1 className="text-3xl font-bold mb-2"
              style={{ 
                background: "linear-gradient(90deg, #1E5ACD, #3a6fd8)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>
            {editingVideo ? "Editar Video" : "Gestión de Videos"}
          </h1>
          <p className="text-gray-600">
            {editingVideo 
              ? "Actualiza la información de tu video" 
              : "Sube y administra videos para tus pacientes"}
          </p>
        </div>
        
        <div className="mb-8">
          {editingVideo ? (
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Nuevo Título"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full py-[14px] px-5 text-base border-2 border-gray-200 rounded-xl transition-all duration-200 outline-none focus:border-[#1E5ACD] focus:shadow-[0_0_0_4px_rgba(30,90,205,0.1)]"
                />
              </div>
              
              <div className="relative">
                <textarea
                  placeholder="Nueva Descripción"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full py-[14px] px-5 text-base border-2 border-gray-200 rounded-xl transition-all duration-200 outline-none focus:border-[#1E5ACD] focus:shadow-[0_0_0_4px_rgba(30,90,205,0.1)]"
                  rows={3}
                />
              </div>
              
              <div className="relative">
                <input
                  type="text"
                  placeholder="IDs de pacientes (separados por coma)"
                  value={editPatients}
                  onChange={(e) => setEditPatients(e.target.value)}
                  className="w-full py-[14px] px-5 text-base border-2 border-gray-200 rounded-xl transition-all duration-200 outline-none focus:border-[#1E5ACD] focus:shadow-[0_0_0_4px_rgba(30,90,205,0.1)]"
                />
              </div>
              
              <button
                onClick={() => handleUpdate(editingVideo)}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center"
              >
                <Edit2 className="mr-2" size={20} />
                Actualizar Video
              </button>
              
              <button
                onClick={() => setEditingVideo(null)}
                className="w-full bg-gray-100 text-gray-700 hover:bg-gray-200 font-semibold py-3 px-6 rounded-xl transition-all duration-200"
              >
                Cancelar
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="w-full py-[14px] px-5 text-base border-2 border-gray-200 rounded-xl transition-all duration-200 outline-none focus:border-[#1E5ACD] focus:shadow-[0_0_0_4px_rgba(30,90,205,0.1)]"
                  // Add a key to force re-render when file is reset
                  key={file ? "has-file" : "no-file"}
                />
              </div>
              
              <div className="relative">
                <input
                  type="text"
                  placeholder="Título del video"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full py-[14px] px-5 text-base border-2 border-gray-200 rounded-xl transition-all duration-200 outline-none focus:border-[#1E5ACD] focus:shadow-[0_0_0_4px_rgba(30,90,205,0.1)]"
                />
              </div>
              
              <div className="relative">
                <textarea
                  placeholder="Descripción del video"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full py-[14px] px-5 text-base border-2 border-gray-200 rounded-xl transition-all duration-200 outline-none focus:border-[#1E5ACD] focus:shadow-[0_0_0_4px_rgba(30,90,205,0.1)]"
                  rows={3}
                />
              </div>
              
              <div className="relative">
                <input
                  type="text"
                  placeholder="IDs de pacientes (separados por coma)"
                  value={patients}
                  onChange={handlePatientsChange}
                  className="w-full py-[14px] px-5 text-base border-2 border-gray-200 rounded-xl transition-all duration-200 outline-none focus:border-[#1E5ACD] focus:shadow-[0_0_0_4px_rgba(30,90,205,0.1)]"
                />
              </div>
              
              <button
                onClick={handleUpload}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center"
              >
                <UploadCloud className="mr-2" size={20} />
                {loading ? "Subiendo..." : "Subir Video"}
              </button>
            </div>
          )}
          
          {message && (
            <div
              className={`mt-4 p-4 rounded-xl text-center ${
                message.includes("❌") 
                  ? "bg-red-50 text-red-600 border border-red-100" 
                  : "bg-green-50 text-green-600 border border-green-100"
              }`}
            >
              {message}
            </div>
          )}
        </div>
        
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4"
              style={{ 
                background: "linear-gradient(90deg, #05AC9C, #05918F)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>
            Mis Videos
          </h2>
          
          {loadingVideos ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1E5ACD]"></div>
            </div>
          ) : videos.length > 0 ? (
            <div className="space-y-4">
              {videos.map((video) => (
                <div 
                  key={video.id} 
                  className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-4 transition-all duration-200 hover:shadow-md"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-gray-800">{video.title}</h4>
                      <p className="text-gray-600 text-sm mt-1">{video.description}</p>
                      {video.patients && video.patients.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {video.patients.map((patientId) => (
                            <span 
                              key={patientId} 
                              className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
                            >
                              Paciente #{patientId}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(video)}
                        className="bg-[#05AC9C] text-white p-2 rounded-xl hover:bg-[#05918F] transition-all duration-200"
                        title="Editar video"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(video.id)}
                        className="bg-red-500 text-white p-2 rounded-xl hover:bg-red-600 transition-all duration-200"
                        title="Eliminar video"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-2xl border-2 border-gray-200">
              <p className="text-gray-500">No tienes videos subidos aún.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-3xl shadow-xl max-w-sm w-full transition-all duration-300"
               style={{ boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)" }}>
            <h3 className="text-xl font-bold mb-4"
                style={{ 
                  background: "linear-gradient(90deg, #1E5ACD, #3a6fd8)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}>
              ¿Estás seguro?
            </h3>
            <p className="mb-6 text-gray-700">Esta acción eliminará permanentemente el video y no podrá ser recuperado.</p>
            <div className="flex gap-4">
              <button
                onClick={handleCancelDelete}
                className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 py-3 px-6 rounded-xl transition-all duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-6 rounded-xl transition-all duration-200"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadVideo;
