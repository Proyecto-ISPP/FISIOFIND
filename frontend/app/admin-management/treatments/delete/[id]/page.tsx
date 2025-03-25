'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { get_id_from_url } from "@/app/admin-management/util";
import { getApiBaseUrl } from "@/utils/api";

interface treatmentInterface {
  id: string;
  physiotherapist: string;
  patient: string;
  start_time: string;
  end_time: string;
  homework: string;
  is_active: string;
  created_at: string;
  updated_at: string;
}

export default function EliminarCitas() {
  const id = get_id_from_url()

  const [treatment, setTreatment] = useState<treatmentInterface | null>(null);

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

  useEffect(() => {
    axios.get(`${getApiBaseUrl()}/api/tratment/admin/treatment/list/`+id+'/', {
      headers : {
        "Authorization": "Bearer "+token
      }
    }
    ).then(response => {
        setTreatment(response.data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

  function deleteTratamiento() {
    axios.delete(`${getApiBaseUrl()}/api/treatment/admin/treatment/delete/`+id+'/', {
      headers : {
        "Authorization": "Bearer "+token
      }
    }
    ).then(() => {
        location.href="/admin-management/treatment/"
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }

  return (
    <>
      <div className="admin-header">
        <a href="/admin-management/appointments/"><button className="btn-admin">Volver</button></a>
        <h1>Eliminar tratamiento</h1>
      </div>
      <div className="terminos-container">
        {treatment && <>
          <p style={{fontSize:"1.5rem"}}>¿Quieres borrar el tratamiento {treatment.id}?</p>
          <div>
            <button className="btn-admin-red" onClick={deleteTratamiento}>Sí</button>
            <button className="btn-admin-green" onClick={() => location.href="/admin-management/treatments/"}>No</button>
          </div>
          </>
        }
        {!treatment && <h1>Tratamiento no encontrada</h1>
        }    
      </div>

    </>
  );
}
