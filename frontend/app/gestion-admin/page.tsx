'use client';

import axios from "axios";

export default function GestionAdmin() {

  const token = localStorage.getItem("token")
  if (token) {
    console.log(token)
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

  return (
    <>
      <div className="admin-header">
        <h1>Panel de administración</h1>
      </div>
      <div className="container">
        <div>
            <p>Panel de gestión de términos y condiciones
              <a href="/gestion-admin/terminos"><button className="btn-admin-green">Acceder</button></a>
            </p>
        </div>
      </div>
    </>
  );
}
