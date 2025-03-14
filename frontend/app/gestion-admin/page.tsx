"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { getApiBaseUrl } from "@/utils/api";

const GestionAdmin = () => {
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true once the component is mounted
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Only run this effect on the client side
    if (isClient) {
      const storedToken = localStorage.getItem("token");

      if (storedToken) {
        axios
          .get(`${getApiBaseUrl()}/api/app_user/check-role/`, {
            headers: {
              Authorization: "Bearer " + storedToken,
            },
          })
          .then((response) => {
            const role = response.data.user_role;
            if (role != "admin") {
              location.href = "..";
            }
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            location.href = "..";
          });
      } else {
        location.href = "..";
      }
    }
  }, [isClient]);

  return (
    <>
      <div className="admin-header">
        <h1 className="text-3xl font-bold text-center">
          Panel de administración
        </h1>
      </div>
      <div className="terminos-container flex flex-col items-center justify-center text-center">
        <div className="flex flex-wrap items-center justify-center mb-8">
          <p className="text-xl max-w-2xl">
            Panel de gestión de términos y condiciones
          </p>
          <a href="/gestion-admin/terminos">
            <button className="btn-admin-green ml-4">Acceder</button>
          </a>
        </div>
        <div className="terminos-container flex flex-col items-center justify-center text-center">
          <div className="flex flex-wrap items-center justify-center mb-8">
              <p className="text-xl max-w-2xl">Panel de gestión de términos y condiciones</p>
              <a href="/gestion-admin/terminos"><button className="btn-admin-green ml-4">Acceder</button></a>
          </div>
          <div className="flex flex-wrap items-center justify-center mb-8">
              <p className="text-xl max-w-2xl">Panel de gestión de usuarios</p>
              <a href="#"><button className="btn-admin-green ml-4">Proximamente</button></a>
          </div>
          <div className="flex flex-wrap items-center justify-center mb-8">
              <p className="text-xl max-w-2xl">Panel de gestión de citas</p>
              <a href="#"><button className="btn-admin-green ml-4">Proximamente</button></a>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center mb-8">
          <p className="text-xl max-w-2xl">Panel de gestión de citas</p>
          <a href="/gestion-admin/citas">
            <button className="btn-admin-green ml-4">Acceder</button>
          </a>
        </div>
      </div>
    </>
  );
};

export default function Main() {
  return <GestionAdmin />;
}
