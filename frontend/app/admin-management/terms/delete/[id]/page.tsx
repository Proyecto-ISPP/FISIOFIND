"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { get_id_from_url } from "@/app/admin-management/util";
import { getApiBaseUrl } from "@/utils/api";

interface terminoInterface {
  id: string;
  content: string;
  version: string;
  updated_at: string;
  created_at: string;
}

export default function EliminarTermino() {
  const id = get_id_from_url();

  const [termino, setTermino] = useState<terminoInterface | null>(null);
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
    axios
      .get(`${getApiBaseUrl()}/api/terms/list/` + id + "/", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        setTermino(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [id, token]);

  function deleteTermino() {
    axios
      .delete(`${getApiBaseUrl()}/api/terms/delete/` + id + "/", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then(() => {
        location.href = "/admin-management/terms/";
      })
      .catch(error => {
        console.log("Error fetching data:", error);
      });
  }

  return (
    <>
      <div className="admin-header">
        <a href="/admin-management/terms/">
          <button className="btn-admin">Volver</button>
        </a>
        <h1>Eliminar término</h1>
      </div>
      <div className="terminos-container">
        {termino && (
          <>
            <p style={{ fontSize: "1.5rem" }}>
              ¿Quieres borrar el término {termino.id}?
            </p>
            <div>
              <button className="btn-admin-red" onClick={deleteTermino}>
                Sí
              </button>
              <button
                className="btn-admin-green"
                onClick={() => (location.href = "/admin-management/terms/")}
              >
                No
              </button>
            </div>
          </>
        )}
        {!termino && <h1>Término no encontrado</h1>}
      </div>
    </>
  );
}
