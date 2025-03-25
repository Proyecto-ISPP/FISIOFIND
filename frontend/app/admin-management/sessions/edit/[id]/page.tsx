'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import {get_id_from_url } from "@/app/admin-management/util";
import { getApiBaseUrl } from "@/utils/api";

interface sessionInterface {
  id: string;
  name: string;
  treatment: string;
  day_of_week: string;
}

const days_of_the_week = {
  "Monday": "Lunes",
  "Tuesday": "Martes",
  "Wednesday": "Miércoles",
  "Thursday": "Jueves",
  "Friday": "Viernes",
  "Saturday": "Sábado",
  "Sunday": "Domingo",
}

export default function EditSession() {

  const id = get_id_from_url()

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

  const [session, setSession] = useState<[sessionInterface] | null>(null);

  const [name, setName] = useState("");
  const [treatment, setTreatment] = useState("");
  const [diaDeLaSemana, setDiaDeLaSemana] = useState("Monday");
  

  useEffect(() => {
    axios.get(`${getApiBaseUrl()}/api/appointment/admin/list/`+id+'/',{
      headers : {
        "Authorization": "Bearer "+token
      }
    }
    ).then(response => {
        setSession(response.data);
        console.log(response.data)

        setName(response.data.name)
        setDiaDeLaSemana(response.data.day_of_the_week)
        setTreatment(response.data.treatment)
      }, {
        headers : {
          "Authorization": "Bearer "+token
        }
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

  function handleSubmit(event) {
    event.preventDefault();

    axios.put(`${getApiBaseUrl()}/api/treatments/admin/session/edit/`+id+'/',{
      treatment,
      name,
      days_of_the_week: diaDeLaSemana
    },{
      headers : {
        "Authorization": "Bearer "+token
      }
    }
  ).then(() => {
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
        <a href="/admin-management/appointments/"><button className="btn-admin">Volver</button></a>
        <h1>Editar sesión</h1>
      </div>
      <div className="terminos-container">
        {cita && <>
          <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="nombre">Nombre: </label>
            <input value={name} required type="text" id="nombre"  onChange={nombr => setName(nombr.target.value)} />
          </div>

          <div>
            <label htmlFor="trat">ID del tratamiento: </label>
            <input value={treatment} required type="text" id="trat"  onChange={tra => setTreatment(tra.target.value)} />
          </div>

          <div>
            <label htmlFor="dia-semana">Día de la semana: </label>
            <select value={diaDeLaSemana} name="dia-semana" id="dia-semana" onChange={dia => setDiaDeLaSemana(dia)} >
              <option value="Monday">Lunes</option>
              <option value="Tuesday">Martes</option>
              <option value="Wednesday">Miércoles</option>
              <option value="Thursday">Jueves</option>
              <option value="Friday">Viernes</option>
              <option value="Saturday">Sábado</option>
              <option value="Sunday">Domingo</option>
            </select>
          </div>

            {errorMessage && <p className="text-red-500">*{errorMessage}</p>}
            <input type="submit" value="Submit" className="btn-admin" />
          </form>
          </>
        }
        {!session && <h1>Sesión no encontrada</h1>
        }   
      </div>
    </>
  );
}
