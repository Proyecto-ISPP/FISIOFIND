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

const test_types = {
  "text": "Text",
  "scale": "Scale"
}

export default function ViewSessionTest() {
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


  return (
    <>
      <div className="admin-header">
        <a href="/admin-management/sessionTests/"><button className="btn-admin">Volver</button></a>
        <h1>Vista de prueba de sesión</h1>
      </div>
      <div className="terminos-container text-left">
        {sessionTest && <>
          <p>Sesión: {sessionTest.session}</p>
          <p>Pregunta: {sessionTest.session}</p>
          <p>Tipo test: {test_types[sessionTest.test_type]}</p>
          <p>Escala: {sessionTest.scale_labels}</p>      
          </>
        }
        {!sessionTest && <h1>Prueba de sesión no encontrada</h1>
        }    
      </div>

    </>
  );
}
