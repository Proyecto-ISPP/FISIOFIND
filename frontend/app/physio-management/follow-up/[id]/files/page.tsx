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
  const [editingFile, setEditingFile] = useState<any | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ show: boolean; fileId: string | null }>({
    show: false,
    fileId: null,
  });
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);

      const fileType = selectedFile.type.split('/')[0];
      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();

      if (fileType === 'image' || fileExtension === 'pdf') {
        const fileUrl = URL.createObjectURL(selectedFile);
        setFilePreview(fileUrl);
      } else {
        setFilePreview(null);
        showAlert("error", "Tipo de archivo no soportado. Por favor, sube una imagen o un PDF.");
      }
    }
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file && !editingFile) {
      showAlert("error", "Por favor selecciona un archivo.");
      return;
    }

    if (!title.trim()) {
      showAlert("error", "El título no puede estar vacío.");
      return;
    }

    if (title.length > 100) {
      showAlert("error", "El título no puede exceder los 100 caracteres.");
      return;
    }

    if (!description.trim()) {
      showAlert("error", "La descripción no puede estar vacía.");
      return;
    }

    if (description.length > 255) {
      showAlert("error", "La descripción no puede exceder los 255 caracteres.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (file) formData.append("files", file);
    formData.append("treatment", id);

    try {
      const token = getAuthToken();
      const res = await axios({
        method: editingFile ? "PUT" : "POST",
        url: `${getApiBaseUrl()}/api/cloud/files/${editingFile ? `update-file/${editingFile.id}` : "create-files"}/`,
        headers: { Authorization: `Bearer ${token}` },
        data: formData,
      });

      showAlert("success", editingFile ? "Archivo actualizado correctamente." : "Archivo subido correctamente.");
      setFiles((prev) => editingFile ? prev.map((f) => (f.id === res.data.file.id ? res.data.file : f)) : [...prev, res.data.file]);
      setEditingFile(null);
      setTitle("");
      setDescription("");
      setFile(null);
      setFilePreview(null);
    } catch (err) {
      showAlert("error", "Hubo un error al guardar el archivo.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (file: any) => {
    setEditingFile(file);
    setTitle(file.title);
    setDescription(file.description);
  };

  const confirmDelete = (fileId: string) => {
    setDeleteConfirmation({ show: true, fileId });
  };

  const cancelDelete = () => {
    setDeleteConfirmation({ show: false, fileId: null });
  };

  const handleDelete = async (fileId: string) => {
    const token = getAuthToken();
    try {
      await axios.delete(`${getApiBaseUrl()}/api/cloud/files/delete-file/${fileId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFiles((prev) => prev.filter((file) => file.id !== fileId));
      showAlert("success", "Archivo eliminado correctamente.");
      cancelDelete();
    } catch {
      showAlert("error", "Hubo un error al eliminar el archivo.");
    }
  };

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

        <form onSubmit={handleUpload}>
          <div className="relative">
            <input
              type="text"
              placeholder="Título"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full py-3 px-4 text-sm border-2 border-gray-200 rounded-xl transition-all duration-200 outline-none focus:border-[#1E5ACD] focus:shadow-[0_0_0_4px_rgba(30,90,205,0.1)]"
              maxLength={100}
            />
            <div className="text-right text-xs text-gray-500 mt-1">{title.length}/100 caracteres</div>
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
            <div className="text-right text-xs text-gray-500 mt-1">{description.length}/255 caracteres</div>
          </div>

          {!editingFile && (
            <div className="mb-4">
              <label htmlFor="file" className="block text-lg font-medium text-gray-700 mb-2">
                Seleccionar archivo
              </label>
              <input
                id="file"
                type="file"
                onChange={handleFileChange}
                className="w-full py-2 px-4 text-sm border-2 border-gray-200 rounded-xl transition-all duration-200 outline-none focus:border-[#1E5ACD] focus:shadow-[0_0_0_4px_rgba(30,90,205,0.1)]"
                required={!editingFile}
              />
              {filePreview && file?.type.includes('image') && (
                <img src={filePreview} alt="Vista previa" className="mt-2 max-h-60" onError={() => setFilePreview(null)} />
              )}
              {filePreview && file?.type === 'application/pdf' && (
                <embed src={filePreview} type="application/pdf" width="100%" height="400px" />
              )}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-200 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (editingFile ? "Actualizando..." : "Subiendo...") : (editingFile ? "Actualizar Archivo" : "Subir Archivo")}
          </button>
        </form>

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
                    <button
                      onClick={() => handleEdit(file)}
                      className="flex items-center gap-1 bg-yellow-500 text-white px-3 py-2 rounded-xl hover:bg-yellow-400 transition-all duration-200"
                      title="Editar"
                    >
                      <span className="text-sm">Editar</span>
                    </button>
                    <button
                      onClick={() => confirmDelete(file.id)}
                      className="flex items-center gap-1 bg-red-500 text-white px-3 py-2 rounded-xl hover:bg-red-400 transition-all duration-200"
                      title="Eliminar"
                    >
                      <span className="text-sm">Eliminar</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {deleteConfirmation.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h3 className="text-xl font-bold mb-4">Confirmar eliminación</h3>
            <p className="mb-6">¿Estás seguro de que deseas eliminar este archivo? Esta acción no se puede deshacer.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmation.fileId!)}
                className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

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
