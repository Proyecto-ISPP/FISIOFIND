"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { getApiBaseUrl } from "@/utils/api";

const BASE_URL = `${getApiBaseUrl()}`;

const getAuthToken = () => localStorage.getItem("token");

const PatientProfile = () => {
  const [profile, setProfile] = useState({
    user: {
      username: "",
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

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const token = getAuthToken(); // Obtiene el token de autenticación
      setToken(token);
      if (token) {
        axios.get(`${getApiBaseUrl()}/api/app_user/check-role/`, {
          headers: {
            "Authorization": "Bearer " + token
          }
        })
          .then(response => {
            const role = response.data.user_role;
            if (role !== "patient") {
              location.href = "/error-permisos";
            } else {
              fetchPatientProfile();
            }
          })
          .catch(error => {
            console.error("Error al obtener el rol del usuario:", error);
            location.href = "/error-permisos";
          });
      } else {
        location.href = "/error-permisos";
      }
    }
  }, [token, isClient]);


  const fetchPatientProfile = async () => {
    setLoading(true);
    setErrors({});
    setSuccess("");
    try {
      if (!token) {
        setErrors({ general: "No hay token disponible." });
        setLoading(false);
        return;
      }

      const response = await axios.get(`${getApiBaseUrl}/api/app_user/current-user/`, {
        headers: { Authorization: "Bearer " + token },
      });
      console.log(response.data);

      setProfile({
        user: {
          dni: response.data.patient.user_data.dni,
          email: response.data.patient.user_data.email,
          phone_number: response.data.patient.user_data.phone_number,
          photo: response.data.patient.user_data.photo, // Si la foto está disponible en la respuesta
          postal_code: response.data.patient.user_data.postal_code,
          username: response.data.patient.user_data.username,
          account_status: response.data.patient.user_data.account_status,
        },
        birth_date: response.data.patient.birth_date,
        gender: response.data.patient.gender
      });
    } catch (error) {
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

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleImageClick = () => {
    document.getElementById('file-input').click();  // Abrir el input oculto para cargar una nueva foto
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

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      if (token) {
        setErrors({ general: "No hay token disponible." });
        return;
      }

      const formData = new FormData();

      // Agregar los campos del usuario
      Object.entries(profile.user).forEach(([key, value]) => {
        if (value && key !== "photo") formData.append(`user.${key}`, value);
      });

      // Agregar los campos del paciente
      formData.append("gender", profile.gender);
      formData.append("birth_date", profile.birth_date);

      // Solo agregar la foto si se ha seleccionado un archivo
      if (profile.user.photoFile) {
        formData.append("user.photo", profile.user.photoFile);
      }

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
        }

        setErrors(errorMessages);
      } else {
        setErrors({ general: "Error al actualizar el perfil." });
      }
    }
  };

  // const handleFileChange = (e) => {
  //       const file = e.target.files[0];
  //       if (file) {
  //           // Crear URL para vista previa
  //           const previewUrl = URL.createObjectURL(file);
  //           console.log(previewUrl);
  //           console.log(file);

  //           // Actualizar el estado con el archivo y la URL de vista previa
  //           setProfile((prevProfile) => ({
  //               ...prevProfile,
  //               user: {
  //                   ...prevProfile.user,
  //                   photo: previewUrl, // Para mostrar en la interfaz
  //                   photoFile: file,    // Para enviar al backend
  //                   preview: previewUrl
  //               },
  //           }));
  //       }
  //   };

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


  if (loading) return <p>Cargando perfil...</p>;

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

        </div>
      </div>

      {/* Sección derecha con el formulario */}
      <div className="user-profile-right">
        <form onSubmit={handleSubmit}>
          {errors.general && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md text-center mb-4">
              {errors.general}
            </div>
          )}

          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={profile?.user?.email || ""}
              onChange={handleChange}
              className="w-full p-3 border border-[#05668D] rounded-md focus:outline-none focus:ring-2 focus:ring-[#41b8d5] text-gray-700"
            />
            {errors.email && <p className="text-red-500">{errors.email}</p>}
          </div>

          <div>
            <label>Teléfono:</label>
            <input
              type="text"
              name="phone_number"
              value={profile?.user?.phone_number || ""}
              onChange={handleChange}
              className="w-full p-3 border border-[#05668D] rounded-md focus:outline-none focus:ring-2 focus:ring-[#41b8d5] text-gray-700"
            />
            {errors.phone_number && <p className="text-red-500">{errors.phone_number}</p>}
          </div>

          <div>
            <label>Código Postal:</label>
            <input
              type="text"
              name="postal_code"
              value={profile?.user?.postal_code || ""}
              onChange={handleChange}
              className="w-full p-3 border border-[#05668D] rounded-md focus:outline-none focus:ring-2 focus:ring-[#41b8d5] text-gray-700"
            />
            {errors.postal_code && <p className="text-red-500">{errors.postal_code}</p>}
          </div>

          <div>
            <label>Fecha de Nacimiento:</label>
            <input
              type="date"
              name="birth_date"
              value={profile?.birth_date || ""}
              disabled={true}
              className="w-full p-3 border border-[#05668D] rounded-md focus:outline-none focus:ring-2 focus:ring-[#41b8d5] text-gray-700"
            />
            {errors.birth_date && <p className="text-red-500">{errors.birth_date}</p>}
          </div>

          <div>
            <label>DNI:</label>
            <input
              type="text"
              name="dni"
              value={profile?.user?.dni || ""}
              disabled={true}
              className="w-full p-3 border border-[#05668D] rounded-md focus:outline-none focus:ring-2 focus:ring-[#41b8d5] text-gray-700"
            />
            {errors.dni && <p className="text-red-500">{errors.dni}</p>}
          </div>

          <div>
            <label>Género:</label>
            <select
              name="gender"
              value={profile?.gender || ""}
              onChange={handleChange}
              className="w-full p-3 border border-[#05668D] rounded-md focus:outline-none focus:ring-2 focus:ring-[#41b8d5] text-gray-700"
            >
              <option value="">Selecciona una opción</option>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
              <option value="O">Otro</option>
            </select>
            {errors.gender && <p className="text-red-500">{errors.gender}</p>}
          </div>

          <button
            type="submit"
            className="w-full mt-8 bg-[#05668D] text-white py-3 rounded-md hover:bg-[#41b8d5] transition"
          >
            Actualizar Perfil
          </button>
        </form>
      </div>
    </div>


  );
};

export default PatientProfile;
