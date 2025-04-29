"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Phone,
  Mail,
  MapPin,
  Calendar,
  FileText,
  Users,
  Camera,
  Save,
  Check,
  Plus,
  Lock,
  Bell,
  Trash2,
  Film,
} from "lucide-react";
import { GradientButton } from "@/components/ui/gradient-button";
import Link from "next/link";
import Alert from "@/components/ui/Alert";
import UpdatePasswordModal from "@/components/user-update-password-modal";
import SubscriptionSlider from "@/components/ui/SubscriptionSlider";
import ConfirmModal from "@/components/ui/ConfirmModal";

const getApiBaseUrl = () => process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
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

  const [showUpdatePasswordModal, setShowUpdatePasswordModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formErrors, setFormErrors] = useState({});
  const [isClient, setIsClient] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isDeletionEmailSent, setIsDeletionEmailSent] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const [alert, setAlert] = useState<{
    show: boolean;
    type: "success" | "error" | "info" | "warning";
    message: string;
  }>({
    show: false,
    type: "info",
    message: "",
  });

  const showAlert = (
    type: "success" | "error" | "info" | "warning",
    message: string
  ) => {
    setAlert({
      show: true,
      type,
      message,
    });
  };

  useEffect(() => {
    setIsClient(true);
    const storedToken = getAuthToken();
    setToken(storedToken);
  }, []);

  useEffect(() => {
    if (isClient && token) {
      axios
        .get(`${getApiBaseUrl()}/api/app_user/check-role/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const role = response.data.user_role;
          if (role !== "patient") {
            location.href = "/permissions-error/";
          } else {
            fetchPatientProfile();
          }
        })
        .catch((error) => {
          console.error("Error al obtener el rol del usuario:", error);
          location.href = "/permissions-error/";
        });
    }
  }, [token, isClient]);

  const fetchPatientProfile = async () => {
    setLoading(true);
    setFormErrors({});

    try {
      if (!token) {
        setFormErrors({ general: "No hay token disponible." });
        return;
      }

      const response = await axios.get(
        `${getApiBaseUrl()}/api/app_user/current-user/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const userData = response.data.patient || response.data.physio;

      if (!userData) {
        setFormErrors({ general: "Usuario no válido." });
        setLoading(false);
        return;
      }

      setProfile({
        user: {
          dni: userData.user_data.dni,
          first_name: userData.user_data.first_name,
          last_name: userData.user_data.last_name,
          email: userData.user_data.email,
          phone_number: userData.user_data.phone_number ?? "",
          photo: userData.user_data.photo,
          postal_code: userData.user_data.postal_code,
          username: userData.user_data.username,
          account_status: userData.user_data.account_status,
        },
        birth_date: userData.birth_date,
        gender: userData.gender,
      });
    } catch (error) {
      console.error(
        "Error al obtener el perfil:",
        error.response ? error.response.data : error
      );
      setFormErrors({ general: "Error obteniendo el perfil." });
    } finally {
      setLoading(false);
    }
  };

  const validateField = (name, value) => {
    let error = "";
    const today = new Date();
    const birthDate = new Date(value);

    switch (name) {
      case "username":
        if (!value) error = "El nombre de usuario es obligatorio.";
        break;
      case "email":
        if (!value) error = "El email es obligatorio.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          error = "Formato de email inválido.";
        break;
      case "phone_number":
        if (value && value.length !== 9) error = "El teléfono debe tener 9 dígitos.";
        break;
      case "postal_code":
        if (!value) error = "El código postal es obligatorio.";
        else if (value.length !== 5) error = "El código postal debe tener 5 dígitos.";
        break;
      case "gender":
        if (!value) error = "El género es obligatorio.";
        break;
      case "birth_date":
        if (!value) error = "La fecha de nacimiento es obligatoria.";
        else if (birthDate >= today)
          error = "La fecha de nacimiento debe ser anterior a la fecha actual.";
        break;
    }

    setFormErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
    return error === "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    validateField(name, value);

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ photo: 'Las imágenes no pueden superar los 5MB' });
        showAlert("error", "Las imágenes no pueden superar los 5MB");
        return;
      }

      // Validate file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!validTypes.includes(file.type)) {
        setErrors({ photo: 'Solo imágenes en formato JPG, JPEG o PNG son permitidos' });
        showAlert("error", 'Solo imágenes en formato JPG, JPEG o PNG son permitidos');
        return;
      }

      const previewUrl = URL.createObjectURL(file);

      setProfile((prevProfile) => ({
        ...prevProfile,
        user: {
          ...prevProfile.user,
          photo: prevProfile.user.photo,
          photoFile: file,
          preview: previewUrl,
        },
      }));

      setSelectedFile(file);
      setFormErrors({});
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = [
      "username",
      "email",
      "postal_code",
      "gender",
      "birth_date",
    ].every((field) =>
      validateField(
        field,
        field === "birth_date" || field === "gender"
          ? profile[field]
          : profile.user[field] || ""
      )
    );

    if (!isValid) {
      showAlert("error", "Por favor, corrige los errores antes de enviar.");
      return;
    }

    try {
      if (!token) {
        setFormErrors({ general: "No hay token disponible." });
        return;
      }

      const formData = new FormData();
      Object.entries(profile.user).forEach(([key, value]) => {
        if (
          key !== "photo" &&
          key !== "photoFile" &&
          key !== "preview" &&
          key !== "dni" &&
          key !== "account_status"
        ) {
          formData.append(`user.${key}`, value || "");
        }
      });

      formData.append("gender", profile.gender);
      formData.append("birth_date", profile.birth_date);

      if (selectedFile) {
        formData.append("user.photo", selectedFile);
      }

      const response = await axios.patch(
        `${getApiBaseUrl()}/api/app_user/profile/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        showAlert("success", "Perfil actualizado correctamente");
        fetchPatientProfile();
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
        }

        setFormErrors(errorMessages);
        showAlert("error", "Error al actualizar el perfil.");
      } else {
        setFormErrors({ general: "Error al actualizar el perfil." });
        showAlert("error", "Error al actualizar el perfil.");
      }
    }
  };

  const changePasswordSendToApi = async (
    oldPassword: string,
    newPassword: string
  ): Promise<number | null> => {
    try {
      const passwordsForBackend = {
        old_password: oldPassword,
        new_password: newPassword,
      };

      const response = await axios.post(
        `${getApiBaseUrl()}/api/app_user/change_password/`,
        passwordsForBackend,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowUpdatePasswordModal(false);
      showAlert("success", "Contraseña actualizada correctamente");
      return response.data;
    } catch (error) {
      console.log("Error al cambiar la contraseña:", error);
      if (axios.isAxiosError(error) && error.response) {
        console.log("Respuesta de error del backend:", error.response.data);
        if (error.response.data.detail) {
          showAlert("error", `${error.response.data.detail}`);
        }
      } else {
        showAlert("error", "Error al cambiar contraseña.");
      }
      return null;
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await axios.post(
        `${getApiBaseUrl()}/api/app_user/account/delete/request/`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setIsDeletionEmailSent(true);
      setShowDeleteConfirmation(false);
    } catch (error) {
      console.error("Delete account error:", error.response?.data || error);
      setFormErrors({
        delete:
          error.response?.data?.error ||
          "Error al procesar la solicitud de eliminación de cuenta.",
      });
      showAlert(
        "error",
        "Error al procesar la solicitud de eliminación de cuenta."
      );
    }
  };

  const getImageSrc = () => {
    if (profile.user.preview) {
      return profile.user.preview;
    }
    if (profile?.user?.photo) {
      return `${getApiBaseUrl()}${profile.user.photo}`;
    }
    return "/default_avatar.png";
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-5"
        style={{ backgroundColor: "rgb(238, 251, 250)" }}
      >
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with decorative elements */}
        <div className="relative mb-8">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

          <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-600">
              Perfil del Paciente
            </span>
          </h1>
          <p className="text-center text-gray-500 text-lg max-w-2xl mx-auto mb-8">
            Gestiona tu información personal y preferencias
          </p>
        </div>

        {alert.show && (
          <div className="mb-6">
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert({ ...alert, show: false })}
              duration={5000}
            />
          </div>
        )}

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Profile photo and basic info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
              <div className="px-6 py-8 bg-gradient-to-r from-teal-500 to-blue-600">
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                      <img
                        src={getImageSrc()}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <label
                      htmlFor="photo-upload"
                      className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <Camera size={18} className="text-gray-700" />
                      <input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                </div>
                <h2 className="text-white text-xl font-bold text-center mt-4">
                  {profile.user.first_name} {profile.user.last_name}
                </h2>
                <p className="text-teal-100 text-center">Paciente</p>
              </div>

              {/* Profile information section */}
              <div className="p-6">
                <div className="space-y-4">
                  {/* Contact information */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                      Información de contacto
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <Mail size={16} className="text-gray-500 mr-2 mt-1" />
                        <span className="text-gray-800 text-sm">
                          {profile.user.email}
                        </span>
                      </li>
                      <li className="flex items-start">
                        <Phone size={16} className="text-gray-500 mr-2 mt-1" />
                        <span className="text-gray-800 text-sm">
                          {profile.user.phone_number || "No especificado"}
                        </span>
                      </li>
                      <li className="flex items-start">
                        <MapPin size={16} className="text-gray-500 mr-2 mt-1" />
                        <span className="text-gray-800 text-sm">
                          {profile.user.postal_code || "No especificado"}
                        </span>
                      </li>
                    </ul>
                  </div>

                  {/* Personal information */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                      Información personal
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <FileText
                          size={16}
                          className="text-gray-500 mr-2 mt-1"
                        />
                        <span className="text-gray-800 text-sm">
                          DNI: {profile.user.dni || "No especificado"}
                        </span>
                      </li>
                      <li className="flex items-start">
                        <Calendar
                          size={16}
                          className="text-gray-500 mr-2 mt-1"
                        />
                        <span className="text-gray-800 text-sm">
                          {profile.birth_date || "No especificado"}
                        </span>
                      </li>
                      <li className="flex items-start">
                        <Users size={16} className="text-gray-500 mr-2 mt-1" />
                        <span className="text-gray-800 text-sm">
                          {profile.gender === "M"
                            ? "Masculino"
                            : profile.gender === "F"
                            ? "Femenino"
                            : profile.gender === "O"
                            ? "Otro"
                            : "No especificado"}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Notification preferences */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
              <div className="px-6 py-4 bg-gradient-to-r from-teal-500 to-blue-600">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <Bell className="mr-2" size={20} />
                  Notificaciones
                </h2>
              </div>

              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  Configura si deseas recibir notificaciones sobre tus citas y
                  actualizaciones.
                </p>
                <SubscriptionSlider />
              </div>
            </div>
          </div>

          {/* Right column - Form section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
              <div className="px-6 py-4 bg-gradient-to-r from-teal-500 to-blue-600">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <Users className="mr-2" size={20} />
                  Información Personal
                </h2>
              </div>

              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Contact information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre de usuario
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="username"
                          value={profile.user.username}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border-2 ${
                            formErrors.username
                              ? "border-red-500"
                              : "border-gray-200"
                          } rounded-xl transition-all duration-200 outline-none focus:border-blue-500`}
                        />
                      </div>
                      {formErrors.username && (
                        <p className="mt-1 text-sm text-red-600">
                          {formErrors.username}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Correo Electrónico
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          <Mail size={18} />
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={profile.user.email}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-3 py-3 border-2 ${
                            formErrors.email
                              ? "border-red-500"
                              : "border-gray-200"
                          } rounded-xl transition-all duration-200 outline-none focus:border-blue-500`}
                        />
                      </div>
                      {formErrors.email && (
                        <p className="mt-1 text-sm text-red-600">
                          {formErrors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Teléfono (opcional)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          <Phone size={18} />
                        </div>
                        <input
                          type="text"
                          name="phone_number"
                          value={profile.user.phone_number}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-3 py-3 border-2 ${
                            formErrors.phone_number
                              ? "border-red-500"
                              : "border-gray-200"
                          } rounded-xl transition-all duration-200 outline-none focus:border-blue-500`}
                        />
                      </div>
                      {formErrors.phone_number && (
                        <p className="mt-1 text-sm text-red-600">
                          {formErrors.phone_number}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Código Postal
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          <MapPin size={18} />
                        </div>
                        <input
                          type="text"
                          name="postal_code"
                          value={profile.user.postal_code}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-3 py-3 border-2 ${
                            formErrors.postal_code
                              ? "border-red-500"
                              : "border-gray-200"
                          } rounded-xl transition-all duration-200 outline-none focus:border-blue-500`}
                        />
                      </div>
                      {formErrors.postal_code && (
                        <p className="mt-1 text-sm text-red-600">
                          {formErrors.postal_code}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha de Nacimiento
                      </label>
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
                      {formErrors.birth_date && (
                        <p className="mt-1 text-sm text-red-600">
                          {formErrors.birth_date}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Género
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          <Users size={18} />
                        </div>
                        <select
                          name="gender"
                          value={profile.gender}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-3 py-3 border-2 ${
                            formErrors.gender
                              ? "border-red-500"
                              : "border-gray-200"
                          } rounded-xl transition-all duration-200 outline-none focus:border-blue-500 appearance-none bg-white`}
                        >
                          <option value="">Selecciona una opción</option>
                          <option value="M">Masculino</option>
                          <option value="F">Femenino</option>
                          <option value="O">Otro</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                          <svg
                            className="h-5 w-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                      {formErrors.gender && (
                        <p className="mt-1 text-sm text-red-600">
                          {formErrors.gender}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      DNI
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <FileText size={18} />
                      </div>
                      <input
                        disabled
                        type="text"
                        name="dni"
                        value={profile.user.dni}
                        className="w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-xl transition-all duration-200 outline-none bg-gray-50 text-gray-500"
                      />
                    </div>
                  </div>

                  {/* Password section */}
                  <div className="py-2 flex items-center justify-start w-full gap-3">
                    <div className="relative w-[50%]">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Lock size={18} />
                      </div>
                      <input
                        disabled
                        type="password"
                        name="password"
                        value={"******"}
                        className="w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-xl bg-gray-50"
                      />
                    </div>
                    <GradientButton
                      variant="create"
                      className="px-4 py-3 font-medium rounded-xl flex items-center gap-2 mb-8"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowUpdatePasswordModal(true);
                      }}
                    >
                      <Plus className="w-4 h-4" /> Actualizar contraseña
                    </GradientButton>
                  </div>

                  {/* Submit button */}
                  <div className="mt-4 flex space-x-4">
                    <GradientButton
                      variant="edit"
                      className="w-full py-4 px-6 font-semibold rounded-xl flex items-center justify-center gap-2"
                    >
                      <Save size={18} />
                      Actualizar Perfil
                    </GradientButton>
                    <GradientButton
                      variant="danger"
                      onClick={() => setShowDeleteConfirmation(true)}
                      className="w-full py-4 px-6 font-semibold rounded-xl flex items-center justify-center gap-2"
                    >
                      <Trash2 size={18} />
                      Eliminar cuenta
                    </GradientButton>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        {showUpdatePasswordModal && (
          <UpdatePasswordModal
            onClose={() => setShowUpdatePasswordModal(false)}
            onSave={changePasswordSendToApi}
            showAlert={showAlert}
          />
        )}

        <ConfirmModal
          isOpen={showDeleteConfirmation}
          message="¿Estás seguro de que deseas eliminar tu cuenta? Esta acción es irreversible y eliminará todos tus datos de la plataforma."
          onConfirm={handleDeleteAccount}
          onCancel={() => setShowDeleteConfirmation(false)}
        />

        {isDeletionEmailSent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-teal-600 mb-4">
                Revisa tu correo electrónico
              </h3>
              <p className="text-gray-600 mb-6">
                Te hemos enviado un correo con las instrucciones para confirmar la
                eliminación de tu cuenta.
              </p>
              <div className="flex justify-end">
                <GradientButton
                  variant="create"
                  onClick={() => setIsDeletionEmailSent(false)}
                  className="px-4 py-2 rounded-xl"
                >
                  Entendido
                </GradientButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientProfile;
