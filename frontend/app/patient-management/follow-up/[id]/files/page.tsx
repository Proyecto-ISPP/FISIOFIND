"use client";

import { FormEvent, useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { getApiBaseUrl } from "@/utils/api";
import { UploadCloud, Edit2, Trash, ArrowLeft } from "lucide-react";
import Alert from "@/components/ui/Alert";

interface PatientFile {
  id: number;
  title: string;
  description: string;
  file_url: string;
  uploaded_at: string;
}

const TreatmentFilesPage = () => {
  const { id: treatmentId } = useParams();
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
  const fileInputRef = useRef<HTMLInputElement | null>(null);


  const [alert, setAlert] = useState<{
      show: boolean;
      type: "success" | "error" | "info" | "warning";
      message: string;
    }>( {
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

  const handleGoBack = () => {
    router.push("/patient-management/follow-up");
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Debe iniciar sesión para acceder a esta página");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
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

        const fileRes = await fetch(`${getApiBaseUrl()}/api/cloud/files/list-files/`, {
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

    fetchData();
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
      const res = await fetch(`${getApiBaseUrl()}/api/cloud/files/${editingFile ? 'update-file' : 'create-files'}${editingFile ? `/${editingFile.id}` : ''}/`, {
        method: editingFile ? "PUT" : "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error("Error al guardar el archivo");

      const data = await res.json();
      showAlert("success", editingFile ? "Archivo actualizado correctamente." : "Archivo subido correctamente.");
      setLoading(false);
      setFiles((prev) => editingFile ? prev.map(f => f.id === data.file.id ? data.file : f) : [...prev, data.file]);
      setEditingFile(null);
      setTitle("");
      setDescription("");
      setFile(null);
      setFilePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      showAlert("error", "Hubo un error al guardar el archivo.");
    }
  };

  const handleEdit = (file: PatientFile) => {
    setEditingFile(file);
    setTitle(file.title);
    setDescription(file.description);
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
  const file = e.target.files?.[0];
  if (file) {
    setFile(file);

    const fileUrl = URL.createObjectURL(file);
    setFilePreview(fileUrl);

    // Determinar el tipo de archivo
    const fileType = file.type.split('/')[0]; // 'image', 'application', etc.
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (fileType === 'image') {
      // Vista previa de imagen (jpg, png, etc.)
      setFilePreview(fileUrl);
    } else if (fileExtension === 'pdf') {
      // Vista previa de PDF
      setFilePreview(fileUrl);  // Simplemente usar el enlace del archivo PDF
    } else if (['doc', 'docx', 'xls', 'xlsx'].includes(fileExtension || '')) {
      // Vista previa de documentos (Word, Excel, etc.)
      setFilePreview('/path/to/icon-for-doc-file.svg'); // Usar un icono para el archivo
    }
  }
};

  if (!isClient) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-5" 
         style={{ background: "rgb(238, 251, 250)" }}>

      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-xl p-10 transition-all duration-300"
           style={{ boxShadow: "0 20px 60px rgba(0, 0, 0, 0.08)" }}>
        
        {/* Back to Treatment Button */}
        <button
          onClick={() => router.push(`/patient-management/follow-up/${treatmentId}`)}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 font-medium"
        >
          <ArrowLeft className="mr-2" size={20} />
          Volver al tratamiento
        </button>
      
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
                onClick={() => handleDelete(deleteConfirmation.fileId)}
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
            Archivos del Tratamiento
          </h1>
          <p className="text-gray-600">Administra los archivos de tu tratamiento.</p>
          <p className="text-gray-600">Recuerda que puedes adjuntar imágenes y archivos pdf.</p>
        </div>
  
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Archivos Subidos</h2>
  
          {loading ? (
            <p className="text-center">Cargando archivos...</p>
          ) : (
            <ul className="space-y-4">
              {files.map((file) => (
                <li key={file.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl shadow-md">
                  <div>
                    <h3 className="font-semibold">{file.title}</h3>
                    <p>{file.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(file)}
                      className="bg-[#05AC9C] text-white p-2 rounded-xl hover:bg-[#05918F] transition-all duration-200"
                      title="Editar archivo"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => confirmDelete(file.id)}
                      className="bg-red-500 text-white p-2 rounded-xl hover:bg-red-400 transition-all duration-200"
                      title="Eliminar archivo"
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
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
              
              {/* Aquí se gestionan las vistas previas */}
              {filePreview && file?.type.includes('image') && (
                <img src={filePreview} alt="Vista previa" className="mt-2 max-h-60" />
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
            <UploadCloud className="mr-2" size={18} />
            {loading ? (
              <>
                {editingFile ? "Actualizando..." : "Subiendo..."}
              </>
            ) : (
              <>
                {editingFile ? "Actualizar Archivo" : "Subir Archivo"}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
    </div>
  );
  
};

export default TreatmentFilesPage;