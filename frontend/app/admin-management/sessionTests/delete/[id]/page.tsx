'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { get_id_from_url } from "@/app/admin-management/util";
import { getApiBaseUrl } from "@/utils/api";

interface sessionTestInterface {
  id: string;
  session: string;
  question: string;
  test_type: string;
  scale_labels: string;
}

export default function EliminarCitas() {
  const id = get_id_from_url()

  const [sessionTest, setSessionTest] = useState<sessionTestInterface | null>(null);

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
    axios.get(`${getApiBaseUrl()}/api/treatment/admin/sessionTest/list/`+id+'/', {
      headers : {
        "Authorization": "Bearer "+token
      }
    }
    ).then(response => {
        setSessionTest(response.data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

  function deleteSessionTest() {
    axios.delete(`${getApiBaseUrl()}/api/appointment/admin/delete/`+id+'/', {
      headers : {
        "Authorization": "Bearer "+token
      }
    }
    ).then(() => {
        location.href="/admin-management/sessionTests/"
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }

  return (
    <>
      <div className="admin-header">
        <a href="/admin-management/sessionTests/"><button className="btn-admin">Volver</button></a>
        <h1>Eliminar prueba de sesión</h1>
      </div>
      <div className="terminos-container">
        {sessionTest && <>
          <p style={{fontSize:"1.5rem"}}>¿Quieres borrar la prueba de sesión {sessionTest.id}?</p>
          <div>
            <button className="btn-admin-red" onClick={deleteSessionTest}>Sí</button>
            <button className="btn-admin-green" onClick={() => location.href="/admin-management/sessionTests/"}>No</button>
          </div>
          </>
        }
        {!sessionTest && <h1>Prueba de sesión no encontrada</h1>
        }    
      </div>

    </>
  );
}
