'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { getApiBaseUrl } from "@/utils/api";

export default function editSession() {
  const [name, setName] = useState("");
  const [treatment, setTreatment] = useState("");
  const [diaDeLaSemana, setDiaDeLaSemana] = useState("");
  
  const [errorMessage, setErrorMessage] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
      if (token) {
        axios
          .get(`${getApiBaseUrl()}/api/app_user/check-role/`, {
            headers: {
              Authorization: "Bearer " + token,
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
  }, [isClient, token]);

  function handleSubmit(event) {
    event.preventDefault();

    axios.post(`${getApiBaseUrl()}/api/treatment/admin/session/create`,{
      name,
      treatment,
      day_of_the_week: diaDeLaSemana
    }, {
      headers : {
        "Authorization": "Bearer "+token
      }
    }).then( () => {
        location.href="/admin-management/sessions/"
      })
      .catch(error => {
        if (error.response && error.response.data.non_field_errors) {
          setErrorMessage(error.response.data.non_field_errors[0])
        } else if (error.response && error.response.status == 400) {
          let container = ''
          for (const [_, error_msg] of Object.entries(error.response.data)) {
            container += error_msg 
          }
          setErrorMessage(container)
        }else {
          console.error("Error fetching data:", error);
        }
    });
  }

  return (
    <>
      <div className="admin-header">
        <h1>Crear cita</h1>
      </div>
      <div className="terminos-container">
        <form onSubmit={handleSubmit}>

          <div>
            <label htmlFor="nombre">Nombre: </label>
            <input required type="text" id="nombre"  onChange={nombr => setName(nombr.target.value)} />
          </div>

          <div>
            <label htmlFor="trat">ID del tratamiento: </label>
            <input required type="text" id="trat"  onChange={tra => setTreatment(tra.target.value)} />
          </div>

          <div>
            <label htmlFor="dia-semana">Día de la semana: </label>
            <select name="dia-semana" id="dia-semana" onChange={dia => setDiaDeLaSemana(dia)} >
              <option value="Monday">Lunes</option>
              <option value="Tuesday">Martes</option>
              <option value="Wednesday">Miércoles</option>
              <option value="Thursday">Jueves</option>
              <option value="Friday">Viernes</option>
              <option value="Saturday">Sábado</option>
              <option value="Sunday">Domingo</option>
            </select>
          </div>

          {errorMessage && <p className="text-red-500 text-wrap">*{errorMessage}</p>}
          <input type="submit" value="Submit" className="btn-admin" />
        </form>
      </div>

    </>
  );
}
