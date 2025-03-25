'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { get_id_from_url } from "@/app/admin-management/util";
import { getApiBaseUrl } from "@/utils/api";

interface sessionInterface {
  id: string;
  name: string;
  treatment: string;
  day_of_week: string;
}

export default function DeleteSession() {
  const id = get_id_from_url()

  const [session, setSession] = useState<sessionInterface | null>(null);

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
    axios.get(`${getApiBaseUrl()}/api/treatment/admin/session/list/`+id+'/', {
      headers : {
        "Authorization": "Bearer "+token
      }
    }
    ).then(response => {
        setSession(response.data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

  function deleteSession() {
    axios.delete(`${getApiBaseUrl()}/api/treatment/admin/session/delete/`+id+'/', {
      headers : {
        "Authorization": "Bearer "+token
      }
    }
    ).then(() => {
        location.href="/admin-management/sessions/"
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }

  return (
    <>
      <div className="admin-header">
        <a href="/admin-management/sessions/"><button className="btn-admin">Volver</button></a>
        <h1>Eliminar sesión</h1>
      </div>
      <div className="terminos-container">
        {session && <>
          <p style={{fontSize:"1.5rem"}}>¿Quieres borrar la sesión {session.id}?</p>
          <div>
            <button className="btn-admin-red" onClick={deleteSession}>Sí</button>
            <button className="btn-admin-green" onClick={() => location.href="/admin-management/appointments/"}>No</button>
          </div>
          </>
        }
        {!session && <h1>Sesión no encontrada</h1>
        }    
      </div>

    </>
  );
}
