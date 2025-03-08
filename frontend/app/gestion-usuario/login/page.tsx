"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"; // Importar useRouter para redirigir

export default function LoginPaciente() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const router = useRouter(); // Instancia de useRouter para redirigir

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      axios.post("http://localhost:8000/api/app_user/login/", formData).then((response) => {
        if (response.status == 200){
          localStorage.setItem("token",response.data.access)
          setMessage("Inicio de sesión exitoso");
          console.log(response.data.access)
          setTimeout(() => {
            router.push("/gestion-paciente/perfil"); 
          }, 500); 
        } else {
          setMessage("Las credenciales no son válidas");
        }
      })
      .catch(error => {
        setMessage(error.response?.data?.error || "Las credenciales no son válidas");
        console.error("Error fetching data:", error);
    });
    } catch (error: any) {
      setMessage(error.response?.data?.error || "Las credenciales no son válidas");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f3f3f3]">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold mb-6 text-center text-[#253240]">Inicio de Sesión</h2>

        {/* Mostrar mensaje de error o éxito */}
        {message && (
          <p className={`text-center text-red-500 mb-4 ${message === "Inicio de sesión exitoso" ? "text-green-500" : ""}`}>
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            name="username"
            type="text"
            placeholder="Nombre de usuario"
            value={formData.username}
            onChange={handleChange}
            className="w-full p-3 border border-[#05668D] rounded-md focus:outline-none focus:ring-2 focus:ring-[#41b8d5] text-[#0A7487]"
            required
          />
          
          <input
            name="password"
            type="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border border-[#05668D] rounded-md focus:outline-none focus:ring-2 focus:ring-[#41b8d5] text-[#0A7487]"
            required
          />

          <button
            type="submit"
            className="w-full bg-[#05668D] text-white py-3 rounded-md hover:bg-[#41b8d5] transition"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
}
