"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import "./photo.scss";
import ScheduleCalendar from "@/components/ui/ScheduleCalendar";
import { getApiBaseUrl } from "@/utils/api";

const getAuthToken = () => {
    return localStorage.getItem("token"); // Obtiene el token JWT
};

const FisioProfile = () => {
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
        services: ""
    });

    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [formErrors, setFormErrors] = useState({});
    const [showServiceModal, setShowServiceModal] = useState(false);
    const [services, setServices] = useState([]);
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

    const handleAddService = (newService) => {
        setServices([...services, newService]);
        setShowServiceModal(false);
    };

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
                    services: response.data.physio.services
                });
                if (response.data.physio.services) {
                    setServices(JSON.parse(response.data.physio.services));
                }
                if (response.data.physio.schedule) {
                    setSchedule(JSON.parse(response.data.physio.schedule));
                }
            } catch {
                setError("Error obteniendo el perfil.");
            } finally {
                setLoading(false);
            }
        }
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
                if (value.length > 500) error = "Máximo 500 caracteres.";
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
            formData.append("bio", profile.bio || "");
            formData.append("rating_avg", profile.rating_avg || "");
            
            // Actualizar el schedule con los datos actuales del calendario
            const { initialized, ...scheduleWithoutInitialized } = schedule;
            formData.append("schedule", JSON.stringify(scheduleWithoutInitialized));
            
            formData.append("services", JSON.stringify(services));

            const response = await axios.post(`${getApiBaseUrl()}/api/app_user/physio/update/`, formData, {
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
            // Crear URL para vista previa
            const previewUrl = URL.createObjectURL(file);

            // Actualizar el estado con el archivo y la URL de vista previa
            setProfile((prevProfile) => ({
                ...prevProfile,
                user: {
                    ...prevProfile.user,
                    photo: previewUrl, // Para mostrar en la interfaz
                    photoFile: file,    // Para enviar al backend
                    preview: previewUrl
                },
            }));
        }
    };

    const getImageSrc = () => {
        // Verifica si hay un previewUrl (es decir, si el usuario ha subido una imagen)
        if (profile.user.preview) {
            return profile.user.photo; // Si existe una foto en el estado, usarla
        }

        // Si no existe un previewUrl, entonces usar la imagen del backend si está disponible
        if (profile?.user?.photo) {
            return `${getApiBaseUrl()}/api/app_user${profile.user.photo}`;
        }

        // Si no hay foto, usar la imagen por defecto
        return "/default_avatar.png";
    };

    const ServiceModal = ({ onClose, onSave }) => {
        const [titulo, setTitulo] = useState("");
        const [descripcion, setDescripcion] = useState("");
        const [precio, setPrecio] = useState("");
        const [frecuencia, setFrecuencia] = useState("diaria"); // Valor por defecto
        const [duracion, setDuracion] = useState("");
        const [unidadDuracion, setUnidadDuracion] = useState("días"); // Valor por defecto

        const handleSave = () => {
            const newService = { titulo, descripcion, precio, frecuencia, duracion: `${duracion} ${unidadDuracion}` };
            onSave(newService);
        };

        return (
            <div className="modal-overlay">
                <div className="modal-content">
                    <h2>Añadir servicio</h2>
                    <label>Título:</label>
                    <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} />

                    <label>Descripción:</label>
                    <textarea value={descripcion ? descripcion : ""} onChange={(e) => setDescripcion(e.target.value)} />

                    <label>Precio:</label>
                    <input type="text" value={precio} placeholder="€ / consulta" onChange={(e) => setPrecio(e.target.value)} />

                    <label>Frecuencia:</label>
                    <select value={frecuencia} onChange={(e) => setFrecuencia(e.target.value)}>
                        <option value="diaria">Diaria</option>
                        <option value="semanal">Semanal</option>
                        <option value="quincenal">Quincenal</option>
                        <option value="mensual">Mensual</option>
                        <option value="trimestral">Trimestral</option>
                        <option value="semestral">Semestral</option>
                    </select>

                    <label>Duración:</label>
                    <div className="duration-input">
                        <input
                            type="number"
                            value={duracion}
                            onChange={(e) => setDuracion(e.target.value)}
                            placeholder="Duración"
                        />
                        <select value={unidadDuracion} onChange={(e) => setUnidadDuracion(e.target.value)}>
                            <option value="días">Días</option>
                            <option value="semanas">Semanas</option>
                            <option value="meses">Meses</option>
                        </select>
                    </div>

                    <button onClick={handleSave}>Guardar</button>
                    <button onClick={onClose}>Cancelar</button>
                </div>
            </div>
        );
    };




    if (loading) return <p>Cargando perfil...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="user-profile-container">
            {/* Sección izquierda con la foto y datos principales */}
            <div className="user-profile-left">
                <div className="profile-pic">
                    <label className="-label" htmlFor="file">
                        <span className="glyphicon glyphicon-camera"></span>
                        <span>Change Image</span>
                    </label>
                    <input id="file" type="file" accept="image/*" onChange={handleFileChange} />
                    <img
                        src={getImageSrc()}
                        alt="Profile"
                        width="200"
                    />
                </div>
                <div className="user-info">
                    <p>{profile?.user?.username || "Nombre de usuario"}</p>
                    <p>{profile?.user?.first_name + " " + profile?.user?.last_name || "Nombre"}</p>
                    <p>DNI: {profile?.user?.dni || "No disponible"}</p>
                    <p>Número de colegiado: {profile?.collegiate_number || "No disponible"}</p>
                    <p>Colegio: {profile?.autonomic_community || "No disponible"}</p>
                </div>
                <h3 className="mt-4 mb-2 font-bold">Calendario de disponibilidad</h3>
                <ScheduleCalendar 
                    initialSchedule={schedule} 
                    onScheduleChange={handleScheduleChange}
                />
            </div>

            {/* Sección derecha con el formulario */}
            <div className="user-profile-right">
                <form onSubmit={handleSubmit}>
                    <label>Email:</label>
                    <input type="email" name="email" value={profile.user.email} onChange={handleChange} />
                    <span className="error-message">{formErrors["email"]}</span>

                    <label>Teléfono:</label>
                    <input type="text" name="phone_number" value={profile.user.phone_number} onChange={handleChange} />
                    <span className="error-message">{formErrors["phone_number"]}</span>

                    <label>Código Postal:</label>
                    <input type="text" name="postal_code" value={profile.user.postal_code} onChange={handleChange} />
                    <span className="error-message">{formErrors["postal_code"]}</span>

                    <label>Biografía:</label>
                    <textarea
                        name="bio"
                        value={profile.bio ? profile.bio : ""}
                        onChange={handleChange}
                        rows={4}
                    />
                    <span className="error-message">{formErrors["bio"]}</span>

                    <button type="submit">Actualizar Perfil</button>
                </form>

                <div className="services-section">
                    <h2>Servicios</h2>
                    <hr />
                    <button onClick={() => setShowServiceModal(!showServiceModal)}>+ Añadir servicio</button>
                    {services.map((service, index) => (
                        <div key={index} className="service-item">
                            <h3>{service.titulo}</h3>
                            <p>{service.descripcion}</p>
                            <p>Precio: {service.precio}</p>
                            <p>Frecuencia: {service.frecuencia}</p>
                            <p>Duración: {service.duracion}</p>
                        </div>
                    ))}
                </div>

                {/* Modal para añadir servicios */}
                {showServiceModal && (
                    <ServiceModal
                        onClose={() => setShowServiceModal(false)}
                        onSave={handleAddService}
                    />
                )}
            </div>
        </div>

    );
};

export default FisioProfile;