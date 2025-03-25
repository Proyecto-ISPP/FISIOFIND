"use client";

import { useEffect } from "react";

const ErrorPermissions = () => {
  useEffect(() => {
    setTimeout(() => {
      window.location.href = "/";
    }, 3000);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white text-center">
      <div className="p-8 border border-[#41b8d5] rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-[#05668D] mb-4">No tienes permisos</h1>
        <p className="text-lg text-gray-700 mb-4">Te estamos redirigiendo a la página principal...</p>
        <img 
          src="https://media.giphy.com/media/jWexOOlYe241y/giphy.gif" 
          alt="Acceso denegado"
          className="mx-auto w-40 h-40"
        />
      </div>
    </div>
  );
};

export default ErrorPermissions;