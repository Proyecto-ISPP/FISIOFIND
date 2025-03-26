"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Camera, Plus, Trash2, Edit, Save } from 'lucide-react';
import ScheduleCalendar from "@/components/ui/ScheduleCalendar";
import { getApiBaseUrl } from "@/utils/api";
import { GradientButton } from "@/components/ui/gradient-button";

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
    });

    const [editingServiceIndex, setEditingServiceIndex] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [formErrors, setFormErrors] = useState({});
    const [showServiceModal, setShowServiceModal] = useState(false);
    const [services, setServices] = useState<Service[]>([]);
    const availableSpecializations = [
        'Deportiva',
        'Ortopédica y Traumatológica',
        'Neurológica',
        'Pediátrica',
        'Obstetricia y Suelo pélvico',
        'Geriátrica',
        'Oncológica',
        'Cardiovascular',
        'Respiratoria'
    ];
    const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
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

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownOpen && !e.target.closest('.custom-dropdown')) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [dropdownOpen]);

    useEffect(() => {
        fetchFisioProfile();
        return () => {
            if (profile.user.photo && profile.user.photo.startsWith('blob:')) {
                URL.revokeObjectURL(profile.user.photo);
            }
        };
    }, [token, isClient]);

    const fetchFisioProfile = async () => {
        if (isClient) {
            try {
                const storedToken = getAuthToken();
                setToken(storedToken)
                if (!storedToken) {
                    setError("No hay token disponible.");
                    setLoading(false);
                    return;
                }

                const response = await axios.get(`${getApiBaseUrl()}/api/app_user/current-user/`, {
                    headers: { Authorization: `Bearer ${storedToken}` },
                });

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
                });
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
                    if (parsedServices && typeof parsedServices === 'object' && !Array.isArray(parsedServices)) {
                        Object.entries(parsedServices).forEach(([key, value]: [string, any]) => {
                            serviceList.push({
                                id: value.id || null,
                                titulo: value.title || key,
                                tipo: value.tipo || "PRIMERA_CONSULTA",
                                descripcion: value.description || "",
                                precio: value.price ? `${value.price}€` : "",
                                duracion: typeof value.duration === 'string' ? value.duration : `${value.duration} minutos`,
                                custom_questionnaire: value["custom_questionnaire"] || null
                            });
                        });
                    } else if (Array.isArray(parsedServices)) {
                        // Si ya es un array
                        serviceList = parsedServices.map((service) => ({
                            id: service.id || null,
                            titulo: service.titulo || service.title || "",
                            tipo: service.tipo || "PRIMERA_CONSULTA",
                            descripcion: service.descripcion || service.description || "",
                            precio: service.precio || (service.price ? `${service.price}€` : ""),
                            duracion: service.duracion || (service.duration ? `${service.duration} minutos` : ""),
                            custom_questionnaire: service["custom_questionnaire"] || service.custom_questionnaire || null
                        }));
                    }

                    setServices(serviceList);
                    setProfile((prevProfile) => ({ ...prevProfile, services: serviceList }));
                } catch (e) {
                    console.error("Error al procesar los servicios:", e);
                    setServices([]);
                }
                if (response.data.physio.schedule) {
                    setSchedule(JSON.parse(response.data.physio.schedule));
                }
                if (response.data.physio.specializations) {
                    const specs = Array.isArray(response.data.physio.specializations)
                        ? response.data.physio.specializations
                        : response.data.physio.specializations.split(',');

                    setSelectedSpecializations(specs);
                }
            } catch {
                setError("Error obteniendo el perfil.");
            } finally {
                setLoading(false);
            }
        }
    };


    // Funciones para gestionar servicios con la API
    const addServiceToAPI = async (serviceData: Service): Promise<number | null> => {
        try {
            console.log("serviceData", serviceData);
            // Preparar el servicio en el formato que espera el backend
            const serviceForBackend = {
                title: serviceData.titulo,
                description: serviceData.descripcion,
                price: parseFloat(serviceData.precio.replace('€', '').trim()),
                duration: serviceData.duracion,
                tipo: serviceData.tipo,
                custom_questionnaire: serviceData.custom_questionnaire ? {
                    "UI Schema": serviceData.custom_questionnaire
                } : null
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
                alert(`Error: ${JSON.stringify(error.response.data)}`);
            } else {
                alert("Error al añadir el servicio.");
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
                price: parseFloat(serviceData.precio.replace('€', '').trim()),
                duration: serviceData.duracion,
                tipo: serviceData.tipo,
                custom_questionnaire: serviceData.custom_questionnaire ? {
                    "UI Schema": serviceData.custom_questionnaire
                } : null
            };

            const response = await axios.put(
                `${getApiBaseUrl()}/api/app_user/physio/update-service/${serviceId}/`,
                serviceForBackend,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.status === 200) {
                return response.data.services;
            }
            else {
                throw new Error("Error al actualizar el servicio");
            }
        } catch (error) {
            console.error("Error al actualizar servicio:", error);
            if (error.response) {
                alert(`Error: ${JSON.stringify(error.response.data)}`);
            } else {
                alert("Error al actualizar el servicio.");
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
                alert(`Error: ${JSON.stringify(error.response.data)}`);
            } else {
                alert("Error al eliminar el servicio.");
            }
            return false;
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

        return Object.entries(schedule.weekly_schedule)
            .map(([day, ranges]) => {
                if (ranges.length === 0) return null;

                const timeRanges = ranges.map((interval) => `${interval[0].start} - ${interval[0].end}`).join(", ");
                return `${daysOfWeek[day]}: ${timeRanges}`;
            })
            .filter(Boolean)
            .join("\n") || "No se ha configurado horario";
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
                else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Formato de email inválido.";
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
        }

        setFormErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
        return error === "";
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        validateField(name, value); // Validar cada campo en tiempo real

        if (name === "bio") {
            setProfile((prevProfile) => ({ ...prevProfile, bio: value }));
        } else {
            setProfile((prevProfile) => ({
                ...prevProfile,
                user: { ...prevProfile.user, [name]: value },
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validar todos los campos antes de enviar
        const isValid = ["email", "phone_number", "postal_code", "bio"].every((field) =>
            validateField(field, (field === "bio" ? profile.bio : profile.user[field]) || "")
        );

        if (!isValid) {
            alert("Por favor, corrige los errores antes de enviar.");
            return;
        }

        try {
            if (!token) {
                setError("No hay token disponible.");
                return;
            }

            const formData = new FormData();
            Object.entries(profile.user).forEach(([key, value]) => {
                if (key !== "photo" && key !== "photoFile" && value) formData.append(`user.${key}`, value);
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
            formData.append("specializations", JSON.stringify(selectedSpecializations));
            // Actualizar el schedule con los datos actuales del calendario
            const { initialized, ...scheduleWithoutInitialized } = schedule;
            formData.append("schedule", JSON.stringify(scheduleWithoutInitialized));

            // formData.append("services", JSON.stringify(services));

            const response = await axios.put(`${getApiBaseUrl()}/api/app_user/physio/update/`, formData, {
                headers: { Authorization: "Bearer " + token, "Content-Type": "multipart/form-data" },
            });

            if (response.status === 200) {
                alert("Perfil actualizado correctamente");
                fetchFisioProfile();
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            if (error.response) {
                alert(`Error: ${JSON.stringify(error.response.data)}`);
            } else {
                alert("Error actualizando el perfil.");
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
                    photoFile: file,   // For backend submission
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
                    const services = await updateServiceInAPI(serviceToEdit.id, newService);

                    if (services) {
                        const serviceList: Service[] = [];
                        // Actualizar el estado local solo si la API devuelve éxito
                        Object.entries(services).forEach(([key, value]: [string, any]) => {
                            serviceList.push({
                                id: value.id || null,
                                titulo: value.title || key,
                                tipo: value.tipo || "PRIMERA_CONSULTA",
                                descripcion: value.description || "",
                                precio: value.price ? `${value.price}€` : "",
                                duracion: typeof value.duration === 'string' ? value.duration : `${value.duration} minutos`,
                                custom_questionnaire: value["custom_questionnaire"] || null
                            });
                        });
                        setServices(serviceList);
                        setProfile(prev => ({ ...prev, services: serviceList }));
                        alert("Servicio actualizado correctamente");
                    } else {
                        alert("Error al actualizar el servicio");
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
                                tipo: value.tipo || "PRIMERA_CONSULTA",
                                descripcion: value.description || "",
                                precio: value.price ? `${value.price}€` : "",
                                duracion: typeof value.duration === 'string' ? value.duration : `${value.duration} minutos`,
                                custom_questionnaire: value["custom_questionnaire"] || null
                            });
                        });
                        setServices(serviceList);
                        setProfile(prev => ({ ...prev, services: serviceList }));
                        alert("Servicio actualizado correctamente");
                    } else {
                        alert("Error al añadir el servicio");
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
                            tipo: value.tipo || "PRIMERA_CONSULTA",
                            descripcion: value.description || "",
                            precio: value.price ? `${value.price}€` : "",
                            duracion: typeof value.duration === 'string' ? value.duration : `${value.duration} minutos`,
                            custom_questionnaire: value["custom_questionnaire"] || null
                        });
                    });
                    setServices(serviceList);
                    setProfile(prev => ({ ...prev, services: serviceList }));
                    alert("Servicio añadido correctamente");
                } else {
                    alert("Error al añadir el servicio");
                }
            }
        } catch (error) {
            console.error("Error al gestionar el servicio:", error);
            alert("Error al procesar la operación");
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
        if (window.confirm("¿Estás seguro de que deseas eliminar este servicio?")) {
            try {
                const serviceToDelete = services[index];

                if (serviceToDelete.id) {
                    // Eliminar de la API
                    const success = await deleteServiceFromAPI(serviceToDelete.id);

                    if (success) {
                        // Solo actualizar el estado local si la API devuelve éxito
                        const updatedServices = [...services];
                        updatedServices.splice(index, 1);
                        setServices(updatedServices);
                        setProfile(prev => ({ ...prev, services: updatedServices }));
                        alert("Servicio eliminado correctamente");
                    } else {
                        alert("Error al eliminar el servicio");
                    }
                } else {
                    // Si no tiene ID, es un servicio que nunca se guardó en la API
                    alert("No se puede eliminar un servicio que no ha sido guardado");
                }
            } catch (error) {
                console.error("Error al eliminar el servicio:", error);
                alert("Error al eliminar el servicio");
            }
        }
    };


    const ServiceModal = ({ onClose, onSave, editingService = null }: { onClose: () => void; onSave: (service: Service) => void; editingService?: Service | null }) => {
        // Inicializar con valores del servicio a editar o valores por defecto
        const [tipo, setTipo] = useState(editingService?.tipo || "PRIMERA_CONSULTA");
        const [titulo, setTitulo] = useState(editingService?.titulo || "");
        const [descripcion, setDescripcion] = useState(editingService?.descripcion || "");
        const [precio, setPrecio] = useState(editingService?.precio || "");
        const [duracion, setDuracion] = useState(() => {
            if (editingService) {
                if (typeof editingService.duracion === 'number') {
                    return String(editingService.duracion);
                } else if (typeof editingService.duracion === 'string') {
                    // Extraer solo los dígitos de la cadena
                    const match = editingService.duracion.match(/\d+/);
                    return match ? match[0] : "60";
                }
            }
            return "60"; // Valor por defecto
        });

        // Estado para gestionar el cuestionario
        const [showQuestionnaireSection, setShowQuestionnaireSection] = useState(() => {
            // Verificar si el servicio que estamos editando tiene un cuestionario
            if (editingService?.custom_questionnaire) {
                if (editingService.custom_questionnaire.elements ||
                    editingService.custom_questionnaire["UI Schema"]?.elements) {
                    return true;
                }
            }
            return false;
        });
        const [questionary, setQuestionary] = useState<Questionary>(() => {
            const defaultQuestionary: Questionary = {
                type: "Group",
                label: "Cuestionario Personalizado",
                elements: [
                    {
                        type: "Number",
                        label: "Peso (kg)",
                        scope: "#/properties/peso"
                    },
                    {
                        type: "Number",
                        label: "Altura (cm)",
                        scope: "#/properties/altura"
                    },
                    {
                        type: "Number",
                        label: "Edad",
                        scope: "#/properties/edad"
                    },
                    {
                        type: "Control",
                        label: "Nivel de actividad física",
                        scope: "#/properties/actividad_fisica"
                    },
                    {
                        type: "Control",
                        label: "Motivo de la consulta",
                        scope: "#/properties/motivo_consulta"
                    }
                ]
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
                else if (editingService.custom_questionnaire.type && editingService.custom_questionnaire.type === "Group") {
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
                scope: generateScope(newQuestion)
            };

            setQuestionary({
                ...questionary,
                elements: [...questionary.elements, newElement]
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
                elements: updatedElements
            });
        };

        // Handle custom title based on type
        useEffect(() => {
            if (tipo === "PRIMERA_CONSULTA" && !editingService) {
                setTitulo("Primera consulta");
            } else if (tipo === "CONTINUAR_TRATAMIENTO" && !editingService) {
                setTitulo("Continuación de tratamiento");
            }
        }, [tipo]);

        const handleSave = () => {
            // Validación básica
            if (!titulo.trim()) {
                alert("El título es obligatorio");
                return;
            }

            if (!precio.trim()) {
                alert("El precio es obligatorio");
                return;
            }

            if (!duracion || parseInt(duracion) <= 0) {
                alert("La duración debe ser mayor a 0 minutos");
                return;
            }

            const newService = {
                tipo,
                titulo,
                descripcion,
                precio,
                duracion: parseInt(duracion),
                ...(showQuestionnaireSection ? { custom_questionnaire: questionary } : {})
            };

            onSave(newService);
        };

        return (
            <div className="modal-overlay">
                <div className="modal-content">
                    <h2>{editingService ? "Editar servicio" : "Añadir servicio"}</h2>

                    <label>Tipo de servicio:</label>
                    <select value={tipo} onChange={(e) => setTipo(e.target.value as string)}>
                        <option value="PRIMERA_CONSULTA">Primera consulta</option>
                        <option value="CONTINUAR_TRATAMIENTO">Continuar tratamiento</option>
                        <option value="OTRO">Otro</option>
                    </select>

                    <label>Título: <span className="required">*</span></label>
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

                    <label>Precio por consulta: <span className="required">*</span></label>
                    <input
                        type="text"
                        value={precio}
                        onChange={(e) => setPrecio(e.target.value)}
                        placeholder="€"
                        className={!precio.trim() ? "error-input" : ""}
                    />

                    <label>Duración (minutos): <span className="required">*</span></label>
                    <input
                        type="number"
                        value={duracion}
                        onChange={(e) => setDuracion(e.target.value)}
                        min="1"
                        placeholder="60"
                        className={!duracion || parseInt(duracion) <= 0 ? "error-input" : ""}
                    />

                    <div className="questionnaire-toggle">
                        <label>
                            Incluir cuestionario pre-intervención
                            <input
                                type="checkbox"
                                checked={showQuestionnaireSection}
                                onChange={() => setShowQuestionnaireSection(!showQuestionnaireSection)}
                            />
                            <span></span>
                        </label>
                        <p className="toggle-description">
                            Agrega un formulario personalizado que el paciente rellenará antes de su cita
                        </p>
                    </div>

                    {showQuestionnaireSection && (
                        <div className="questionnaire-section">
                            <p className="note">Las siguientes preguntas ya están incluidas por defecto:</p>

                            <ul className="questions-list">
                                {questionary && questionary.elements ? (
                                    questionary.elements.map((element, index) => (
                                        <li key={index} className={index < 5 ? "default-question" : ""}>
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
                                            onChange={(e) => setNewQuestion(e.target.value)}
                                            placeholder="Ej. ¿Tiene alguna lesión previa?"
                                        />
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
                                    {questionType === "Control" ?
                                        "El campo de texto permite cualquier respuesta textual." :
                                        "El campo numérico solo permitirá introducir números."}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="modal-buttons">
                        <GradientButton variant="edit" onClick={handleSave}>Guardar</GradientButton>
                        <GradientButton variant="grey" onClick={onClose}>Cancelar</GradientButton>
                    </div>
                </div>
            </div>
        );
    };



    if (loading) return <p>Cargando perfil...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div 
            className="min-h-screen flex items-center justify-center px-6" 
            style={{ backgroundColor: "rgb(238, 251, 250)" }}
        >
            <div className="w-full max-w-5xl bg-white shadow-lg rounded-2xl overflow-hidden grid grid-cols-3">
                {/* Barra lateral izquierda - Sección de perfil */}
                <div className="col-span-1 bg-blue-600 text-white p-6 flex flex-col items-center">
                    <div className="relative mb-4">
                        <img 
                            src={getImageSrc()} 
                            alt="Perfil" 
                            className="w-40 h-40 rounded-full object-cover border-4 border-white"
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
                    
                    <h2 className="text-xl font-bold mb-2">{profile.user.username}</h2>
                    <p className="text-blue-200 mb-4">Profesional</p>
                    
                    {/* Sección de horario */}
                    <div className="w-full mt-4">
                        <h3 className="text-lg font-semibold mb-2">Mi Horario</h3>
                        <p className="text-blue-200">{getScheduleSummary()}</p>
                        <br></br>
                        <GradientButton 
                            variant="edit"
                            onClick={() => setScheduleModalOpen(true)}
                        >
                            Editar Horario
                        </GradientButton>
                    </div>
                </div>

                {/* Contenido derecho - Sección de formulario */}
                <div className="col-span-2 p-8 space-y-6">
                    {/* Formulario de actualización de perfil */}
                    <form onSubmit={handleSubmit} className="space- y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                                <input 
                                    type="email" 
                                    name="email"
                                    value={profile.user.email} 
                                    onChange={handleChange}
                                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                                />
                                {formErrors.email && <span className="text-red-500 text-sm">{formErrors.email}</span>}
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                                <input 
                                    type="text" 
                                    name="phone_number"
                                    value={profile.user.phone_number} 
                                    onChange={handleChange}
                                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                                />
                                {formErrors.phone_number && <span className="text-red-500 text-sm">{formErrors.phone_number}</span>}
                            </div>
                        </div>

                        {/* Desplegable de especializaciones */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Especializaciones</label>
                            <div className="relative">
                                <div 
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="border border-gray-300 rounded-md py-2 px-3 cursor-pointer"
                                >
                                    {selectedSpecializations.length > 0 
                                        ? `${selectedSpecializations.length} seleccionadas` 
                                        : "Seleccionar Especializaciones"}
                                </div>
                                {dropdownOpen && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                                        <input 
                                            type="text" 
                                            placeholder="Buscar especializaciones..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full p-2 border-b"
                                        />
                                        {availableSpecializations
                                            .filter(spec => 
                                                spec.toLowerCase().includes(searchQuery.toLowerCase())
                                            )
                                            .map(spec => (
                                                <div 
                                                    key={spec} 
                                                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                                    onClick={() => {
                                                        setSelectedSpecializations(prev => 
                                                            prev.includes(spec) 
                                                                ? prev.filter(s => s !== spec)
                                                                : [...prev, spec]
                                                        );
                                                    }}
                                                >
                                                    <input 
                                                        type="checkbox" 
                                                        checked={selectedSpecializations.includes(spec)}
                                                        readOnly
                                                        className="mr-2"
                                                    />
                                                    {spec}
                                                </div>
                                            ))
                                        }
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Biografía */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Biografía</label>
                            <textarea 
                                name="bio"
                                value={profile.bio || ""} 
                                onChange={handleChange}
                                rows={4}
                                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                            />
                            {formErrors.bio && <span className="text-red-500 text-sm">{formErrors.bio}</span>}
                        </div>

                        {/* Sección de servicios */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold">Servicios</h3>
                                <GradientButton 
                                    variant="create"
                                    onClick={(e) => {
                                        e.preventDefault(); // Esto evita que se envíe el formulario
                                        setEditingServiceIndex(null);
                                        setShowServiceModal(true);
                                    }}
                                >
                                    <Plus className="mr-2 w-4 h-4" /> Añadir Servicio
                                </GradientButton>
                            </div>

                            {services.length === 0 ? (
                                <p className="text-gray-500 text-center">No hay servicios registrados</p>
                            ) : (
                                <div className="space-y-3">
                                    {services.map((service, index) => (
                                        <div 
                                            key={index} 
                                            className="border rounded-md p-3 flex justify-between items-center"
                                        >
                                            <div>
                                                <h4 className="font-semibold">{service.titulo}</h4>
                                                <p className="text-sm text-gray-600">{service.descripcion}</p>
                                            </div>
                                            <div className="flex space-x-2">
                                                <GradientButton
                                                    variant="edit"
                                                    onClick={() => handleEditService(index)}
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </GradientButton>
                                                <GradientButton 
                                                    variant="danger"
                                                    onClick={() => handleDeleteService(index)}
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

                        <GradientButton
                            variant="edit"
                            className="mt-8 w-full py-4 px-6 bg-gradient-to-r from-[#1E5ACD] to-[#3a6fd8] text-white font-semibold rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-center"
                        >
                            <Save size={18} className="mr-2" />
                            Actualizar Perfil
                        </GradientButton>
                    </form>
                </div>

                  {/* Modal para añadir/editar servicios */}
                  {showServiceModal && (
                    <ServiceModal
                        onClose={() => {
                            setShowServiceModal(false);
                            setEditingServiceIndex(null);
                        }}
                        onSave={handleAddService}
                        editingService={editingServiceIndex !== null ? services[editingServiceIndex] : undefined}
                    />
                )}

                {/* Modal para editar el horario */}
                {scheduleModalOpen && (
                    <div className="schedule-modal-overlay">
                        <div className="schedule-modal-content">
                            <div className="schedule-modal-header">
                                <h2 className="schedule-modal-title">Configuración de horario</h2>
                                <GradientButton
                                    className="schedule-modal-close"
                                    onClick={() => setScheduleModalOpen(false)}
                                    aria-label="Cerrar"
                                >
                                    &times;
                                </GradientButton>
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
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FisioProfile;