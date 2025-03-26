"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { getApiBaseUrl } from "@/utils/api";
import { Phone, Mail, MapPin, Calendar, FileText, Users, Camera, Save, Check, Lock } from 'lucide-react';
import { GradientButton } from "@/components/ui/gradient-button";

const BASE_URL = `${getApiBaseUrl()}`;

const getAuthToken = () => localStorage.getItem("token");

const PatientProfile = () => {
  const [profile, setProfile] = useState({
    user: {
      username: "",
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      postal_code: "",
      dni: "",
      photo: "",
      account_status: "",
    },
    gender: "",
    birth_date: "",
  });

  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingChanges, setPendingChanges] = useState({});
  const [oldPassword, setOldPassword] = useState(""); // State for old password

  useEffect(() => {
    setIsClient(true);
    const storedToken = getAuthToken();
    setToken(storedToken);
  }, []);
  
  useEffect(() => {
    if (isClient && token) {
      axios.get(`${getApiBaseUrl()}/api/app_user/check-role/`, {
        headers: { "Authorization": "Bearer " + token }
      })
        .then(response => {
          const role = response.data.user_role;
          if (role !== "patient") {
            location.href = "/permissions-error/";
          } else {
            fetchPatientProfile();
          }
        })
        .catch(error => {
          console.error("Error al obtener el rol del usuario:", error);
          location.href = "/permissions-error/";
        });
    }
  }, [token, isClient]);
  
  

  const fetchPatientProfile = async () => {
    setLoading(true);
    setErrors({});
    setSuccess("");

    try {
      if (!token) {
        setErrors({ general: "No hay token disponible." });
        return;
      }

      const response = await axios.get(`${getApiBaseUrl()}/api/app_user/current-user/`, {
        headers: { Authorization: "Bearer " + token },
      });

      console.log("Respuesta del backend:", response.data);

      const userData = response.data.patient || response.data.physio;

      if (!userData) {
        setErrors({ general: "Usuario no válido." });
        setLoading(false);
        return;
      }

      setProfile({
        user: {
          dni: userData.user_data.dni,
          first_name: userData.user_data.first_name,
          last_name: userData.user_data.last_name,
          email: userData.user_data.email,
          phone_number: userData.user_data.phone_number,
          photo: userData.user_data.photo,
          postal_code: userData.user_data.postal_code,
          username: userData.user_data.username,
          account_status: userData.user_data.account_status,
        },
        birth_date: userData.birth_date,
        gender: userData.gender
      });

    } catch (error) {
      console.error("Error al obtener el perfil:", error.response ? error.response.data : error);
      setErrors({ general: "Error obteniendo el perfil." });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((prevProfile) => {
      if (name === "gender" || name === "birth_date") {
        return { ...prevProfile, [name]: value };
      }
      return {
        ...prevProfile,
        user: {
          ...prevProfile.user,
          [name]: value,
        },
      };
    });
  };

  const handleSensitiveChange = (e) => {
    const { name, value } = e.target;

    setPendingChanges((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const confirmSensitiveChanges = async () => {
    if ('password' in pendingChanges && !oldPassword) {
      setErrors({ password: "Debes ingresar tu contraseña actual para actualizar la contraseña." });
      return;
    }

    setProfile((prevProfile) => ({
      ...prevProfile,
      user: {
        ...prevProfile.user,
        ...pendingChanges,
      },
    }));
    setPendingChanges({});
    setShowConfirmation(false);

    await submitProfileUpdate();
  };

  const cancelSensitiveChanges = () => {
    setPendingChanges({});
    setShowConfirmation(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create URL for preview
      const previewUrl = URL.createObjectURL(file);
      
      setProfile((prevProfile) => ({
        ...prevProfile,
        user: {
          ...prevProfile.user,
          photo: prevProfile.user.photo,
          photoFile: file,
          preview: previewUrl
        },
      }));
      
      setSelectedFile(file);
    }
  };

  const handleImageClick = () => {
    const fileInput = document.getElementById('file-input');
    if (fileInput) {
      fileInput.click();
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const today = new Date();
    const birthDate = new Date(profile.birth_date);

    if (!profile.user.username) newErrors.username = "El nombre de usuario es obligatorio";
    if (!profile.user.phone_number) newErrors.phone_number = "El teléfono es obligatorio";
    if (!profile.user.dni) newErrors.dni = "El DNI es obligatorio";
    if (!profile.user.email) newErrors.email = "El email es obligatorio";
    if (!profile.user.postal_code) newErrors.postal_code = "El código postal es obligatorio";
    if (!profile.gender) newErrors.gender = "El género es obligatorio";
    if (!profile.birth_date) newErrors.birth_date = "La fecha de nacimiento es obligatoria";

    if (profile.user.phone_number && profile.user.phone_number.length !== 9) {
      newErrors.phone_number = "El teléfono debe tener 9 dígitos";
    }

    if (profile.user.postal_code && profile.user.postal_code.length !== 5) {
      newErrors.postal_code = "El código postal debe tener 5 dígitos";
    }

    if (profile.birth_date && birthDate >= today) {
      newErrors.birth_date = "La fecha de nacimiento debe ser anterior a la fecha actual";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setErrors({});

    // Check if sensitive fields have been changed
    if (pendingChanges.dni || pendingChanges.password) {
      setShowConfirmation(true);
      return;
    }

    await submitProfileUpdate();
  };

  const submitProfileUpdate = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Verifica si hay token
    if (!token) {
      setErrors({ general: "No hay token disponible." });
      return;
    }

    try {
      const formData = new FormData();

      // Add user fields, including sensitive fields like DNI and password
      Object.entries(profile.user).forEach(([key, value]) => {
        if (value && key !== "photo" && key !== "photoFile" && key !== "preview") {
          formData.append(`user.${key}`, value);
        }
      });

      // Add pending changes for sensitive fields (DNI and password)
      if (pendingChanges.dni) {
        formData.append("user.dni", pendingChanges.dni);
      }
      if (pendingChanges.password) {
        formData.append("user.password", pendingChanges.password);
        formData.append("user.old_password", oldPassword); // Include old password
      }

      // Add patient fields
      formData.append("gender", profile.gender);
      formData.append("birth_date", profile.birth_date);

      // Add the photo if a file was selected
      if (selectedFile) {
        formData.append("user.photo", selectedFile);
      }

      // Realizar la solicitud de actualización
      const response = await axios.patch(`${getApiBaseUrl()}/api/app_user/profile/`, formData, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        setSuccess("Perfil actualizado correctamente");
        fetchPatientProfile(); // Recargar perfil automáticamente
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const data = error.response.data;
        let errorMessages = {};

        if (data.user) {
          if (data.user.phone_number) {
            errorMessages.phone_number = data.user.phone_number[0];
          }
          if (data.user.photo) {
            errorMessages.photo = data.user.photo[0];
          }
          if (data.user.username) {
            errorMessages.username = data.user.username[0];
          }
          if (data.user.email) {
            errorMessages.email = data.user.email[0];
          }
          if (data.user.dni) {
            errorMessages.dni = data.user.dni[0];
          }
          if (data.user.password) {
            errorMessages.password = data.user.password[0];
          }
          if (data.user.old_password) {
            errorMessages.old_password = data.user.old_password[0];
          }
        }

        setErrors(errorMessages);
      } else {
        setErrors({ general: "Error al actualizar el perfil." });
      }
    }
  };

  const getImageSrc = () => {
    // If there's a preview URL (user has uploaded a new image)
    if (profile.user.preview) {
      return profile.user.preview;
    }

    // If there's a photo from the backend
    if (profile?.user?.photo) {
        return `${getApiBaseUrl()}/api/app_user${profile.user.photo}`;
    }

    // Default avatar if no photo is available
    return "/default_avatar.png";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-5" 
           style={{ backgroundColor: "rgb(238, 251, 250)" }}>
        <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md text-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="rounded-full bg-gray-200 h-32 w-32 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl font-semibold text-gray-600 animate-pulse">Cargando perfil...</p>
      </div>
    );
  return (
    <div className="min-h-screen flex items-center justify-center p-5" 
         style={{ backgroundColor: "rgb(238, 251, 250)" }}>
      
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-xl overflow-hidden"
           style={{ boxShadow: "0 20px 60px rgba(0, 0, 0, 0.08)" }}>
        
        <div className="flex flex-col md:flex-row">
          {/* Left sidebar with photo and user info */}
          <div className="bg-gradient-to-b from-[#1E5ACD] to-[#3a6fd8] p-8 md:w-1/3 flex flex-col items-center justify-start text-white">
            <div className="relative mb-6 mt-4">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <img 
                  src={getImageSrc()} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              <label htmlFor="file-input" className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md cursor-pointer text-[#1E5ACD] hover:bg-gray-100 transition-all duration-200">
                <Camera size={20} />
              </label>
              <input 
                id="file-input" 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                className="hidden"
              />
            </div>
            
            <h2 className="text-xl font-bold mb-1">{profile.user.username}</h2>
            <p className="text-blue-100 mb-6">Paciente</p>
            
            <div className="w-full space-y-4">
              <div className="flex items-center">
                <Mail size={16} className="mr-2 opacity-70" />
                <p className="text-sm truncate">{profile.user.email}</p>
              </div>
              <div className="flex items-center">
                <Phone size={16} className="mr-2 opacity-70" />
                <p className="text-sm">{profile.user.phone_number}</p>
              </div>
              <div className="flex items-center">
                <FileText size={16} className="mr-2 opacity-70" />
                <p className="text-sm">DNI: {profile.user.dni}</p>
              </div>
            </div>
          </div>
          
          {/* Right side with form */}
          <div className="p-8 md:w-2/3">
            <h1 className="text-2xl font-bold mb-6"
                style={{ 
                  background: "linear-gradient(90deg, #1E5ACD, #3a6fd8)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}>
              Perfil del Paciente
            </h1>
            
            {success && (
              <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center">
                <Check size={18} className="mr-2" />
                {success}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={profile.user.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-xl transition-all duration-200 outline-none focus:border-[#1E5ACD] focus:shadow-[0_0_0_4px_rgba(30,90,205,0.1)]"
                  />
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Phone size={18} />
                    </div>
                    <input
                      type="text"
                      name="phone_number"
                      value={profile.user.phone_number}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-xl transition-all duration-200 outline-none focus:border-[#1E5ACD] focus:shadow-[0_0_0_4px_rgba(30,90,205,0.1)]"
                    />
                  </div>
                  {errors.phone_number && <p className="mt-1 text-sm text-red-600">{errors.phone_number}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Código Postal</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <MapPin size={18} />
                    </div>
                    <input
                      type="text"
                      name="postal_code"
                      value={profile.user.postal_code}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-xl transition-all duration-200 outline-none focus:border-[#1E5ACD] focus:shadow-[0_0_0_4px_rgba(30,90,205,0.1)]"
                    />
                  </div>
                  {errors.postal_code && <p className="mt-1 text-sm text-red-600">{errors.postal_code}</p>}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Calendar size={18} />
                    </div>
                    <input
                      type="date"
                      name="birth_date"
                      value={profile.birth_date}
                      disabled={true}
                      className="w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-xl transition-all duration-200 outline-none bg-gray-50 text-gray-500"
                    />
                  </div>
                  {errors.birth_date && <p className="mt-1 text-sm text-red-600">{errors.birth_date}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Género</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Users size={18} />
                    </div>
                    <select
                      name="gender"
                      value={profile.gender}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-xl transition-all duration-200 outline-none focus:border-[#1E5ACD] focus:shadow-[0_0_0_4px_rgba(30,90,205,0.1)] appearance-none bg-white"
                    >
                      <option value="">Selecciona una opción</option>
                      <option value="M">Masculino</option>
                      <option value="F">Femenino</option>
                      <option value="O">Otro</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">DNI</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <FileText size={18} />
                  </div>
                  <input
                    type="text"
                    name="dni"
                    value={pendingChanges.dni || profile.user.dni}
                    onChange={handleSensitiveChange}
                    className="w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-xl transition-all duration-200 outline-none focus:border-[#1E5ACD] focus:shadow-[0_0_0_4px_rgba(30,90,205,0.1)]"
                  />
                </div>
                {errors.dni && <p className="mt-1 text-sm text-red-600">{errors.dni}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={pendingChanges.password || "******"}
                    onChange={handleSensitiveChange}
                    className="w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-xl transition-all duration-200 outline-none focus:border-[#1E5ACD] focus:shadow-[0_0_0_4px_rgba(30,90,205,0.1)]"
                  />
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              </div>

              {/* Confirmation Modal */}
              {showConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
                    <h2 className="text-lg font-bold mb-4">Confirmar Cambios</h2>
                    <p className="text-sm text-gray-600 mb-6">
                      Estás a punto de cambiar información sensible (DNI o contraseña). Si estás cambiando tu contraseña, ingresa tu contraseña actual.
                    </p>
                    {pendingChanges.password && (
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña Actual</label>
                        <input
                          type="password"
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl outline-none focus:border-[#1E5ACD] focus:shadow-[0_0_0_4px_rgba(30,90,205,0.1)]"
                        />
                        {errors.old_password && <p className="mt-1 text-sm text-red-600">{errors.old_password}</p>}
                      </div>
                    )}
                    <div className="flex justify-end space-x-4">
                      <GradientButton
                        variant="grey"
                        onClick={() => {
                          setShowConfirmation(false);
                          cancelSensitiveChanges();
                        }}
                      >
                        Cancelar
                      </GradientButton>
                      <GradientButton
                        variant="danger"
                        onClick={confirmSensitiveChanges}
                      >
                        Confirmar
                      </GradientButton>
                    </div>
                  </div>
                </div>
              )}

              <GradientButton
                variant="edit"
                className="mt-8 w-full py-4 px-6 bg-gradient-to-r from-[#1E5ACD] to-[#3a6fd8] text-white font-semibold rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-center"
              >
                <Save size={18} className="mr-2" />
                Actualizar Perfil
              </GradientButton>
            </form>
          </div>
        </div>
      </div>
      {success && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          <p>{success}</p>
        </div>
      )}
    </div>
  );
};

export default PatientProfile;