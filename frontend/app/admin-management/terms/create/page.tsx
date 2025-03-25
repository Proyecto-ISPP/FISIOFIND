"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { getApiBaseUrl } from "@/utils/api";

export default function CrearTerminos() {
  const [content, setContent] = useState("");
  const [version, setVersion] = useState("");
  const [tag, setTag] = useState("");
  const [adminUsername, setAdminUsername] = useState("");

  const [isClient, setIsClient] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Check if this code is running on the client (so we can safely use localStorage)
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Modify the admin role check useEffect
  useEffect(() => {
    if (isClient) {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);

      if (storedToken) {
        axios
          .get(`${getApiBaseUrl()}/api/app_user/check-role/`, {
            headers: { Authorization: "Bearer " + storedToken },
          })
          .then((response) => {
            const role = response.data.user_role;
            if (role !== "admin") {
              location.href = "..";
            } else {
              setAdminUsername(response.data.username); // Store the username
            }
          })
          .catch((error) => {
            console.error("Error fetching role data:", error);
            location.href = "..";
          });
      } else {
        location.href = "..";
      }
    }
  }, [isClient]);

  // Modify handleSubmit to include modifier
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!token) {
      return;
    }

    // Remove the modifier from the request payload
    axios
      .post(
        `${getApiBaseUrl()}/api/terms/create/`,
        {
          content,
          version,
          tag
        },
        {
          headers: { Authorization: "Bearer " + token },
        }
      )
      .then(() => {
        location.href = "/admin-management/terms/";
      })
      .catch((error) => {
        console.error("Error creating term:", error.response?.data || error);
        if (error.response?.data?.required) {
          setErrorMessage(error.response.data.required);
        } else {
          setErrorMessage("Error al crear el término. Por favor, revise los campos e inténtelo de nuevo.");
        }
      });
  };

  return (
    <>
      <div className="admin-header">
        <a href="/admin-management/terms/">
          <button className="btn-admin">Volver</button>
        </a>
        <h1>Crear término</h1>
      </div>

      <div className="terminos-container">
        <form onSubmit={handleSubmit}>
          {/* Version Field */}
          <div>
            <label htmlFor="version">Versión: </label>
            <input
              maxLength={100}
              required
              type="text"
              id="version"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
            />
          </div>

          {/* Content Field */}
          <div className="terminos-container">
            <label htmlFor="content">Contenido</label>
            <textarea
              required
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          {/* Tag Field (Dropdown) */}
          <div className="terminos-container">
            <label htmlFor="tag">Tipo de Término (tag)</label>
            <select
              id="tag"
              required
              value={tag}
              onChange={(e) => setTag(e.target.value)}
            >
              <option value="">-- Seleccione --</option>
              <option value="terms">Términos de Uso</option>
              <option value="cookies">Política de Cookies</option>
              <option value="privacy">Política de Privacidad</option>
              <option value="license">Licencias</option>
            </select>
          </div>

          {/* Error Message */}
          {errorMessage && <p className="text-red-500">*{errorMessage}</p>}

          <input type="submit" value="Guardar" className="btn-admin" />
        </form>
      </div>
    </>
  );
}
