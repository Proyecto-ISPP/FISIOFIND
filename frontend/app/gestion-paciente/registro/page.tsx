"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"; // Importar useRouter para redirigir

export default function RegisterPaciente() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    dni: "",
    phone_number: "",
    postal_code: "",
    gender: "",
    birth_date: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // Estado para mostrar el pop-up
  const router = useRouter(); // Instancia de useRouter para redirigir
  const [submitted, setSubmitted] = useState(false); // Estado para controlar si el formulario fue enviado

  // Limpiar el formulario al cargar la página
  useEffect(() => {
    setFormData({
      username: "",
      email: "",
      password: "",
      dni: "",
      phone_number: "",
      postal_code: "",
      gender: "",
      birth_date: "",
    });
    setErrors({}); // Limpiar errores
    setSubmitted(false); // Resetear el estado de envío
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true); // Marcar como enviado

    setErrors({}); // Resetear errores antes de validar

    // Validar que se hayan llenado los campos obligatorios
    const newErrors: { [key: string]: string } = {};

    if (formData.username === "") {
      newErrors.username = "El nombre de usuario es obligatorio.";
    }

    if (formData.email === "") {
      newErrors.email = "El correo electrónico es obligatorio.";
    }

    if (formData.password === "") {
      newErrors.password = "La contraseña es obligatoria.";
    }

    if (formData.dni === "") {
      newErrors.dni = "El DNI es obligatorio.";
    }

    if (formData.phone_number === "") {
      newErrors.phone_number = "El número de teléfono es obligatorio.";
    }

    if (formData.postal_code === "") {
      newErrors.postal_code = "El código postal es obligatorio.";
    }

    if (formData.gender === "") {
      newErrors.gender = "El campo género es obligatorio.";
    }

    if (formData.birth_date === "") {
      newErrors.birth_date = "La fecha de nacimiento es obligatoria.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await axios.post("http://localhost:8000/api/app_user/patient/register/", formData, {
        headers: { "Content-Type": "application/json" },
      });

      setShowSuccessPopup(true); // Mostrar pop-up de éxito

      setTimeout(() => {
        router.push("/gestion-usuario/login"); // Redirigir a la página de perfil
      }, 1500); 

    } catch (error: any) {
      if (error.response?.data) {
        const backendErrors = error.response.data;
        const translatedErrors: { [key: string]: string } = {};

        // Recorrer los errores y traducirlos
        Object.keys(backendErrors).forEach((key) => {
          if (backendErrors[key] === "This field may not be blank.") {
            translatedErrors[key] = "Este campo es obligatorio.";
          } else {
            translatedErrors[key] = backendErrors[key];
          }
        });

        setErrors(translatedErrors); // Capturar errores traducidos
      } else {
        setErrors({ general: "Error desconocido" });
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f3f3f3]">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold mb-6 text-center text-[#253240]">Registro de Paciente</h2>

        {/* Mostrar errores generales */}
        {errors.general && <p className="text-center text-red-500 mb-4">{errors.general}</p>}

        {/* Pop-up de éxito */}
        {showSuccessPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-2xl text-center max-w-xs">
              <p className="text-[#253240] font-semibold text-lg">Paciente registrado correctamente</p>
              <p className="mt-2 text-[#41b8d5]">Serás redirigido a la pantalla de inicio de sesión.</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            name="username"
            type="text"
            placeholder="Usuario"
            value={formData.username}
            onChange={handleChange}
            className="w-full p-3 border border-[#05668D] rounded-md focus:outline-none focus:ring-2 focus:ring-[#41b8d5] text-[#0A7487]"
          />
          {submitted && errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border border-[#05668D] rounded-md focus:outline-none focus:ring-2 focus:ring-[#41b8d5] text-[#0A7487]"
          />
          {submitted && errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

          <input
            name="dni"
            type="text"
            placeholder="DNI"
            value={formData.dni}
            onChange={handleChange}
            className="w-full p-3 border border-[#05668D] rounded-md focus:outline-none focus:ring-2 focus:ring-[#41b8d5] text-[#0A7487]"
          />
          {submitted && errors.dni && <p className="text-red-500 text-sm">{errors.dni}</p>}

          <input
            name="phone_number"
            type="text"
            placeholder="Teléfono"
            value={formData.phone_number}
            onChange={handleChange}
            className="w-full p-3 border border-[#05668D] rounded-md focus:outline-none focus:ring-2 focus:ring-[#41b8d5] text-[#0A7487]"
          />
          {submitted && errors.phone_number && <p className="text-red-500 text-sm">{errors.phone_number}</p>}

          <input
            name="postal_code"
            type="text"
            placeholder="Código Postal"
            value={formData.postal_code}
            onChange={handleChange}
            className="w-full p-3 border border-[#05668D] rounded-md focus:outline-none focus:ring-2 focus:ring-[#41b8d5] text-[#0A7487]"
          />
          {submitted && errors.postal_code && <p className="text-red-500 text-sm">{errors.postal_code}</p>}

          <input
            name="password"
            type="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border border-[#05668D] rounded-md focus:outline-none focus:ring-2 focus:ring-[#41b8d5] text-[#0A7487]"
          />
          {submitted && errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

          <input
            name="first_name"
            type="first_name"
            placeholder="Nombre"
            value={formData.first_name}
            onChange={handleChange}
            className="w-full p-3 border border-[#05668D] rounded-md focus:outline-none focus:ring-2 focus:ring-[#41b8d5] text-[#0A7487]"
          />
          {submitted && errors.first_name && <p className="text-red-500 text-sm">{errors.first_name}</p>}

          <input
            name="last_name"
            type="last_name"
            placeholder="Apellidos"
            value={formData.last_name}
            onChange={handleChange}
            className="w-full p-3 border border-[#05668D] rounded-md focus:outline-none focus:ring-2 focus:ring-[#41b8d5] text-[#0A7487]"
          />
          {submitted && errors.last_name && <p className="text-red-500 text-sm">{errors.last_name}</p>}

          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full p-3 border border-[#05668D] rounded-md focus:outline-none focus:ring-2 focus:ring-[#41b8d5] text-[#0A7487]"
          >
            <option value="">----------------------</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
            <option value="O">Otro</option>
          </select>
          {submitted && errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}

          <input
            name="birth_date"
            type="date"
            value={formData.birth_date}
            onChange={handleChange}
            className="w-full p-3 border border-[#05668D] rounded-md focus:outline-none focus:ring-2 focus:ring-[#41b8d5] text-[#0A7487]"
          />
          {submitted && errors.birth_date && <p className="text-red-500 text-sm">{errors.birth_date}</p>}

          <button
            type="submit"
            className="w-full bg-[#05668D] text-white py-3 rounded-md hover:bg-[#41b8d5] transition"
          >
            Registrar
          </button>
        </form>
      </div>
    </div>
  );
}
