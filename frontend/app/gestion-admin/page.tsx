'use client';

import { useEffect } from "react";
import axios from "axios";
const GestionAdmin = () => {

  const token = localStorage.getItem("token")
  useEffect(() => {    
    if (token) {
      axios.get("http://127.0.0.1:8000/api/app_user/check-role/", {
        headers : {
          "Authorization": "Bearer "+token
        }
      }
      ).then(response => {
          const role = response.data.user_role;
          if (role != "admin") {
            location.href = ".."
          }
        })
        .catch(error => {
          console.error("Error fetching data:", error);
          location.href = ".."
        });
    } else {
      location.href = ".."
    }
  },[])

  return (
    <>
        <div className="admin-header">
          <h1 className="text-3xl font-bold text-center">Panel de administración</h1>
        </div>
        <div className="terminos-container flex flex-col items-center justify-center text-center">
          <div className="flex flex-wrap items-center justify-center mb-8">
              <p className="text-xl max-w-2xl">Panel de gestión de términos y condiciones</p>
              <a href="/gestion-admin/terminos"><button className="btn-admin-green ml-4">Acceder</button></a>
          </div>
          <div className="flex flex-wrap items-center justify-center mb-8">
              <p className="text-xl max-w-2xl">Panel de gestión de usuarios</p>
              <a href="/gestion-admin/usuarios"><button className="btn-admin-green ml-4">Acceder</button></a>
          </div>
          <div className="flex flex-wrap items-center justify-center mb-8">
              <p className="text-xl max-w-2xl">Panel de gestión de citas</p>
              <a href="/gestion-admin/citas"><button className="btn-admin-green ml-4">Acceder</button></a>
          </div>
        </div>
    </>
  );
}

export default function Main() {
  return <GestionAdmin />;
}