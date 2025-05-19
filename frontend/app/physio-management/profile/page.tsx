"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Camera,
  Plus,
  Trash2,
  Edit,
  Save,
  StarIcon,
  Film,
  Bell,
  BicepsFlexed,
  ClipboardList
} from "lucide-react";
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
import { useRouter } from "next/navigation";

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
    plan: 0,
    degree: "",
    university: "",
    experience: "",
    workplace: "",
  });

  if (profile) {
    console.log("type of plan", typeof profile.plan);
  }

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
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
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
  const router = useRouter();

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
        if (!response.data.physio.workplace)
          missingFields.push("centro de trabajo");

        // Mostrar alerta si faltan campos
        if (missingFields.length > 0) {
          showAlert(
            "warning",
            `Tu perfil profesional está incompleto. Por favor, completa los campos de ${missingFields.join(
              ", "
            )} para mejorar tu visibilidad.`
          );
        }

        try {
          let parsedServices = [];
          // Comprobar si los servicios son un string JSON o un array o un objeto
          if (typeof response.data.physio.services === "string") {
            try {
              parsedServices = JSON.parse(response.data.physio.services);
            } catch (e) {
              console.error("Error al parsear los servicios:", e);
            }
          } else if (Array.isArray(response.data.physio.services)) {
            parsedServices = response.data.physio.services;
          } else if (typeof response.data.physio.services === "object") {
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
    newPassword: string
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
      setShowUpdatePasswordModal(false);
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
    if (!newRating.opinion.trim()) {
      showAlert("error", "Por favor, escribe una opinión");
      return;
    }

    if (newRating.opinion.trim().length > 140) {
      showAlert("error", "La opinión no puede exceder los 140 caracteres.");
      return;
    }

    try {
      const url = hasRated
        ? `${getApiBaseUrl()}/api/ratings/update/${rating?.id}/`
        : `${getApiBaseUrl()}/api/ratings/create/`;

      const method = hasRated ? "put" : "post";

      const payload = {
        punctuation: newRating.punctuation,
        opinion: newRating.opinion,
        physiotherapist: profile.user.user_id,
      };

      const response = await axios({
        method,
        url,
        data: payload,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200 || response.status === 201) {
        setShowRatingForm(false);
        setHasRated(true);

        if (newRating.punctuation >= 3) {
          showAlert("success", "¡Gracias por valorar nuestra app!");
        } else {
          showAlert("success", "Valoración enviada correctamente.");
        }

        // Update local state
        setRating({
          id: response.data.id || rating?.id,
          punctuation: newRating.punctuation,
          opinion: newRating.opinion,
        });

        // Refresh rating data
        checkIfPhysioHasRated();
      }
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
        `${getApiBaseUrl()}/api/ratings/my-rating/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        setHasRated(true);
        setRating(response.data);
      } else {
        setHasRated(false);
        setRating(null);
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
        else if (value.length < 10)
          error = "Se requiere un mínimo de 10 caracteres.";
        else if (value.length > 100) error = "Máximo 100 caracteres.";
        break;
      case "university":
        if (!value) error = "La universidad es obligatoria.";
        else if (value.length < 10)
          error = "Se requiere un mínimo de 10 caracteres.";
        else if (value.length > 100) error = "Máximo 100 caracteres.";
        break;
      case "experience":
        if (!value) error = "La experiencia es obligatoria.";
        else if (value.length < 10)
          error = "Se requiere un mínimo de 10 caracteres.";
        else if (value.length > 100) error = "Máximo 100 caracteres.";
        break;
      case "workplace":
        if (!value) error = "El lugar de trabajo es obligatorio.";
        else if (value.length < 10)
          error = "Se requiere un mínimo de 10 caracteres.";
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
    else if (
      ["degree", "university", "experience", "workplace"].includes(name)
    ) {
      setProfile((prevProfile) => ({
        ...prevProfile,
        [name]: value, // Se actualiza directamente el campo del perfil
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

    const [isClosing, setIsClosing] = useState(false);

    const handleClose = () => {
      setIsClosing(true);
      setTimeout(() => {
        onClose();
      }, 300);
    };

    return (
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
          isClosing ? "opacity-0" : "opacity-100"
        }`}
        onClick={handleClose}
      >
        {/* Enhanced Backdrop with blur effect */}
        <div className="absolute inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm"></div>

        {/* Modal Container with improved styling */}
        <div
          className={`relative bg-white rounded-xl shadow-2xl max-w-xl w-full mx-4 overflow-hidden transition-all duration-300 ${
            isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with gradient background */}
          <div className="bg-gradient-to-r from-[#41B8D5] to-[#1E5ACD] p-4 text-white flex justify-between items-center">
            <h2 className="text-xl font-bold">
              {editingService ? "Editar Servicio" : "Añadir Servicio"}
            </h2>
            <span className="bg-white bg-opacity-20 text-white text-xs px-3 py-1 rounded-full">
              Servicio
            </span>
          </div>

          <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título
              </label>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#41B8D5] focus:border-transparent"
                placeholder="Nombre del servicio"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#41B8D5] focus:border-transparent"
                rows={3}
                placeholder="Descripción del servicio"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-[#41B8D5]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="font-medium">Precio</span>
                </div>
                <input
                  type="text"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  className="w-1/2 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#41B8D5] focus:border-transparent text-right"
                  placeholder="€"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-[#41B8D5]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="font-medium">Duración (minutos)</span>
                </div>
                <input
                  type="number"
                  value={duracion}
                  onChange={(e) => {
                    // Allow user to type the full number before rounding
                    const inputValue = e.target.value;
                    if (inputValue === "") {
                      setDuracion("");
                      return;
                    }
                    // Only round when user stops typing
                    const handleRounding = () => {
                      const numValue = parseInt(inputValue) || 0;
                      const roundedValue = Math.max(
                        5,
                        Math.round(numValue / 5) * 5
                      );
                      setDuracion(roundedValue.toString());
                    };
                    // Update with raw input value
                    setDuracion(inputValue);
                    // Clear any existing timeout
                    if (window.roundingTimeout) {
                      clearTimeout(window.roundingTimeout);
                    }
                    // Set new timeout to round after user stops typing
                    window.roundingTimeout = setTimeout(handleRounding, 500);
                  }}
                  min="5"
                  step="5"
                  className={`w-1/2 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#41B8D5] focus:border-transparent text-right ${
                    !duracion || parseInt(duracion) <= 0
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300 focus:ring-teal-500"
                  } focus:border-transparent focus:ring-2`}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-[#41B8D5]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <span className="font-medium">Tipo</span>
                </div>
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  className="w-1/2 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#41B8D5] focus:border-transparent text-right appearance-none"
                >
                  <option value="PRIMERA_CONSULTA">Primera consulta</option>
                  <option value="CONTINUAR_TRATAMIENTO">
                    Continuar tratamiento
                  </option>
                  <option value="OTRO">Otro</option>
                </select>
              </div>
            </div>

            {/* Questionnaire section */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-800">
                  Cuestionario personalizado
                </h3>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showQuestionnaire"
                    checked={showQuestionnaireSection}
                    onChange={() =>
                      setShowQuestionnaireSection(!showQuestionnaireSection)
                    }
                    className="w-4 h-4 text-[#41B8D5] border-gray-300 rounded focus:ring-[#41B8D5]"
                  />
                  <label
                    htmlFor="showQuestionnaire"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Incluir cuestionario
                  </label>
                </div>
              </div>

              {showQuestionnaireSection && (
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h4 className="font-medium text-gray-700 mb-2">
                      Preguntas predefinidas
                    </h4>
                    <ul className="space-y-2">
                      {questionary.elements.map((element, index) => (
                        <li
                          key={index}
                          className="flex items-center justify-between bg-white p-2 rounded border border-gray-200"
                        >
                          <div>
                            <span className="text-sm font-medium">
                              {element.label}
                            </span>
                            <span className="ml-2 text-xs text-gray-500">
                              ({element.type})
                            </span>
                          </div>
                          {index >= 5 && (
                            <button
                              type="button"
                              onClick={() => removeQuestion(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h4 className="font-medium text-gray-700 mb-2">
                      Añadir nueva pregunta
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">
                          Texto de la pregunta
                        </label>
                        <input
                          type="text"
                          value={newQuestion}
                          onChange={(e) => setNewQuestion(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#41B8D5] focus:border-transparent"
                          placeholder="Ej: ¿Tiene alguna lesión previa?"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-600 mb-1">
                          Tipo de respuesta
                        </label>
                        <select
                          value={questionType}
                          onChange={(e) => setQuestionType(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#41B8D5] focus:border-transparent"
                        >
                          <option value="Control">
                            Texto (respuesta libre)
                          </option>
                          <option value="Number">Número</option>
                          <option value="Boolean">Sí/No</option>
                        </select>
                      </div>

                      <button
                        type="button"
                        onClick={addQuestion}
                        className="w-full px-4 py-2 bg-gradient-to-r from-[#41B8D5] to-[#1E5ACD] text-white rounded-xl hover:opacity-90 transition-colors"
                      >
                        Añadir pregunta
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4 mt-2 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 bg-gradient-to-r from-[#41B8D5] to-[#1E5ACD] text-white rounded-xl hover:opacity-90 transition-colors"
              >
                {editingService ? "Actualizar" : "Añadir"}
              </button>
            </div>
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

  return loading ? (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-blue-50">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-12 w-12 rounded-full bg-blue-200 mb-4"></div>
        <div className="h-4 w-24 bg-blue-200 rounded"></div>
      </div>
    </div>
  ) : error ? (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-blue-50">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md">
        <div className="text-red-500 text-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-center mb-4">Error</h2>
        <p className="text-gray-600 text-center">{error}</p>
        <div className="mt-6 text-center">
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-teal-500 to-blue-600 text-white px-4 py-2 rounded-xl hover:from-teal-600 hover:to-blue-700 transition-all duration-200"
          >
            Reintentar
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with decorative elements */}
        <div className="relative mb-8">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

          <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-600">
              Perfil Profesional
            </span>
          </h1>
          <p className="text-center text-gray-500 text-lg max-w-2xl mx-auto mb-8">
            Gestiona tu información profesional y servicios
          </p>
        </div>
        {alert.show && (
          <div className="mb-6">
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert({ ...alert, show: false })}
            />
          </div>
        )}

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Profile photo and basic info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
              <div className="relative w-full aspect-[4/3] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <img
                  alt="Physiotherapist's photo"
                  className="min-w-[75%] h-full justify-self-center object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  src={getImageSrc()}
                />
                <label
                  htmlFor="photo-upload"
                  className="absolute bottom-[2px] right-[2px] bg-white rounded-full p-2 shadow-lg ring-2 ring-black/10 cursor-pointer hover:bg-gray-100 transition-colors z-50"
                >
                  <Camera size={24} className="text-gray-700" />
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>

              <div className="px-6 pb-8 pt-4 bg-gradient-to-r from-teal-500 to-blue-600">
                <h2 className="text-white text-xl font-bold text-center mt-4">
                  {profile.user.first_name} {profile.user.last_name}
                </h2>
                <p className="text-teal-100 text-center">
                  {profile.specializations
                    ? Array.isArray(profile.specializations)
                      ? profile.specializations.join(", ")
                      : profile.specializations
                    : "Sin especialidades"}
                </p>
              </div>

              {/* Profile information section */}
              <div className="p-6">
                <div className="space-y-4">
                  {/* Rating display */}
                  <div className="flex items-center mb-4">
                    <div className="flex items-center text-yellow-400 mr-2">
                      {profile.rating_avg ? (
                        renderStars(parseFloat(profile.rating_avg))
                      ) : (
                        <p className="text-gray-500 text-sm">
                          Sin valoraciones
                        </p>
                      )}
                    </div>
                    {profile.rating_avg && (
                      <span className="text-gray-700 font-medium">
                        {parseFloat(profile.rating_avg).toFixed(1)}
                      </span>
                    )}
                  </div>

                  {/* Plan information */}
                  <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl p-4 mb-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                      Plan actual
                    </h3>
                    <div className="flex items-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-teal-500 to-blue-600 text-white">
                        {profile.plan == 1
                          ? "Fisio Blue"
                          : profile.plan === 2
                          ? "Fisio Gold"
                          : "Sin Plan"}
                      </span>
                    </div>
                  </div>

                  {/* Contact information */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                      Información de contacto
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-gray-500 text-sm mr-2">
                          Email:
                        </span>
                        <span className="text-gray-800 text-sm">
                          {profile.user.email}
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-gray-500 text-sm mr-2">
                          Teléfono:
                        </span>
                        <span className="text-gray-800 text-sm">
                          {profile.user.phone_number || "No especificado"}
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-gray-500 text-sm mr-2">
                          Código postal:
                        </span>
                        <span className="text-gray-800 text-sm">
                          {profile.user.postal_code || "No especificado"}
                        </span>
                      </li>
                    </ul>
                  </div>

                  {/* Professional information */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                      Información profesional
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-gray-500 text-sm mr-2">
                          Nº Colegiado:
                        </span>
                        <span className="text-gray-800 text-sm">
                          {profile.collegiate_number || "No especificado"}
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-gray-500 text-sm mr-2">
                          Comunidad:
                        </span>
                        <span className="text-gray-800 text-sm">
                          {profile.autonomic_community || "No especificado"}
                        </span>
                      </li>
                    </ul>
                  </div>

                  {/* Schedule button */}
                  <div className="mt-6">
                    <GradientButton
                      variant="create"
                      className="w-full py-2 px-4 font-medium rounded-xl flex items-center justify-center gap-2"
                      onClick={() => setScheduleModalOpen(true)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Configurar Horario
                    </GradientButton>
                  </div>
                </div>
              </div>
            </div>

            {/* App Rating - Moved here from below */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
              <div className="px-6 py-4 bg-gradient-to-r from-teal-500 to-blue-600">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <StarIcon className="mr-2" size={20} />
                  Valorar la aplicación
                </h2>
              </div>

              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  Tu opinión nos ayuda a mejorar. ¿Qué te parece FisioFind hasta
                  ahora?
                </p>
                {hasRated ? (
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <div className="flex items-center mb-2">
                        <div className="flex text-yellow-400">
                          {renderStars(rating?.punctuation || 0)}
                        </div>
                        <span className="ml-2 text-gray-700 font-medium">
                          {rating?.punctuation}/5
                        </span>
                      </div>
                      <p className="text-gray-700">"{rating?.opinion}"</p>
                    </div>
                    <div className="flex space-x-3">
                      <GradientButton
                        variant="edit"
                        className="flex-1 py-2 px-4 font-medium rounded-xl flex items-center justify-center gap-2"
                        onClick={() => {
                          setNewRating({
                            punctuation: rating?.punctuation || 5,
                            opinion: rating?.opinion || "",
                          });
                          setShowRatingForm(true);
                        }}
                      >
                        <Edit size={16} />
                        Editar
                      </GradientButton>
                      <GradientButton
                        variant="grey"
                        className="flex-1 py-2 px-4 font-medium rounded-xl flex items-center justify-center gap-2"
                        onClick={handleDeleteRating}
                      >
                        <Trash2 size={16} />
                        Eliminar
                      </GradientButton>
                    </div>
                  </div>
                ) : (
                  <GradientButton
                    variant="create"
                    className="w-full py-2 px-4 font-medium rounded-xl flex items-center justify-center gap-2"
                    onClick={() => {
                      setNewRating({ punctuation: 5, opinion: "" });
                      setShowRatingForm(true);
                    }}
                  >
                    <StarIcon size={16} />
                    Valorar ahora
                  </GradientButton>
                )}
              </div>
            </div>

            {/* Notification preferences - Moved here from below */}
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
                  <Edit className="mr-2" size={20} />
                  Información Personal
                </h2>
              </div>

              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Contact information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Correo Electrónico
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          name="email"
                          value={profile.user.email}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border-2 ${
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

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Teléfono
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="phone_number"
                          value={profile.user.phone_number}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border-2 ${
                            (formErrors as { phone_number?: string })
                              ?.phone_number
                              ? "border-red-500"
                              : "border-gray-200"
                          } rounded-xl transition-all duration-200 outline-none focus:border-blue-500`}
                        />
                      </div>
                      {(formErrors as { phone_number?: string })
                        .phone_number && (
                        <p className="mt-1 text-sm text-red-600">
                          {
                            (formErrors as { phone_number?: string })
                              ?.phone_number
                          }
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Password section */}
                  <div className="py-2 flex items-center justify-start w-full gap-3">
                    <div className="relative w-[50%]">
                      <input
                        disabled
                        type="password"
                        name="password"
                        value={"******"}
                        className="w-full pl-5 pr-3 py-3 border-2 border-gray-200 rounded-xl bg-gray-50"
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

                  {/* Specializations */}
                  <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Especializaciones
                    </label>
                    <div className="border-2 border-gray-200 rounded-xl p-3 bg-white">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {selectedSpecializations.map((spec) => (
                          <div
                            key={spec}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                          >
                            {spec}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 ml-1.5 text-blue-600 hover:text-blue-800 cursor-pointer"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              onClick={() =>
                                setSelectedSpecializations((prev) =>
                                  prev.filter((s) => s !== spec)
                                )
                              }
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        ))}
                      </div>

                      <div className="relative">
                        <button
                          type="button"
                          className="w-full px-4 py-3 text-left text-black border-2 border-gray-700 rounded-xl bg-white flex justify-between items-center hover:border-gray-300 hover:text-white transition-colors duration-200 group"
                          onClick={() => setDropdownOpen(!dropdownOpen)}
                        >
                          {selectedSpecializations.length > 0
                            ? `${selectedSpecializations.length} especializaciones seleccionadas`
                            : "Selecciona tus especializaciones"}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-5 w-5 text-gray-500 transition-transform duration-200 group-hover:text-white ${
                              dropdownOpen ? "rotate-180" : ""
                            }`}
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>

                        {dropdownOpen && (
                          <div className="absolute z-10 mt-2 w-full bg-white border-2 border-gray-100 rounded-xl shadow-xl max-h-[300px] overflow-y-auto">
                            <div className="p-2">
                              {availableSpecializations
                                .filter((spec) =>
                                  spec
                                    .toLowerCase()
                                    .includes(searchQuery.toLowerCase())
                                )
                                .map((spec) => (
                                  <label
                                    key={spec}
                                    className="flex items-center px-4 py-2.5 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors duration-150"
                                  >
                                    <input
                                      type="checkbox"
                                      className="form-checkbox h-5 w-5 text-blue-600 rounded-md border-2 border-gray-300 focus:ring-blue-500 focus:ring-2 focus:ring-offset-2 transition-all duration-200"
                                      checked={selectedSpecializations.includes(
                                        spec
                                      )}
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
                                    <span className="ml-3 text-gray-700 font-medium">
                                      {spec}
                                    </span>
                                  </label>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Biography */}
                  <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Biografía
                    </label>
                    <textarea
                      name="bio"
                      value={profile.bio || ""}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Cuéntanos sobre tu experiencia y enfoque profesional..."
                      className={`w-full px-4 py-3 border-2 ${
                        formErrors.bio ? "border-red-500" : "border-gray-200"
                      } rounded-xl transition-all duration-200 outline-none focus:border-blue-500`}
                    />
                    {formErrors.bio && (
                      <p className="mt-1 text-sm text-red-600">
                        {formErrors.bio}
                      </p>
                    )}
                  </div>

                  {/* Professional information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Titulación <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="degree"
                        value={profile.degree || ""}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border-2 ${
                          formErrors.degree
                            ? "border-red-500"
                            : "border-gray-200"
                        } rounded-xl transition-all duration-200 outline-none focus:border-blue-500`}
                      />
                      {formErrors.degree && (
                        <p className="mt-1 text-sm text-red-600">
                          {formErrors.degree}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Universidad <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="university"
                        value={profile.university || ""}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border-2 ${
                          formErrors.university
                            ? "border-red-500"
                            : "border-gray-200"
                        } rounded-xl transition-all duration-200 outline-none focus:border-blue-500`}
                      />
                      {formErrors.university && (
                        <p className="mt-1 text-sm text-red-600">
                          {formErrors.university}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Experiencia <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="experience"
                      value={profile.experience || ""}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Describe tu experiencia profesional..."
                      className={`w-full px-4 py-3 border-2 ${
                        formErrors.experience
                          ? "border-red-500"
                          : "border-gray-200"
                      } rounded-xl transition-all duration-200 outline-none focus:border-blue-500`}
                    />
                    {formErrors.experience && (
                      <p className="mt-1 text-sm text-red-600">
                        {formErrors.experience}
                      </p>
                    )}
                  </div>

                  <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lugar de trabajo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="workplace"
                      value={profile.workplace || ""}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border-2 ${
                        formErrors.workplace
                          ? "border-red-500"
                          : "border-gray-200"
                      } rounded-xl transition-all duration-200 outline-none focus:border-blue-500`}
                    />
                    {formErrors.workplace && (
                      <p className="mt-1 text-sm text-red-600">
                        {formErrors.workplace}
                      </p>
                    )}
                  </div>

                  {/* Submit and Delete buttons */}
                  <div className="mt-4 flex gap-4 items-center">
                    <GradientButton
                      variant="edit"
                      className="flex-1 py-4 px-6 font-semibold rounded-xl flex items-center justify-center gap-2"
                    >
                      <Save size={18} />
                      Actualizar Perfil
                    </GradientButton>
                    <GradientButton
                      variant="red"
                      onClick={() => setShowDeleteAccountModal(true)}
                      className="flex-1 py-4 px-6 font-semibold rounded-xl flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white"
                    >
                      <Trash2 size={18} />
                      Eliminar Cuenta
                    </GradientButton>
                  </div>
                </form>
              </div>
            </div>

            {/* Services section */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
              <div className="px-6 py-4 bg-gradient-to-r from-teal-500 to-blue-600 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <Film className="mr-2" size={20} />
                  Servicios
                </h2>
                <GradientButton
                  variant="create"
                  className="px-3 py-2 font-medium rounded-xl flex items-center gap-2"
                  onClick={(e) => {
                    e.preventDefault();
                    setEditingServiceIndex(null);
                    setShowServiceModal(true);
                  }}
                >
                  <Plus className="w-4 h-4" /> Añadir
                </GradientButton>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-white">Cuestionarios</h3>
                  {id && (
                    <Link href={`/questionnaires`} passHref>
                    <GradientButton
                      variant="create"
                      className="px-3 py-2 font-medium rounded-xl flex items-center gap-2"
                    >
                      <ClipboardList className="w-4 h-4" /> Cuestionarios 
                      Personalizables
                    </GradientButton>
                  </Link>
                  )}
                </div>
              </div>

              <div className="p-6">
                {services.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-500">
                      No hay servicios registrados
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Añade servicios para que los pacientes puedan reservar
                      citas contigo
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {services.map((service, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-gray-800">
                              {service.titulo}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {service.descripcion}
                            </p>
                            <div className="flex items-center mt-2 space-x-4">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {service.duracion} min
                              </span>
                              <span className="text-sm font-medium text-gray-900">
                                {service.precio}
                              </span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditService(index)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteService(index)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Exercises section */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
              <div className="px-6 py-4 bg-gradient-to-r from-teal-500 to-blue-600">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <BicepsFlexed className="mr-2" size={20} />
                  Ejercicios
                </h2>
              </div>

              <div className="p-6">
                <div className="text-center">
                  {id && (
                    <Link href={`/physio-management/${id}/exercises`} passHref>
                      <GradientButton
                        variant="create"
                        className="px-4 py-3 font-medium rounded-xl flex items-center justify-center gap-2 w-full"
                      >
                        <BicepsFlexed className="w-5 h-5" />
                        Acceder a Biblioteca de Ejercicios
                      </GradientButton>
                    </Link>
                  )}
                  <p className="text-sm text-gray-500 mt-3">
                    Gestiona tu biblioteca de ejercicios para asignarlos a tus
                    pacientes
                  </p>
                </div>
              </div>
            </div>
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
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
              <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden">
                <div className="px-6 py-4 bg-gradient-to-r from-teal-500 to-blue-600 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-white flex items-center">
                    <svg
                      className="mr-2"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect
                        x="3"
                        y="4"
                        width="18"
                        height="18"
                        rx="2"
                        ry="2"
                      ></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    Configuración de Horario
                  </h2>
                  <button
                    className="text-white hover:text-gray-200 transition-colors"
                    onClick={() => setScheduleModalOpen(false)}
                    aria-label="Cerrar"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="p-6 max-h-[80vh] overflow-y-auto">
                  <div className="mb-4">
                    <p className="text-gray-600 mb-4">
                      Configura los días y horarios en los que estás disponible
                      para atender pacientes.
                    </p>
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md mb-6">
                      <div className="flex">
                        <svg
                          className="text-blue-500 mr-2 w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <div>
                          <p className="text-sm text-blue-700 font-medium">
                            Consejos para configurar tu horario:
                          </p>
                          <ul className="text-sm text-blue-600 mt-1 list-disc list-inside">
                            <li>
                              Selecciona los días en que atiendes pacientes
                            </li>
                            <li>
                              Define tus horas de inicio y fin para cada día
                            </li>
                            <li>
                              Puedes establecer diferentes horarios para cada
                              día de la semana
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="schedule-calendar-container">
                    <ScheduleCalendar
                      initialSchedule={schedule}
                      onScheduleChange={setSchedule}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
                  <GradientButton
                    variant="grey"
                    onClick={() => setScheduleModalOpen(false)}
                    className="px-4 py-2 rounded-xl"
                  >
                    Cancelar
                  </GradientButton>
                  <GradientButton
                    variant="edit"
                    onClick={saveScheduleToAPI}
                    className="px-4 py-2 rounded-xl"
                  >
                    Guardar Horario
                  </GradientButton>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Confirmation modals */}
        <ConfirmModal
          isOpen={confirmModal.isOpen}
          message="¿Estás seguro de que deseas eliminar este servicio?"
          onConfirm={handleConfirmDelete}
          onCancel={() =>
            setConfirmModal({ isOpen: false, serviceIndex: null })
          }
        />

        <ConfirmModal
          isOpen={confirmRatingDelete}
          message="¿Estás seguro de que deseas eliminar tu valoración de la app?"
          onConfirm={handleConfirmRatingDelete}
          onCancel={() => setConfirmRatingDelete(false)}
        />

        {/* Rating Form Modal */}
        {showRatingForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md">
              <h3 className="text-xl font-bold text-[#05668D] mb-4">
                {hasRated ? "Editar" : "Valorar la aplicación"}
              </h3>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Puntuación</label>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setNewRating({ ...newRating, punctuation: star })
                      }
                      className="focus:outline-none"
                    >
                      <svg
                        className={`w-8 h-8 ${
                          star <= newRating.punctuation
                            ? "text-yellow-500"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Opinión</label>
                <textarea
                  value={newRating.opinion}
                  onChange={(e) =>
                    setNewRating({
                      ...newRating,
                      opinion: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Comparte tu experiencia con la aplicación..."
                ></textarea>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowRatingForm(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmitRating}
                  className="px-4 py-2 bg-gradient-to-r from-[#41B8D5] to-[#1E5ACD] text-white rounded-md hover:opacity-90"
                >
                  {hasRated ? "Actualizar" : "Enviar"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Account Modal */}
        {showDeleteAccountModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-xl">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                ¿Estás seguro de que quieres eliminar tu cuenta?
              </h2>
              <p className="mb-4 text-gray-600">
                Esta acción no se podrá deshacer.
              </p>
              <p className="mb-6 text-gray-600">
                Si eliminas tu cuenta todos tus datos personales, tratamientos,
                vídeos y archivos subidos e historial serán eliminados. Si
                realmente deseas ejercer el derecho a eliminar tus datos,
                escribe un correo a info@fisiofind.com con asunto [Eliminar mi
                cuenta] y procederemos a eliminar tus datos.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowDeleteAccountModal(false)}
                  className="px-6 py-2 rounded-lg text-white bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                >
                  Cancelar
                </button>
                <a
                  href="mailto:info@fisiofind.com?subject=[Eliminar mi cuenta]"
                  className="px-6 py-2 rounded-lg text-white bg-blue-500 hover:bg-blue-600 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                >
                  Enviar correo
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Alert component */}
        {alert.show && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert({ ...alert, show: false })}
            duration={5000}
          />
        )}
      </div>
    </div>
  );
};

export default FisioProfile;
