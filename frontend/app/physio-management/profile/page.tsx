"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Camera, Plus, Trash2, Edit, Save, StarIcon, Film, Bell, BicepsFlexed, Lock } from 'lucide-react';
import ScheduleCalendar from "@/components/ui/ScheduleCalendar";
import { getApiBaseUrl } from "@/utils/api";
import { GradientButton } from "@/components/ui/gradient-button";
import Link from "next/link";
import styles from "@/components/ratings.module.css";
import Alert from "@/components/ui/Alert";
import ConfirmModal from "@/components/ui/ConfirmModal";
import UpdatePasswordModal from "@/components/user-update-password-modal";
import PhysioterapistRating from "@/components/ui/PhysioterapistRating";
import SubscriptionSlider from "@/components/ui/SubscriptionSlider";


const getAuthToken = () => {
  return localStorage.getItem("token"); // Obtiene el token JWT
};

const FisioProfile = () => {
  interface QuestionElement {
    type: string;
    label: string;
    scope: string;
  }

  interface Questionary {
    type: string;
    label: string;
    "UI Schema"?: {
      elements: QuestionElement[];
    };
  }

  // Actualizar la interfaz Service
  interface Service {
    id?: number;
    tipo: "PRIMERA_CONSULTA" | "CONTINUAR_TRATAMIENTO" | "OTRO";
    titulo: string;
    descripcion: string;
    precio: string;
    duracion: number; // En minutos
    custom_questionnaire?: Questionary;
  }

    const [profile, setProfile] = useState({
        user: {
            dni: "",
            email: "",
            first_name: "",
            last_name: "",
            phone_number: "",
            photo: "",
            postal_code: "",
            user_id: "",
            username: "",
        },
        autonomic_community: "",
        bio: "",
        birth_date: "",
        collegiate_number: "",
        gender: "",
        rating_avg: "",
        schedule: "",
        specializations: "",
        services: [] as Service[],
        plan: "",
        degree: "",
        university:"",
        experience: "",
        workplace:""
    });

  const [editingServiceIndex, setEditingServiceIndex] = useState<number | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const availableSpecializations = [
    "Deportiva",
    "Ortopédica y Traumatológica",
    "Neurológica",
    "Pediátrica",
    "Obstetricia y Suelo pélvico",
    "Geriátrica",
    "Oncológica",
    "Cardiovascular",
    "Respiratoria",
  ];
  const [selectedSpecializations, setSelectedSpecializations] = useState<
    string[]
  >([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [showUpdatePasswordModal, setShowUpdatePasswordModal] = useState(false);
  const [schedule, setSchedule] = useState({
    exceptions: {},
    appointments: [],
    weekly_schedule: {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: [],
    },
    initialized: false,
  });
  const [isClient, setIsClient] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [alert, setAlert] = useState<{
    show: boolean;
    type: "success" | "error" | "info" | "warning";
    message: string;
  }>({
    show: false,
    type: "info",
    message: "",
  });

  // Función helper para mostrar alertas
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

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    serviceIndex: null,
  });

  const [hasRated, setHasRated] = useState<boolean>(false);
  const [rating, setRating] = useState<{
    id: number;
    punctuation: number;
    opinion: string;
  } | null>(null);
  const [showRatingForm, setShowRatingForm] = useState<boolean>(false);
  const [newRating, setNewRating] = useState<{
    punctuation: number;
    opinion: string;
  }>({ punctuation: 5, opinion: "" });

  const [confirmRatingDelete, setConfirmRatingDelete] =
    useState<boolean>(false);
  const [id, setId] = useState<number | null>(null);
  const [physioterapistId, setPhysioterapistId] = useState(null);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownOpen && !e.target.closest(".custom-dropdown")) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [dropdownOpen]);

  useEffect(() => {
    fetchFisioProfile();
    checkIfPhysioHasRated();
    return () => {
      if (profile.user.photo && profile.user.photo.startsWith("blob:")) {
        URL.revokeObjectURL(profile.user.photo);
      }
    };
  }, [token, isClient]);

  useEffect(() => {
    const fetchRating = async () => {
      if (!token) return;

      try {
        const response = await axios.get(
          `${getApiBaseUrl()}/api/ratings/my-rating/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data) {
          setHasRated(true);
          setRating(response.data);
        } else {
          setHasRated(false);
        }
      } catch (error) {
        console.error("Error fetching rating:", error);
      }
    };

    if (isClient && token) {
      fetchRating();
    }
  }, [token, isClient]);

  const fetchFisioProfile = async () => {
    if (isClient) {
      try {
        const storedToken = getAuthToken();
        setToken(storedToken);
        if (!storedToken) {
          setError("No hay token disponible.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${getApiBaseUrl()}/api/app_user/current-user/`,
          {
            headers: { Authorization: `Bearer ${storedToken}` },
          }
        );
        console.log("response", response.data);
        setId(response.data.physio.id);

                setProfile({
                    user: {
                        dni: response.data.physio.user_data.dni,
                        email: response.data.physio.user_data.email,
                        first_name: response.data.physio.user_data.first_name,
                        last_name: response.data.physio.user_data.last_name,
                        phone_number: response.data.physio.user_data.phone_number,
                        photo: response.data.physio.user_data.photo,
                        postal_code: response.data.physio.user_data.postal_code,
                        user_id: response.data.physio.user_data.user_id,
                        username: response.data.physio.user_data.username,
                    },
                    autonomic_community: response.data.physio.autonomic_community,
                    bio: response.data.physio.bio,
                    birth_date: response.data.physio.birth_date,
                    collegiate_number: response.data.physio.collegiate_number,
                    gender: response.data.physio.gender,
                    rating_avg: response.data.physio.rating_avg,
                    schedule: response.data.physio.schedule,
                    specializations: response.data.physio.specializations,
                    services: [],
                    plan: response.data.physio.plan,
                    degree: response.data.physio.degree,
                    university: response.data.physio.university,
                    experience: response.data.physio.experience,
                    workplace: response.data.physio.workplace,
                });

                // Verificar si faltan datos profesionales importantes
                const missingFields = [];
                if (!response.data.physio.degree) missingFields.push("titulación");
                if (!response.data.physio.university) missingFields.push("universidad");
                if (!response.data.physio.experience) missingFields.push("experiencia");
                if (!response.data.physio.workplace) missingFields.push("centro de trabajo");
        
                // Mostrar alerta si faltan campos
                if (missingFields.length > 0) {
                  showAlert(
                    "warning", 
                    `Tu perfil profesional está incompleto. Por favor, completa los campos de ${missingFields.join(", ")} para mejorar tu visibilidad.`
                );
                }

                try {
                    let parsedServices = [];
                    // Comprobar si los servicios son un string JSON o un array o un objeto
                    if (typeof response.data.physio.services === 'string') {
                        try {
                            parsedServices = JSON.parse(response.data.physio.services);
                        } catch (e) {
                            console.error("Error al parsear los servicios:", e);
                        }
                    } else if (Array.isArray(response.data.physio.services)) {
                        parsedServices = response.data.physio.services;
                    } else if (typeof response.data.physio.services === 'object') {
                        // Si es un objeto con claves (como en el ejemplo)
                        parsedServices = response.data.physio.services;
                    }

          // Procesar los servicios dependiendo de su formato
          let serviceList: Service[] = [];

          // Si es un objeto con claves (como {Fisioterapia: {...}, Servicio 2: {...}})
          if (
            parsedServices &&
            typeof parsedServices === "object" &&
            !Array.isArray(parsedServices)
          ) {
            Object.entries(parsedServices).forEach(
              ([key, value]: [string, any]) => {
                serviceList.push({
                  id: value.id || null,
                  titulo: value.title || key,
                  tipo: value.type || "PRIMERA_CONSULTA",
                  descripcion: value.description || "",
                  precio: value.price ? `${value.price}€` : "",
                  duracion:
                    typeof value.duration === "string"
                      ? value.duration
                      : `${value.duration} minutos`,
                  custom_questionnaire: value["custom_questionnaire"] || null,
                });
              }
            );
          } else if (Array.isArray(parsedServices)) {
            // Si ya es un array
            serviceList = parsedServices.map((service) => ({
              id: service.id || null,
              titulo: service.titulo || service.title || "",
              tipo: service.tipo || service.type || "PRIMERA_CONSULTA",
              descripcion: service.descripcion || service.description || "",
              precio:
                service.precio || (service.price ? `${service.price}€` : ""),
              duracion:
                service.duracion ||
                (service.duration ? `${service.duration} minutos` : ""),
              custom_questionnaire:
                service["custom_questionnaire"] ||
                service.custom_questionnaire ||
                null,
            }));
          }

          setServices(serviceList);
          setProfile((prevProfile) => ({
            ...prevProfile,
            services: serviceList,
          }));
        } catch (e) {
          console.error("Error al procesar los servicios:", e);
          setServices([]);
        }
        if (response.data.physio.schedule) {
          setSchedule(response.data.physio.schedule);
        }
        if (response.data.physio.specializations) {
          const specs = Array.isArray(response.data.physio.specializations)
            ? response.data.physio.specializations
            : response.data.physio.specializations.split(",");

          setSelectedSpecializations(specs);
        }
      } catch {
        setError("Error obteniendo el perfil.");
      } finally {
        setLoading(false);
      }
    }
  };

  const changePasswordSendToApi = async (
    oldPassword: string,
    newPassword: string,
  ): Promise<number | null> => {
    try {
      // Preparar el servicio en el formato que espera el backend
      const passwordsForBackend = {
        old_password: oldPassword,
        new_password: newPassword,
      };

      const response = await axios.post(
        `${getApiBaseUrl()}/api/app_user/change_password/`,
        passwordsForBackend,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowUpdatePasswordModal(false)
      showAlert("success", "Contraseña actualizada correctamente");
      return response.data;
    } catch (error: unknown) {
      console.log("Error al añadir cambiar la contraseña:", error);
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

  // Funciones para gestionar servicios con la API
  const addServiceToAPI = async (
    serviceData: Service
  ): Promise<number | null> => {
    try {
      console.log("serviceData", serviceData);
      // Preparar el servicio en el formato que espera el backend
      const serviceForBackend = {
        title: serviceData.titulo,
        description: serviceData.descripcion,
        price: parseFloat(serviceData.precio.replace("€", "").trim()),
        duration: serviceData.duracion,
        tipo: serviceData.tipo,
        custom_questionnaire: serviceData.custom_questionnaire
          ? {
              "UI Schema": serviceData.custom_questionnaire,
            }
          : null,
      };

      const response = await axios.post(
        `${getApiBaseUrl()}/api/app_user/physio/add-service/`,
        serviceForBackend,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return response.data.services;
    } catch (error: unknown) {
      console.error("Error al añadir servicio:", error);
      if (axios.isAxiosError(error) && error.response) {
        console.error("Respuesta de error del backend:", error.response.data);
        showAlert("error", `Error: ${JSON.stringify(error.response.data)}`);
      } else {
        showAlert("error", "Error al añadir el servicio.");
      }
      return null;
    }
  };

  const updateServiceInAPI = async (serviceId, serviceData) => {
    try {
      // Preparar el servicio en el formato que espera el backend
      const serviceForBackend = {
        title: serviceData.titulo,
        description: serviceData.descripcion,
        price: parseFloat(serviceData.precio.replace("€", "").trim()),
        duration: serviceData.duracion,
        tipo: serviceData.tipo,
        custom_questionnaire: serviceData.custom_questionnaire
          ? {
              "UI Schema": serviceData.custom_questionnaire,
            }
          : null,
      };

      const response = await axios.put(
        `${getApiBaseUrl()}/api/app_user/physio/update-service/${serviceId}/`,
        serviceForBackend,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        return response.data.services;
      } else {
        throw new Error("Error al actualizar el servicio");
      }
    } catch (error) {
      console.error("Error al actualizar servicio:", error);
      if (error.response) {
        showAlert("error", `Error: ${JSON.stringify(error.response.data)}`);
      } else {
        showAlert("error", "Error al actualizar el servicio.");
      }
      return false;
    }
  };

  const deleteServiceFromAPI = async (serviceId) => {
    try {
      const response = await axios.delete(
        `${getApiBaseUrl()}/api/app_user/physio/delete-service/${serviceId}/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return response.status === 204 || response.status === 200;
    } catch (error) {
      console.error("Error al eliminar servicio:", error);
      if (error.response) {
        showAlert("error", `Error: ${JSON.stringify(error.response.data)}`);
      } else {
        showAlert("error", "Error al eliminar el servicio.");
      }
      return false;
    }
  };

  const handleSubmitRating = async () => {
    try {
      if (!newRating.opinion.trim()) {
        showAlert("error", "Por favor, proporciona una opinión.");
        return;
      }

      if (newRating.opinion.trim().length > 140) {
        showAlert("error", "La opinión no puede exceder los 140 caracteres.");
        return;
      }

      const payload = {
        punctuation: newRating.punctuation,
        opinion: newRating.opinion,
        physiotherapist: profile.user.user_id,
      };

      if (hasRated && rating) {
        await axios.put(
          `${getApiBaseUrl()}/api/ratings/update/${rating.id}/`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        await axios.post(`${getApiBaseUrl()}/api/ratings/create/`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setShowRatingForm(false);
      setHasRated(true);

      if (newRating.punctuation >= 3) {
        showAlert("success", "¡Gracias por valorar nuestra app!");
      } else {
        showAlert("success", "Valoración enviada correctamente.");
      }

      // Reload the page after successful submission
      window.location.reload();
    } catch (error) {
      console.error("Error submitting rating:", error);
      if (axios.isAxiosError(error) && error.response) {
        showAlert("error", `Error: ${JSON.stringify(error.response.data)}`);
      } else {
        showAlert(
          "error",
          "Error al enviar la valoración. Por favor, inténtalo de nuevo más tarde."
        );
      }
    }
  };

  const handleDeleteRating = async () => {
    if (!rating) return;
    setConfirmRatingDelete(true);
  };

  const handleConfirmRatingDelete = async () => {
    try {
      await axios.delete(
        `${getApiBaseUrl()}/api/ratings/delete/${rating.id}/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      showAlert("success", "Valoración eliminada correctamente.");
      setHasRated(false);
      setRating(null);
      fetchFisioProfile();
    } catch (error) {
      console.error("Error deleting rating:", error);
      if (axios.isAxiosError(error) && error.response) {
        showAlert("error", `Error: ${JSON.stringify(error.response.data)}`);
      } else {
        showAlert(
          "error",
          "Error al eliminar la valoración. Por favor, inténtalo de nuevo más tarde."
        );
      }
    } finally {
      setConfirmRatingDelete(false);
    }
  };

  const checkIfPhysioHasRated = async () => {
    const token = getAuthToken();
    if (!token) {
      setHasRated(false);
      return;
    }

    try {
      const response = await axios.get(
        `${getApiBaseUrl()}/api/ratings/has-rated/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.has_rated) {
        setHasRated(true);
      } else {
        setHasRated(false);
      }
    } catch (err) {
      setHasRated(false);
      if (axios.isAxiosError(err) && err.response) {
        showAlert("error", `Error: ${JSON.stringify(err.response.data)}`);
      } else {
        showAlert(
          "error",
          "Error al comprobar si ya has valorado la aplicación."
        );
      }
    }
  };

  const getScheduleSummary = () => {
    const daysOfWeek = {
      monday: "Lunes",
      tuesday: "Martes",
      wednesday: "Miércoles",
      thursday: "Jueves",
      friday: "Viernes",
      saturday: "Sábado",
      sunday: "Domingo",
    };

    return (
      Object.entries(schedule.weekly_schedule)
        .map(([day, ranges]) => {
          if (ranges.length === 0) return null;

          const timeRanges = ranges
            .map((interval) => `${interval.start} - ${interval.end}`)
            .join(", ");
          return `${daysOfWeek[day]}: ${timeRanges}`;
        })
        .filter(Boolean)
        .join("<br>") || "No se ha configurado horario"
    );
  };

  // Manejar actualizaciones del calendario
  const handleScheduleChange = (newSchedule) => {
    setSchedule(newSchedule);
  };

  // Validaciones de los campos editables
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "email":
        if (!value) error = "El email es obligatorio.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          error = "Formato de email inválido.";
        break;
      case "phone_number":
        if (!value) error = "El teléfono es obligatorio.";
        else if (!/^\d+$/.test(value)) error = "Solo se permiten números.";
        else if (value.length > 15) error = "Máximo 15 dígitos.";
        break;
      case "postal_code":
        if (!value) error = "El código postal es obligatorio.";
        else if (!/^\d+$/.test(value)) error = "Solo se permiten números.";
        else if (value.length > 10) error = "Máximo 10 caracteres.";
        break;
      case "bio":
        // Only validate max length if bio has content
        if (value && value.length > 500) error = "Máximo 500 caracteres.";
        break;
      case "degree":
        if (!value) error = "La titulación es obligatoria.";
        else if (value.length < 10) error = "Se requiere un mínimo de 10 caracteres.";
        else if (value.length > 100) error = "Máximo 100 caracteres.";
        break;
      case "university":
        if (!value) error = "La universidad es obligatoria.";
        else if (value.length < 10) error = "Se requiere un mínimo de 10 caracteres.";
        else if (value.length > 100) error = "Máximo 100 caracteres.";
        break;
      case "experience":
        if (!value) error = "La experiencia es obligatoria.";
        else if (value.length < 10) error = "Se requiere un mínimo de 10 caracteres.";
        else if (value.length > 100) error = "Máximo 100 caracteres.";
        break;
      case "workplace":
        if (!value) error = "El lugar de trabajo es obligatorio.";
        else if (value.length < 10) error = "Se requiere un mínimo de 10 caracteres.";
        else if (value.length > 100) error = "Máximo 100 caracteres.";
        break;
    }

    setFormErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
    return error === "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    validateField(name, value); // Validar cada campo en tiempo real

        if (name === "bio") {
            setProfile((prevProfile) => ({ ...prevProfile, bio: value }));
        } // Si el campo es alguno de los otros, se actualiza dentro de "user"
        else if (["degree", "university", "experience", "workplace"].includes(name)) {
            setProfile((prevProfile) => ({
                ...prevProfile,
                [name]: value,  // Se actualiza directamente el campo del perfil
            }));
        }
        // Para los campos dentro de "user" se hace de la forma habitual
        else {
            setProfile((prevProfile) => ({
                ...prevProfile,
                user: { ...prevProfile.user, [name]: value },
            }));
        }
    };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar todos los campos antes de enviar
    const isValid = ["email", "phone_number", "postal_code", "bio"].every(
      (field) =>
        validateField(
          field,
          (field === "bio" ? profile.bio : profile.user[field]) || ""
        )
    );

    if (!isValid) {
      showAlert("error", "Por favor, corrige los errores antes de enviar.");
      return;
    }

    try {
      if (!token) {
        setError("No hay token disponible.");
        return;
      }

      const formData = new FormData();
      Object.entries(profile.user).forEach(([key, value]) => {
        if (key !== "photo" && key !== "photoFile" && value)
          formData.append(`user.${key}`, value);
      });

      if (profile.user.photoFile) {
        formData.append("user.photo", profile.user.photoFile);
      }

      formData.append("gender", profile.gender || "");
      formData.append("birth_date", profile.birth_date || "");
      formData.append("autonomic_community", profile.autonomic_community || "");
      formData.append("collegiate_number", profile.collegiate_number || "");
      if (profile.bio && profile.bio.trim() !== "") {
        formData.append("bio", profile.bio.trim());
      }
      formData.append("rating_avg", profile.rating_avg || "");
      formData.append(
        "specializations",
        JSON.stringify(selectedSpecializations)
      );
      formData.append("degree", profile.degree || "");
      formData.append("university", profile.university || "");
      formData.append("experience", profile.experience || "");
      formData.append("workplace", profile.workplace || "");

      // Actualizar el schedule con los datos actuales del calendario
      // const { initialized, ...scheduleWithoutInitialized } = schedule;
      // formData.append("schedule", scheduleWithoutInitialized);

      // formData.append("services", JSON.stringify(services));

      const response = await axios.put(
        `${getApiBaseUrl()}/api/app_user/physio/update/`,
        formData,
        {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200 && editingServiceIndex === null) {
        showAlert("success", "Perfil actualizado correctamente");
      }

      fetchFisioProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
      if (error.response) {
        showAlert("error", `Error: ${JSON.stringify(error.response.data)}`);
      } else {
        showAlert("error", "Error actualizando el perfil.");
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create URL for preview
      const previewUrl = URL.createObjectURL(file);

      // Update the state with the file and preview URL
      setProfile((prevProfile) => ({
        ...prevProfile,
        user: {
          ...prevProfile.user,
          photo: previewUrl, // For UI preview
          photoFile: file, // For backend submission
        },
      }));
    }
  };

  const getImageSrc = () => {
    // Use the preview URL if a new image is uploaded
    if (profile.user.photoFile) {
      return profile.user.photo;
    }

    // Use the backend photo if available
    if (profile?.user?.photo) {
      return `${getApiBaseUrl()}${profile.user.photo}`;
    }

    // Default avatar if no photo is available
    return "/default_avatar.png";
  };

  const handleAddService = async (newService) => {
    try {
      if (editingServiceIndex !== null) {
        // Estamos editando un servicio existente
        const serviceToEdit = services[editingServiceIndex];

        if (serviceToEdit.id) {
          // Actualizar en la API
          const services = await updateServiceInAPI(
            serviceToEdit.id,
            newService
          );

          if (services) {
            const serviceList: Service[] = [];
            // Actualizar el estado local solo si la API devuelve éxito
            Object.entries(services).forEach(([key, value]: [string, any]) => {
              serviceList.push({
                id: value.id || null,
                titulo: value.title || key,
                tipo: value.type || "PRIMERA_CONSULTA",
                descripcion: value.description || "",
                precio: value.price ? `${value.price}€` : "",
                duracion:
                  typeof value.duration === "string"
                    ? value.duration
                    : `${value.duration} minutos`,
                custom_questionnaire: value["custom_questionnaire"] || null,
              });
            });
            setServices(serviceList);
            setProfile((prev) => ({ ...prev, services: serviceList }));
            showAlert("success", "Servicio actualizado correctamente");
          } else {
            showAlert("error", "Error al actualizar el servicio");
          }
        } else {
          // Si no tiene ID pero estamos editando, es raro pero tratarlo como un nuevo servicio
          const services = await addServiceToAPI(newService);

          if (services) {
            const serviceList: Service[] = [];
            // Actualizar el estado local solo si la API devuelve éxito
            Object.entries(services).forEach(([key, value]: [string, any]) => {
              serviceList.push({
                id: value.id || null,
                titulo: value.title || key,
                tipo: value.type || "PRIMERA_CONSULTA",
                descripcion: value.description || "",
                precio: value.price ? `${value.price}€` : "",
                duracion:
                  typeof value.duration === "string"
                    ? value.duration
                    : `${value.duration} minutos`,
                custom_questionnaire: value["custom_questionnaire"] || null,
              });
            });
            setServices(serviceList);
            setProfile((prev) => ({ ...prev, services: serviceList }));
            showAlert("success", "Servicio actualizado correctamente");
          } else {
            showAlert("error", "Error al añadir el servicio");
          }
        }
      } else {
        // Estamos añadiendo un nuevo servicio
        const services = await addServiceToAPI(newService);

        if (services) {
          const serviceList: Service[] = [];
          // Actualizar el estado local solo si la API devuelve éxito
          Object.entries(services).forEach(([key, value]: [string, any]) => {
            serviceList.push({
              id: value.id || null,
              titulo: value.title || key,
              tipo: value.type || "PRIMERA_CONSULTA",
              descripcion: value.description || "",
              precio: value.price ? `${value.price}€` : "",
              duracion:
                typeof value.duration === "string"
                  ? value.duration
                  : `${value.duration} minutos`,
              custom_questionnaire: value["custom_questionnaire"] || null,
            });
          });
          setServices(serviceList);
          setProfile((prev) => ({ ...prev, services: serviceList }));
          showAlert("success", "Servicio añadido correctamente");
        } else {
          showAlert("error", "Error al añadir el servicio");
        }
      }
    } catch (error) {
      console.error("Error al gestionar el servicio:", error);
      showAlert("error", "Error al procesar la operación");
    } finally {
      setEditingServiceIndex(null);
      setShowServiceModal(false);
    }
  };

  const handleEditService = (index) => {
    setEditingServiceIndex(index);
    setShowServiceModal(true);
  };

  const handleDeleteService = async (index) => {
    setConfirmModal({
      isOpen: true,
      serviceIndex: index,
    });
  };

  const handleConfirmDelete = async () => {
    const index = confirmModal.serviceIndex;
    try {
      const serviceToDelete = services[index];

      if (serviceToDelete.id) {
        const success = await deleteServiceFromAPI(serviceToDelete.id);

        if (success) {
          const updatedServices = [...services];
          updatedServices.splice(index, 1);
          setServices(updatedServices);
          setProfile((prev) => ({ ...prev, services: updatedServices }));
          showAlert("success", "Servicio eliminado correctamente");
        } else {
          showAlert("error", "Error al eliminar el servicio");
        }
      } else {
        showAlert(
          "warning",
          "No se puede eliminar un servicio que no ha sido guardado"
        );
      }
    } catch (error) {
      console.error("Error al eliminar el servicio:", error);
      showAlert("error", "Error al eliminar el servicio");
    } finally {
      setConfirmModal({ isOpen: false, serviceIndex: null });
    }
  };

  const ServiceModal = ({
    onClose,
    onSave,
    editingService = null,
  }: {
    onClose: () => void;
    onSave: (service: Service) => void;
    editingService?: Service | null;
  }) => {
    // Inicializar con valores del servicio a editar o valores por defecto
    const [tipo, setTipo] = useState(
      editingService?.tipo || "PRIMERA_CONSULTA"
    );
    const [titulo, setTitulo] = useState(editingService?.titulo || "");
    const [descripcion, setDescripcion] = useState(
      editingService?.descripcion || ""
    );
    const [precio, setPrecio] = useState(editingService?.precio || "");
    const [duracion, setDuracion] = useState(() => {
      if (editingService) {
        if (typeof editingService.duracion === "number") {
          return String(editingService.duracion);
        } else if (typeof editingService.duracion === "string") {
          // Extraer solo los dígitos de la cadena
          const match = editingService.duracion.match(/\d+/);
          return match ? match[0] : "60";
        }
      }
      return "60"; // Valor por defecto
    });

    // Estado para gestionar el cuestionario
    const [showQuestionnaireSection, setShowQuestionnaireSection] = useState(
      () => {
        // Verificar si el servicio que estamos editando tiene un cuestionario
        if (editingService?.custom_questionnaire) {
          if (
            editingService.custom_questionnaire.elements ||
            editingService.custom_questionnaire["UI Schema"]?.elements
          ) {
            return true;
          }
        }
        return false;
      }
    );
    const [questionary, setQuestionary] = useState<Questionary>(() => {
      const defaultQuestionary: Questionary = {
        type: "Group",
        label: "Cuestionario Personalizado",
        elements: [
          {
            type: "Number",
            label: "Peso (kg)",
            scope: "#/properties/peso",
          },
          {
            type: "Number",
            label: "Altura (cm)",
            scope: "#/properties/altura",
          },
          {
            type: "Number",
            label: "Edad",
            scope: "#/properties/edad",
          },
          {
            type: "Control",
            label: "Nivel de actividad física",
            scope: "#/properties/actividad_fisica",
          },
          {
            type: "Control",
            label: "Motivo de la consulta",
            scope: "#/properties/motivo_consulta",
          },
        ],
      };

      // Verificar todos los posibles formatos de cuestionario
      if (editingService?.custom_questionnaire) {
        // Si es un objeto directo con elementos
        if (editingService.custom_questionnaire.elements) {
          return editingService.custom_questionnaire;
        }
        // Si tiene una estructura anidada con UI Schema
        else if (editingService.custom_questionnaire["UI Schema"]) {
          return editingService.custom_questionnaire["UI Schema"];
        }
        // Si el propio objeto es el UI Schema
        else if (
          editingService.custom_questionnaire.type &&
          editingService.custom_questionnaire.type === "Group"
        ) {
          return editingService.custom_questionnaire;
        }
      }

      return defaultQuestionary;
    });

    // Para gestionar nuevas preguntas
    const [newQuestion, setNewQuestion] = useState("");
    const [questionType, setQuestionType] = useState("Control");

    // Generar ID único para scope basado en el texto de la pregunta
    const generateScope = (question: string) => {
      // Simplificar el texto para el scope, eliminar espacios, acentos, etc.
      const simplifiedText = question
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s]/g, "")
        .replace(/\s+/g, "_");

      return `#/properties/${simplifiedText}`;
    };

    // Añadir una nueva pregunta al cuestionario
    const addQuestion = () => {
      if (!newQuestion.trim()) return;

      const newElement = {
        type: questionType, // Usar el tipo seleccionado en el desplegable
        label: newQuestion,
        scope: generateScope(newQuestion),
      };

      setQuestionary({
        ...questionary,
        elements: [...questionary.elements, newElement],
      });

      setNewQuestion("");
      setQuestionType("Control"); // Restablecer al tipo predeterminado después de añadir
    };

    // Eliminar una pregunta del cuestionario
    const removeQuestion = (index: number) => {
      // No permitir eliminar las 5 primeras preguntas predeterminadas
      if (index < 5) return;

      const updatedElements = [...questionary.elements];
      updatedElements.splice(index, 1);

      setQuestionary({
        ...questionary,
        elements: updatedElements,
      });
    };

    // Handle custom title based on type
    useEffect(() => {
      if (tipo === "PRIMERA_CONSULTA") {
        setTitulo("Primera consulta");
      } else if (tipo === "CONTINUAR_TRATAMIENTO") {
        setTitulo("Continuación de tratamiento");
      }
    }, [tipo]);

    const handleSave = () => {
      // Validación básica
      if (!titulo.trim()) {
        showAlert("warning", "El título es obligatorio");
        return;
      }

      if (!precio.trim()) {
        showAlert("warning", "El precio es obligatorio");
        return;
      }

      if (!duracion || parseInt(duracion) <= 0) {
        showAlert("warning", "La duración debe ser mayor a 0 minutos");
        return;
      }

      const newService = {
        tipo,
        titulo,
        descripcion,
        precio,
        duracion: parseInt(duracion),
        ...(showQuestionnaireSection
          ? { custom_questionnaire: questionary }
          : {}),
      };

      onSave(newService);
    };

    return (
      <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
        <div className="modal-content">
          <div className="modal-header flex justify-between items-center">
            <h2>{editingService ? "Editar servicio" : "Añadir servicio"}</h2>
            <button
              className="schedule-modal-close text-white bg-white rounded-full"
              onClick={onClose}
              aria-label="Cerrar"
            >
              &times;
            </button>
          </div>

          <label>Tipo de servicio:</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value as string)}
          >
            <option value="PRIMERA_CONSULTA">Primera consulta</option>
            <option value="CONTINUAR_TRATAMIENTO">Continuar tratamiento</option>
            <option value="OTRO">Otro</option>
          </select>

          <label>
            Título: <span className="required">*</span>
          </label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            disabled={tipo !== "OTRO"}
            className={!titulo.trim() ? "error-input" : ""}
          />

          <label>Descripción:</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Describe brevemente en qué consiste este servicio"
          />

          <label>
            Precio por consulta: <span className="required">*</span>
          </label>
          <input
            type="text"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            placeholder="€"
            className={!precio.trim() ? "error-input" : ""}
          />

          <label>
            Duración (minutos): <span className="required">*</span>
          </label>
          <input
            type="number"
            value={duracion}
            onChange={(e) => setDuracion(e.target.value)}
            min="1"
            placeholder="60"
            className={
              !duracion || parseInt(duracion) <= 0 ? "error-input" : ""
            }
          />

          <div className="questionnaire-toggle">
            <label>
              Incluir cuestionario pre-intervención
              <input
                type="checkbox"
                checked={showQuestionnaireSection}
                onChange={() =>
                  setShowQuestionnaireSection(!showQuestionnaireSection)
                }
              />
              <span></span>
            </label>
            <p className="toggle-description">
              Agrega un formulario personalizado que el paciente rellenará antes
              de su cita
            </p>
          </div>

          {showQuestionnaireSection && (
            <div className="questionnaire-section">
              <p className="note">
                Las siguientes preguntas ya están incluidas por defecto:
              </p>

              <ul className="questions-list">
                {questionary && questionary.elements ? (
                  questionary.elements.map((element, index) => (
                    <li
                      key={index}
                      className={index < 5 ? "default-question" : ""}
                    >
                      {element.label}
                      <span className="question-type-badge">
                        {element.type === "Number" ? "Numérico" : "Texto"}
                      </span>
                      {index >= 5 && (
                        <GradientButton
                          variant="danger"
                          className="remove-question"
                          onClick={() => removeQuestion(index)}
                        >
                          ×
                        </GradientButton>
                      )}
                    </li>
                  ))
                ) : (
                  <li>No hay preguntas definidas en este cuestionario.</li>
                )}
              </ul>

              <div className="add-question">
                <label>Añadir nueva pregunta:</label>
                <div className="question-input-group">
                  <div className="question-type-select">
                    <select
                      value={questionType}
                      onChange={(e) => setQuestionType(e.target.value)}
                      className="question-type-dropdown"
                    >
                      <option value="Control">Texto</option>
                      <option value="Number">Numérico</option>
                    </select>
                  </div>
                  <div className="question-input">
                    <input
                      type="text"
                      value={newQuestion}
                      onChange={(e) => {
                        if (e.target.value.length <= 100) {
                          setNewQuestion(e.target.value);
                        }
                      }}
                      placeholder="Ej. ¿Tiene alguna lesión previa?"
                    />
                    {newQuestion.length > 100 && (
                      <p className="text-red-500 text-sm">
                        Máximo 100 caracteres permitidos.
                      </p>
                    )}
                    <GradientButton
                      variant="create"
                      onClick={addQuestion}
                      disabled={!newQuestion.trim()}
                      className="add-question-button"
                    >
                      Añadir
                    </GradientButton>
                  </div>
                </div>
                <p className="type-hint">
                  {questionType === "Control"
                    ? "El campo de texto permite cualquier respuesta textual."
                    : "El campo numérico solo permitirá introducir números."}
                </p>
              </div>
            </div>
          )}

          <div className="modal-buttons">
            <GradientButton variant="edit" onClick={handleSave}>
              Guardar
            </GradientButton>
            <GradientButton variant="grey" onClick={onClose}>
              Cancelar
            </GradientButton>
          </div>
        </div>
      </div>
    );
  };

  const saveScheduleToAPI = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showAlert("warning", "No hay token disponible.");
        return;
      }

      const { initialized, ...scheduleWithoutInitialized } = schedule;

      // Fix the endpoint URL - the correct endpoint should be update/ not update-schedule/
      const response = await axios.put(
        `${getApiBaseUrl()}/api/appointment/physio/schedule/weekly/`,
        { schedule: scheduleWithoutInitialized },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        showAlert("success", "Horario guardado correctamente.");
        setScheduleModalOpen(false);
      } else {
        throw new Error("Error al guardar el horario.");
      }
    } catch (error) {
      console.error("Error al guardar el horario:", error);
      showAlert("error", `Error al guardar el horario: ${error.message}`);
    }
  };

  const renderStars = (punctuation: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <svg
          key={i}
          className={styles.star}
          fill={i < punctuation ? "currentColor" : "none"}
          stroke={i < punctuation ? "none" : "currentColor"}
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
        </svg>
      );
    }
    return stars;
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
  if (error) return <p>Error: {error}</p>;

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ backgroundColor: "rgb(238, 251, 250)" }}
    >
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-2xl overflow-hidden grid grid-cols-3">
        {/* Barra lateral izquierda - Sección de perfil */}
        <div
          className="col-span-1 text-white p-6 flex flex-col items-center"
          style={{ backgroundColor: "#05668D" }}
        >
          <div className="relative mb-4">
            <img
              src={getImageSrc()}
              alt="Perfil"
              className={`w-40 h-40 rounded-full object-cover border-4 ${
                profile.plan === 2 ? "border-yellow-400" : "border-white"
              }`}
            />
            <label
              htmlFor="file-upload"
              className="absolute bottom-0 right-0 bg-white text-blue-600 p-2 rounded-full cursor-pointer"
            >
              <Camera className="w-5 h-5" />
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>
          {Number(profile.plan) === 2 && (
            <label className="flex items-center gap-1">
              <StarIcon className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Fisio GOLD</span>
              <StarIcon className="w-4 h-4 text-amber-500 fill-amber-500" />
            </label>
          )}

          <h2 className="text-xl font-bold mb-2">{profile.user.username}</h2>
          <p className="text-blue-200 mb-4">Profesional</p>

          {/* Sección de valoración general*/}

          {id && <PhysioterapistRating physioterapistId={id} />}

          {/* Sección de horario */}
          <div className="w-full mt-4">
            <h3 className="text-lg font-semibold mb-2">Mi Horario</h3>
            <div
              className="text-blue-200"
              dangerouslySetInnerHTML={{ __html: getScheduleSummary() }}
            ></div>
            <br></br>
            <GradientButton
              variant="edit"
              className="px-6 py-2 font-medium rounded-xl flex items-center gap-2 mx-auto"
              onClick={() => setScheduleModalOpen(true)}
            >
              Editar Horario
            </GradientButton>
          </div>
          <div className="w-full mt-4">
          <GradientButton
              variant="edit"
              className="px-6 py-2 font-medium rounded-xl flex items-center gap-2 mx-auto"
              onClick={() => window.location.href = "/physio-management/balance"}
            >
              Consultar Saldo
            </GradientButton>
          </div>

          {/* Sección de valoración */}
          <div className="space-y-4 mt-8">
            <h3 className="text-lg font-semibold">Tu valoración de la App</h3>
            {hasRated && rating ? (
              <div className="border rounded-2xl p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">Tu valoración:</p>
                    <div className={styles.stars}>
                      {renderStars(rating.punctuation)}
                    </div>
                    <p className="text-sm text-white">
                      {rating.opinion.split(" ")[0].length > 10
                        ? rating.opinion.slice(0, 10).concat("...")
                        : rating.opinion
                            .split(" ")
                            .slice(0, 5)
                            .join(" ")
                            .concat("...")}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <GradientButton
                      variant="edit"
                      onClick={() => {
                        setNewRating({
                          punctuation: rating.punctuation,
                          opinion: rating.opinion,
                        });
                        setShowRatingForm(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </GradientButton>
                    <GradientButton
                      variant="danger"
                      onClick={handleDeleteRating}
                    >
                      <Trash2 className="w-4 h-4" />
                    </GradientButton>
                  </div>
                </div>
              </div>
            ) : (
              <div className={styles.rateButtonContainer}>
                <GradientButton
                  onClick={() => setShowRatingForm(true)}
                  className="my-4 mx-2"
                >
                  <span className="mx-2">
                    ¿Te gusta nuestra app? ¡Valóranos!
                  </span>
                </GradientButton>
              </div>
            )}

            {showRatingForm && (
              <div className="border rounded-2xl p-4">
                <h4 className="font-semibold mb-2">
                  {hasRated ? "Editar valoración" : "Nueva valoración"}
                </h4>
                <div className="flex items-center mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      onClick={() =>
                        setNewRating((prev) => ({ ...prev, punctuation: star }))
                      }
                      className={`w-6 h-6 cursor-pointer ${
                        star <= newRating.punctuation
                          ? "text-[#22C55E]"
                          : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
                <textarea
                  className={`w-full border rounded-md p-2 text-gray-800`}
                  placeholder="Escribe tu opinión..."
                  value={newRating.opinion}
                  onChange={(e) =>
                    setNewRating((prev) => ({
                      ...prev,
                      opinion: e.target.value,
                    }))
                  }
                />
                <div className="flex justify-end space-x-2 mt-2">
                  <GradientButton
                    variant="grey"
                    onClick={() => setShowRatingForm(false)}
                  >
                    Cancelar
                  </GradientButton>
                  <GradientButton
                    variant="edit"
                    onClick={async () => {
                      await handleSubmitRating();
                      fetchFisioProfile(); // Refresh the page data after submitting the form
                    }}
                  >
                    Guardar
                  </GradientButton>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Contenido derecho - Sección de formulario */}
        <div className="col-span-2 p-8 space-y-6">
          {/* Formulario de actualización de perfil */}
          <form onSubmit={handleSubmit} className="space- y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-large text-gray-700 mb-0.5">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  name="email"
                  value={profile.user.email}
                  onChange={handleChange}
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                />
                {formErrors.email && (
                  <span className="text-red-500 text-sm">
                    {formErrors.email}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-large text-gray-700 mb-0.5">
                  Teléfono
                </label>
                <input
                  type="text"
                  name="phone_number"
                  value={profile.user.phone_number}
                  onChange={handleChange}
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                />
                {formErrors.phone_number && (
                  <span className="text-red-500 text-sm">
                    {formErrors.phone_number}
                  </span>
                )}
              </div>
            </div>
            <div className="py-3 flex items-center flex-column justify-start w-full gap-3">
              <div className="relative w-[50%] flex items-center flex-column justify-start">
                <div className="absolute pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                    <input
                      disabled
                      type="password"
                      name="password"
                      value={"******"}
                      className="mb-0 w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm outline-none"
                    />
                </div>
                <GradientButton
                      variant="create"
                      className="px-3 py-2 mt-0 font-medium rounded-xl flex items-center gap-2"
                      onClick={(e) => {
                        e.preventDefault(); // Esto evita que se envíe el formulario
                        setShowUpdatePasswordModal(true);
                      }}
                    >
                      <Plus className="w-4 h-4" /> Actualizar contraseña
                </GradientButton>
            </div>

            {/* Desplegable de especializaciones */}
            <div className="space-y-2">
              <label className="block text-sm font-large text-gray-700 mb-4 mt-4">
                Especializaciones
              </label>
              <div className="specializations-container">
                <div className="selected-tags">
                  {selectedSpecializations.map((spec) => (
                    <div key={spec} className="tag">
                      {spec}
                      <span
                        className="remove-tag"
                        onClick={() =>
                          setSelectedSpecializations((prev) =>
                            prev.filter((s) => s !== spec)
                          )
                        }
                      >
                        ×
                      </span>
                    </div>
                  ))}
                </div>

                <div className="custom-dropdown">
                  <div
                    className="dropdown-header"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    {selectedSpecializations.length > 0
                      ? `${selectedSpecializations.length} seleccionadas`
                      : "Selecciona especializaciones"}
                    <span className={`arrow ${dropdownOpen ? "open" : ""}`}>
                      ↓
                    </span>
                  </div>

                  {dropdownOpen && (
                    <div className="dropdown-options">
                      <input
                        type="text"
                        placeholder="Buscar especialización..."
                        className="search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />

                      {availableSpecializations
                        .filter((spec) =>
                          spec.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .map((spec) => (
                          <label key={spec} className="option">
                            <input
                              type="checkbox"
                              checked={selectedSpecializations.includes(spec)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedSpecializations((prev) => [
                                    ...prev,
                                    spec,
                                  ]);
                                } else {
                                  setSelectedSpecializations((prev) =>
                                    prev.filter((s) => s !== spec)
                                  );
                                }
                              }}
                            />
                            <span className="checkmark"></span>
                            {spec}
                          </label>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Biografía */}
            <div className="space-y-2">
              <label className="block text-sm font-large text-gray-700 mb-2 mt-4">
                Biografía
              </label>
              <textarea
                name="bio"
                value={profile.bio || ""}
                onChange={handleChange}
                rows={4}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
              />
              {formErrors.bio && (
                <span className="text-red-500 text-sm">{formErrors.bio}</span>
              )}
            </div>

                        {/* Titulación */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Titulación <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              name="degree"
                              value={profile.degree || ""}
                              onChange={handleChange}
                              className={`w-full pl-10 pr-3 py-3 border-2 ${
                                formErrors.degree ? 'border-red-500' : 'border-gray-200'
                              } rounded-xl transition-all duration-200 outline-none focus:border-[#1E5ACD]`}
                            />
                          </div>
                          {formErrors.degree && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.degree}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Universidad <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              name="university"
                              value={profile.university || ""}
                              onChange={handleChange}
                              className={`w-full pl-10 pr-3 py-3 border-2 ${
                                formErrors.university ? 'border-red-500' : 'border-gray-200'
                              } rounded-xl transition-all duration-200 outline-none focus:border-[#1E5ACD]`}
                            />
                          </div>
                          {formErrors.university && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.university}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Experiencia <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <textarea
                              name="experience"
                              value={profile.experience || ""}
                              onChange={handleChange}
                              className={`w-full pl-10 pr-3 py-3 border-2 ${
                                formErrors.experience ? 'border-red-500' : 'border-gray-200'
                              } rounded-xl transition-all duration-200 outline-none focus:border-[#1E5ACD]`}
                            />
                          </div>
                          {formErrors.experience && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.experience}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Lugar de trabajo <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              name="workplace"
                              value={profile.workplace || ""}
                              onChange={handleChange}
                              className={`w-full pl-10 pr-3 py-3 border-2 ${
                                formErrors.workplace ? 'border-red-500' : 'border-gray-200'
                              } rounded-xl transition-all duration-200 outline-none focus:border-[#1E5ACD]`}
                            />
                          </div>
                          {formErrors.workplace && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.workplace}</p>
                          )}
                        </div>

            {/* Sección de servicios */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 mb-4 mt-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Servicios</h3>
                  <GradientButton
                    variant="create"
                    className="px-3 py-2 font-medium rounded-xl flex items-center gap-2"
                    onClick={(e) => {
                      e.preventDefault(); // Esto evita que se envíe el formulario
                      setEditingServiceIndex(null);
                      setShowServiceModal(true);
                    }}
                  >
                    <Plus className="w-4 h-4" /> Añadir Servicio
                  </GradientButton>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Ejercicios</h3>
                  {id && (
                    <Link href={`/physio-management/${id}/exercises`} passHref>
                    <GradientButton
                      variant="create"
                      className="px-3 py-2 font-medium rounded-xl flex items-center gap-2"
                    >
                      <BicepsFlexed className="w-4 h-4" /> Biblioteca de
                      Ejercicios
                    </GradientButton>
                  </Link>
                  )}
                </div>
              </div>

              {services.length === 0 ? (
                <p className="text-gray-500 text-center">
                  No hay servicios registrados
                </p>
              ) : (
                <div className="space-y-3">
                  {services.map((service, index) => (
                    <div
                      key={index}
                      className="border rounded-md p-3 flex justify-between items-center"
                    >
                      <div>
                        <h4 className="font-semibold">{service.titulo}</h4>
                        <p className="text-sm text-gray-600">
                          {service.descripcion}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <GradientButton
                          variant="edit"
                          onClick={(e) => {
                            e.preventDefault();
                            handleEditService(index);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </GradientButton>
                        <GradientButton
                          variant="danger"
                          onClick={(e) => {
                            e.preventDefault();
                            handleDeleteService(index);
                          }}
                          className="text-red-500 hover:bg-red-100 p-2 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </GradientButton>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

                        <div>
                            <GradientButton
                                variant="edit"
                                className="mt-8 w-full py-4 px-6 bg-gradient-to-r from-[#1E5ACD] to-[#3a6fd8] text-white font-semibold rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-center"
                            >
                                <Save size={18} className="mr-2" />
                                Actualizar Perfil
                            </GradientButton>
                            {/* <Link href="/physio-management/video" passHref>
                                <GradientButton
                                    variant="edit"
                                    className="w-full py-2 px-4 bg-gradient-to-r from-[#1E5ACD] to-[#3a6fd8] text-white font-semibold rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-center"
                                >
                                    <Film size={22} className="mr-2" />
                                    Subir vídeo
                                </GradientButton>
                            </Link> */}
                        </div>
                        <div className="border-t border-gray-200 pt-5 mt-5">
                <div className="mb-2">
                  <div className="flex items-center mb-3 gap-2">
                    <Bell size={16} className="text-gray-500 mr-1" />{" "}
                    {/* Changed to gray */}
                    <h3 className="text-base font-semibold text-gray-800">
                      Preferencias de Notificaciones
                    </h3>
                  </div>
                  <p className="text text-gray-600 mb-3">
                    {" "}
                    Configura si deseas recibir notificaciones sobre tus citas y
                    actualizaciones.
                  </p>
                  <SubscriptionSlider />
                </div>
              </div>
                    </form>
                </div>
        {showUpdatePasswordModal && (
          <UpdatePasswordModal
            onClose={() => {
              setShowUpdatePasswordModal(false);
            }}
            onSave={changePasswordSendToApi}
            showAlert={showAlert}
          />
        )}

        {/* Modal para añadir/editar servicios */}
        {showServiceModal && (
          <ServiceModal
            onClose={() => {
              setShowServiceModal(false);
              setEditingServiceIndex(null);
            }}
            onSave={handleAddService}
            editingService={
              editingServiceIndex !== null
                ? services[editingServiceIndex]
                : undefined
            }
          />
        )}

        {/* Modal para editar el horario */}
        {scheduleModalOpen && (
          <div className="schedule-modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
            <div className="schedule-modal-content">
              <div className="schedule-modal-header">
                <h2 className="schedule-modal-title">
                  Configuración de horario
                </h2>
                <button
                  className="schedule-modal-close text-white bg-white rounded-full"
                  onClick={() => setScheduleModalOpen(false)}
                  aria-label="Cerrar"
                >
                  &times;
                </button>
              </div>
              <div className="schedule-modal-body">
                <div className="schedule-calendar-container">
                  <ScheduleCalendar
                    initialSchedule={schedule}
                    onScheduleChange={setSchedule}
                    className="schedule-calendar"
                  />
                </div>
              </div>
              <div className="schedule-modal-footer flex justify-end space-x-6 mt-10 px-6 pb-6">
                <GradientButton
                  variant="edit"
                  onClick={saveScheduleToAPI}
                  className="px-6 py-2 font-medium rounded-xl"
                >
                  Guardar Horario
                </GradientButton>
                <GradientButton
                  variant="grey"
                  onClick={() => setScheduleModalOpen(false)}
                  className="px-6 py-2 font-medium rounded-xl"
                >
                  Cancelar
                </GradientButton>
              </div>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        message="¿Estás seguro de que deseas eliminar este servicio?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmModal({ isOpen: false, serviceIndex: null })}
      />
      <ConfirmModal
        isOpen={confirmRatingDelete}
        message="¿Estás seguro de que deseas eliminar tu valoración de la app?"
        onConfirm={handleConfirmRatingDelete}
        onCancel={() => setConfirmRatingDelete(false)}
      />
      {alert.show && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ ...alert, show: false })}
          duration={5000}
        />
      )}
    </div>
  );
};

export default FisioProfile;
