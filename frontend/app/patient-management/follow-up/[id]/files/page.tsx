"use client";

import { FormEvent, useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { getApiBaseUrl } from "@/utils/api";
import { UploadCloud, Edit2, Trash, ArrowLeft, Eye, Download, X } from "lucide-react";
import Alert from "@/components/ui/Alert";
import axios from "axios";

interface PatientFile {
  id: number;
  title: string;
  description: string;
  file_url: string;
  uploaded_at: string;
}

const TreatmentFilesPage = () => {
  const { id: treatmentId } = useParams();
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const [files, setFiles] = useState<PatientFile[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [editingFile, setEditingFile] = useState<PatientFile | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [alert, setAlert] = useState<{
    show: boolean;
    type: "success" | "error" | "info" | "warning";
    message: string;
  }>({
    show: false,
    type: "info",
    message: "",
  });

  const showAlert = (type: "success" | "error" | "info" | "warning", message: string) => {
    setAlert({
      show: true,
      type,
      message,
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

        if (response.data && response.data.user_role === "patient") {
          setIsAuthenticated(true);
        } else {
          console.log("User is not a patient, redirecting to not-found");
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
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const token = getAuthToken();
      try {
        const roleRes = await fetch(`${getApiBaseUrl()}/api/app_user/check-role/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const roleData = await roleRes.json();
        setUserRole(roleData.user_role);

        if (!["patient", "physio"].includes(roleData.user_role)) {
          setError("Solo pacientes o fisioterapeutas pueden acceder a esta página");
          setLoading(false);
          return;
        }

        const fileRes = await fetch(`${getApiBaseUrl()}/api/cloud/files/list-files/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!fileRes.ok) throw new Error("Error al obtener archivos");
        const filesData = await fileRes.json();
        setFiles(filesData);
      } catch (err) {
        setError("Hubo un error al cargar los archivos");
      } finally {
        setLoading(false);
      }
    };

    if (isClient) {
      fetchData();
    }
  }, [isClient]);

  const handleUpload = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validaciones
    if (!file && !editingFile) {
      showAlert("error", "Por favor selecciona un archivo.");
      return;
    }

    if (!title.trim()) {
      showAlert("error", "El título no puede estar vacío.");
      return;
    }

    // Validación de caracteres
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
    formData.append("treatment", treatmentId as string);

    try {
      const token = localStorage.getItem("token")!;
      const res = await fetch(
        `${getApiBaseUrl()}/api/cloud/files/${editingFile ? "update-file" : "create-files"}${
          editingFile ? `/${editingFile.id}` : ""
        }/`,
        {
          method: editingFile ? "PUT" : "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      // Verificar si la respuesta no es exitosa (status no 200)
      if (!res.ok) {
        const errorData = await res.json();  // Obtener el cuerpo de la respuesta de error
        const errorDetail = errorData?.detail;

        console.log("Error detail:", errorDetail);

        // Verificar si el error es por el límite de archivos alcanzado
        if (
          errorData?.status === 400 &&
          typeof errorDetail === "string" &&
          errorDetail.toLowerCase().includes("límite de archivos alcanzado")
        ) {
          showAlert(
            "error",
            "Has alcanzado el límite de archivos permitidos para este tratamiento. Elimina algunos archivos o contacta con el soporte."
          );
        } else {
          // Para otros errores generales
          showAlert("error", errorDetail || "Hubo un error al guardar el archivo.");
        }

        setLoading(false); // Detener carga
        return; // Detener ejecución
      }

      const data = await res.json();
      showAlert(
        "success",
        editingFile ? "Archivo actualizado correctamente." : "Archivo subido correctamente."
      );

      setLoading(false); // Detener carga
      setFiles((prev) =>
        editingFile ? prev.map((f) => (f.id === data.file.id ? data.file : f)) : [...prev, data.file]
      );
      setEditingFile(null);
      setTitle("");
      setDescription("");
      setFile(null);
      setFilePreview(null);

      if (fileInputRef.current) {
      fileInputRef.current.value = "";
      }
    } catch (err: any) {
      // Manejo de cualquier otro error inesperado
      console.error("Error inesperado:", err);
      showAlert("error", "Hubo un error inesperado al guardar el archivo.");
      setLoading(false); // Detener carga
    } finally {
      setLoading(false); // Asegurarse de detener el loading aunque falle
  }
  };

  const handleEdit = (file: PatientFile) => {
    setEditingFile(file);
    setTitle(file.title);
    setDescription(file.description);
  };

  const handlePreview = async (fileId: number, fileName: string) => {
    const token = getAuthToken();
    try {
      const response = await axios.get(`${getApiBaseUrl()}/api/cloud/files/view-file/${fileId}/`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });

      const contentType = response.headers["content-type"];
      const blob = new Blob([response.data], { type: contentType });
      const fileURL = URL.createObjectURL(blob);

      if (contentType.includes("pdf")) {
        setFilePreview(fileURL);
        setFileType("pdf");
      } else if (contentType.includes("image")) {
        setFilePreview(fileURL);
        setFileType("image");
      } else {
        setFilePreview(null);
        setFileType("other");
      }
    } catch (error) {
      showAlert("error", "No se pudo obtener el archivo para vista previa.");
    }
  };

  const handleDownload = async (fileId: number, fileName: string) => {
    const token = getAuthToken();
    try {
      const response = await axios.get(`${getApiBaseUrl()}/api/cloud/files/view-file/${fileId}/`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();

      showAlert("success", "Descarga iniciada correctamente.");
    } catch (error) {
      showAlert("error", "No se pudo descargar el archivo.");
    }
  };

  // Add state for delete confirmation for files
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    show: boolean;
    fileId: number | null;
  }>({
    show: false,
    fileId: null,
  });

  // Function to show delete confirmation for files
  const confirmDelete = (fileId: number) => {
    setDeleteConfirmation({
      show: true,
      fileId,
    });
  };

  // Function to cancel delete for files
  const cancelDelete = () => {
    setDeleteConfirmation({
      show: false,
      fileId: null,
    });
  };

  const handleDelete = async (fileId: number) => {
    const token = localStorage.getItem("token")!;
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/cloud/files/delete-file/${fileId}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Error al eliminar el archivo");

      setFiles(files.filter((file) => file.id !== fileId));
      showAlert("success", "Archivo eliminado correctamente.");

      // Close the delete confirmation modal
      setDeleteConfirmation({ show: false, fileId: null });
    } catch {
      showAlert("error", "Hubo un error al eliminar el archivo.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);

      const fileType = selectedFile.type.split('/')[0];
      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();

      if (fileType === 'image' || fileExtension === 'pdf') {
        const fileUrl = URL.createObjectURL(selectedFile);
        setPreviewFile(fileUrl);
      } else {
        setPreviewFile(null);
        showAlert("error", "Tipo de archivo no soportado. Por favor, sube una imagen o un PDF.");
      }
    }
  };

  if (!isClient) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-5" style={{ background: "rgb(238, 251, 250)" }}>
      <div
        className="bg-white w-full max-w-4xl rounded-3xl shadow-xl p-10 transition-all duration-300"
        style={{ boxShadow: "0 20px 60px rgba(0, 0, 0, 0.08)" }}
      >
        <button
          onClick={() => router.push(`/patient-management/follow-up/${treatmentId}`)}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 font-medium"
        >
          <ArrowLeft className="mr-2" size={20} />
          Volver al tratamiento
        </button>
        <div className="text-center mb-9">
          {alert.show && (
                      <Alert
                        type={alert.type}
                        message={alert.message}
                        onClose={() => setAlert({ ...alert, show: false })}
                      />
                    )}
          <h1
            className="text-3xl font-bold mb-2"
            style={{
              background: "linear-gradient(90deg, #1E5ACD, #3a6fd8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Archivos del Tratamiento
          </h1>
          <p className="text-gray-600">Lista de archivos relacionados con tu tratamiento</p>
        </div>

        {files.length > 0 && !loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {files.map((file) => (
              <div
                key={file.id}
                className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-4 transition-all duration-200 hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-semibold text-lg text-gray-800 mb-2 truncate">{file.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{file.description}</p>
                </div>
                <div className="flex flex-wrap gap-2">
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
            ))}
          </div>
        )}

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
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                className="w-full py-2 px-4 text-sm border-2 border-gray-200 rounded-xl transition-all duration-200 outline-none focus:border-[#1E5ACD] focus:shadow-[0_0_0_4px_rgba(30,90,205,0.1)]"
                required={!editingFile}
              />
              {previewFile ? (
                file?.type.includes("image") ? (
                  <img src={previewFile} alt="Vista previa" className="mt-2 max-h-60" />
                ) : file?.type === "application/pdf" ? (
                  <embed src={previewFile} type="application/pdf" width="100%" height="400px" />
                ) : null
              ) : (
                <p className="mt-2 text-sm text-gray-500">No preview available for this file type.</p>
              )}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-200 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (editingFile ? "Actualizando..." : "Subiendo...") : editingFile ? "Actualizar Archivo" : "Subir Archivo"}
          </button>
        </form>
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

      {filePreview && (
              <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 backdrop-blur-sm">
                  <div className="relative max-w-4xl w-full p-4">
                  <button onClick={() => setFilePreview(null)} className="absolute top-6 right-6 bg-gray-800 text-white hover:bg-gray-700 transition-all duration-200 flex items-center rounded-full p-2 shadow-lg">
                    <X size={24} />
                  </button>
      
                  {fileType === 'image' && <img src={filePreview} alt="Vista previa" className="max-w-full max-h-[80vh] mx-auto object-contain" />}
                  {fileType === 'pdf' && (
                    <iframe 
                      src={filePreview}
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

export default TreatmentFilesPage;