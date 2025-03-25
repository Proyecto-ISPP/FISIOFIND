"use client";

import React, { useEffect, useState } from "react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import {
  IconFileText,
  IconCookie,
  IconLock,
  IconRefresh,
  IconAlertCircle,
  IconEdit,
  IconTrash,
  IconPlus,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import axios from "axios";
import { getApiBaseUrl } from "@/utils/api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

interface TermItem {
  id: number;
  title: string;
  content: string;
  version: string;
  icon: React.ReactNode;
  tag?: string; // optional
}

interface ApiTermItem {
  id: number;
  content: string;
  version: string;
  tag: string;
  tag_display: string;
  created_at: string;
  updated_at: string;
  modifier: number;
}

const POLICY_ORDER = {
  cookies: 1,
  terms: 2,
  license: 3,
  privacy: 4,
} as const;


export default function TermsPage(): React.ReactElement {
  const [terms, setTerms] = useState<TermItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // ----------- 1) Error global + fade (para editar, borrar, fetch, etc.) -----------
  const [error, setError] = useState<string | null>(null);
  const [fadeOut, setFadeOut] = useState<boolean>(false);

  // ----------- 2) Error local del modal + fade (para errores al crear un término) -----------
  const [modalError, setModalError] = useState<string | null>(null);
  const [modalFadeOut, setModalFadeOut] = useState<boolean>(false);

  // Bandera de "no hay términos"
  const [noTermsFound, setNoTermsFound] = useState<boolean>(false);

  // Para ver si es admin, y recoger su username si hace falta
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [adminUsername, setAdminUsername] = useState<string>("");

  // Para editar (esto no usa modal, sino inline)
  const [editMode, setEditMode] = useState<number | null>(null);
  const [editContent, setEditContent] = useState<string>("");
  const [editVersion, setEditVersion] = useState<string>("");

  // Para añadir un nuevo término (esto sí usa modal)
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newTermType, setNewTermType] = useState<string>("");
  const [newTermContent, setNewTermContent] = useState<string>("");
  const [newTermVersion, setNewTermVersion] = useState<string>("");

  // Modal para ver contenido completo
  const [activeTermId, setActiveTermId] = useState<number | null>(null);

  // -------------------- useEffect: Fade out del error global --------------------
  useEffect(() => {
    if (error) {
      setFadeOut(false); // Reset fade
      const timerFade = setTimeout(() => setFadeOut(true), 3000);
      const timerClear = setTimeout(() => setError(null), 4000);
      return () => {
        clearTimeout(timerFade);
        clearTimeout(timerClear);
      };
    }
  }, [error]);

  // -------------------- useEffect: Fade out del error específico del modal --------------------
  useEffect(() => {
    if (modalError) {
      setModalFadeOut(false); // Reset fade
      const timerFade = setTimeout(() => setModalFadeOut(true), 3000);
      const timerClear = setTimeout(() => setModalError(null), 4000);
      return () => {
        clearTimeout(timerFade);
        clearTimeout(timerClear);
      };
    }
  }, [modalError]);

  // -------------------- Comprobar si es Admin --------------------
  // First useEffect for admin role check
  useEffect(() => {
    const checkUserRole = async (): Promise<void> => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("No token found, user not authenticated");
          return;
        }

        console.log("Token found:", token.substring(0, 10) + "...");
        
        const response = await axios.get(
          `${getApiBaseUrl()}/api/app_user/check-role/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data && response.data.user_role === "admin") {
          setIsAdmin(true);
          setAdminUsername(response.data.username);
        }
      } catch (err) {
        console.error("Error checking user role:", err);
      }
    };

    if (typeof window !== "undefined") {
      checkUserRole();
    }
  }, []);

  // Add this useEffect right after the admin role check useEffect
  useEffect(() => {
    const openCookiesPolicy = () => {
      const cookiesTerm = terms.find(term => term.tag === "cookies");
      if (cookiesTerm) {
        setActiveTermId(cookiesTerm.id);
      }
    };

    if (typeof window !== 'undefined') {
      const shouldOpenCookies = localStorage.getItem('open-cookies-policy');
      if (shouldOpenCookies && terms.length > 0) {
        openCookiesPolicy();
        localStorage.removeItem('open-cookies-policy');
      }
    }
  }, [terms]); // This will run whenever terms are loaded

  // -------------------- Cargar los términos --------------------
  useEffect(() => {
    const fetchTerms = async (): Promise<void> => {
      try {
        const token = localStorage.getItem("token");

        // 1) Intento con token
        if (token) {
          try {
            const response = await axios.get<ApiTermItem[]>(
              `${getApiBaseUrl()}/api/terms/list/`,
              {
                headers: { Authorization: `Bearer ${token}` },
                timeout: 5000,
              }
            );
            if (response.data && response.data.length > 0) {
              processTermsData(response.data);
              return;
            }
          } catch (authErr: any) {
            console.log("Authenticated request failed:", authErr.response?.status);
            if (authErr.response?.status === 401) {
              console.log("Authentication token may be expired");
            }
          }
        }

        // 2) Intento sin token (público)
        try {
          const publicResponse = await axios.get<ApiTermItem[]>(
            `${getApiBaseUrl()}/api/terms/list/`,
            { timeout: 5000 }
          );
          if (publicResponse.data && publicResponse.data.length > 0) {
            processTermsData(publicResponse.data);
            return;
          }
        } catch (publicErr) {
          console.log("Public request also failed");
          setNoTermsFound(true);
        }

        // Si llegamos aquí, no se pudo cargar nada:
        setNoTermsFound(true);
      } catch (err) {
        console.error("Error fetching terms:", err);
        setNoTermsFound(true);
      } finally {
        setLoading(false);
      }
    };

    const processTermsData = (data: ApiTermItem[]): void => {
      const existingTerms: TermItem[] = [];

      const termsMap = {
        terms: data.find((term) => term.tag === "terms"),
        cookies: data.find((term) => term.tag === "cookies"),
        privacy: data.find((term) => term.tag === "privacy"),
        license: data.find((term) => term.tag === "license"),
      };

      Object.entries(termsMap).forEach(([tag, term]) => {
        if (term) {
          let title = "";
          let icon = null;

          switch (tag) {
            case "cookies":
              title = "Política de Cookies";
              icon = <IconCookie className="h-6 w-6 text-amber-600" />;
              break;
            case "terms":
              title = "Términos de Uso";
              icon = <IconFileText className="h-6 w-6 text-green-600" />;
              break;
            case "license":
              title = "Licencias";
              icon = <IconFileText className="h-6 w-6 text-purple-600" />;
              break;
            case "privacy":
              title = "Política de Privacidad";
              icon = <IconLock className="h-6 w-6 text-blue-600" />;
              break;
          }

          existingTerms.push({
            id: term.id,
            title,
            content: term.content,
            version: term.version,
            icon,
            tag,
          });
        }
      });

      existingTerms.sort((a, b) => {
        const orderA = POLICY_ORDER[a.tag as keyof typeof POLICY_ORDER] || 999;
        const orderB = POLICY_ORDER[b.tag as keyof typeof POLICY_ORDER] || 999;
        return orderA - orderB;
      });

      setTerms(existingTerms);
    };

    fetchTerms();
  }, []);

  // -------------------- Manejo edición de términos (usa error global) --------------------
  const handleEdit = (id: number, content: string, version: string): void => {
    setEditMode(id);
    setEditContent(content);
    setEditVersion(version);
  };

  const handleSave = async (id: number): Promise<void> => {
    if (!editContent.trim()) {
      // Error de edición => error global
      setError("El contenido no puede estar vacío. Por favor, ingrese el contenido del término.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found, cannot save changes.");
        setLoading(false);
        return;
      }

      const currentTerm = terms.find((term) => term.id === id);
      let tag = "terms";
      if (currentTerm) {
        if (currentTerm.title === "Política de Cookies") tag = "cookies";
        else if (currentTerm.title === "Política de Privacidad") tag = "privacy";
        else if (currentTerm.title === "Licencias") tag = "license";
      }

      await axios.put(
        `${getApiBaseUrl()}/api/terms/update/${id}/`,
        {
          content: editContent,
          version: editVersion,
          tag: tag,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setTerms((prev) =>
        prev.map((term) =>
          term.id === id
            ? { ...term, content: editContent, version: editVersion, tag }
            : term
        )
      );

      setEditMode(null);
      setLoading(false);
    } catch (err: any) {
      console.error("Error updating term:", err.response?.data || err);
      setError("Error al actualizar el término. Por favor, inténtelo de nuevo.");
      setLoading(false);
    }
  };

  // Borrar término (usa error global)
  const handleDelete = async (id: number): Promise<void> => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found, cannot delete term.");
        setLoading(false);
        return;
      }

      await axios.delete(`${getApiBaseUrl()}/api/terms/delete/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedTerms = terms.filter((term) => term.id !== id);
      setTerms(updatedTerms);

      // Si borramos todo y no quedan términos, mostramos la vista "no hay términos"
      if (updatedTerms.length === 0) {
        setNoTermsFound(true);
      }
    } catch (err: any) {
      console.error("Error deleting term:", err.response?.data || err);
      setError("Error al eliminar el término. Por favor, inténtelo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  // -------------------- Manejo de añadir nuevo término (usa error del modal) --------------------
  const getAvailableTermTypes = () => {
    const allTypes = [
      { value: "terms", label: "Términos de Uso" },
      { value: "cookies", label: "Política de Cookies" },
      { value: "privacy", label: "Política de Privacidad" },
      { value: "license", label: "Licencias" },
    ];
    const existingTypes = terms.map((term) => term.tag);

    // Permitimos solo uno por cada tipo que ya exista
    return allTypes.filter((type) => !existingTypes.includes(type.value));
  };

  const handleAddTerm = async (): Promise<void> => {
    // Error del modal si campos vacíos
    if (!newTermType || !newTermContent) {
      setModalError("Por favor, complete todos los campos.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found, cannot add new term.");
        setLoading(false);
        return;
      }

      const versionToUse = newTermVersion.trim() || "v1.0";

      const response = await axios.post(
        `${getApiBaseUrl()}/api/terms/create/`,
        {
          content: newTermContent,
          version: versionToUse,
          tag: newTermType,
          modifier: adminUsername,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      let title = "";
      let icon = null;
      switch (newTermType) {
        case "terms":
          title = "Términos de Uso";
          icon = <IconFileText className="h-6 w-6 text-green-600" />;
          break;
        case "cookies":
          title = "Política de Cookies";
          icon = <IconCookie className="h-6 w-6 text-amber-600" />;
          break;
        case "privacy":
          title = "Política de Privacidad";
          icon = <IconLock className="h-6 w-6 text-blue-600" />;
          break;
        case "license":
          title = "Licencias";
          icon = <IconFileText className="h-6 w-6 text-purple-600" />;
          break;
      }

      const newTerm: TermItem = {
        id: response.data.id,
        title,
        content: newTermContent,
        version: versionToUse,
        icon,
        tag: newTermType,
      };

      setTerms((prev) => {
        const updated = [...prev, newTerm];
        updated.sort((a, b) => {
          const orderA = POLICY_ORDER[a.tag as keyof typeof POLICY_ORDER] || 999;
          const orderB = POLICY_ORDER[b.tag as keyof typeof POLICY_ORDER] || 999;
          return orderA - orderB;
        });
        return updated;
      });

      // Si estaba la vista de "no hay términos", la quitamos
      setNoTermsFound(false);

      // Cerrar modal y reset
      setShowAddForm(false);
      setNewTermType("");
      setNewTermContent("");
      setNewTermVersion("");
      setLoading(false);
    } catch (err: any) {
      console.error("Error adding term:", err.response?.data || err);
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Error al añadir el término. Por favor, inténtelo de nuevo.";
      setModalError(errorMessage);
      setLoading(false);
    }
  };

  // -------------------- Skeleton --------------------
  const TermSkeleton = (): React.ReactElement => (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100 animate-pulse" />
  );


  function getStaticPdfFilename(tag: string): string {
    switch (tag) {
      case "cookies":
        return "1_cookies_fisiofind.pdf";
      case "terms":
        return "2_terms_fisiofind.pdf";
      case "privacy":
        return "3_privacy_fisiofind.pdf";
      case "license":
        return "4_license_fisiofind.pdf";
      default:
        return "";
    }
  }

  // -------------------- Render Principal --------------------
  return (
    <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8 max-w-7xl">
      <h1 className="text-3xl font-bold text-center mb-12">
        FISIO FIND - INFORMACIÓN LEGAL
      </h1>

      {/* --------- ERROR GLOBAL (solo para edición/borrado/fetch) --------- */}
      {error && (
        <div
          className={`
            mb-8 text-center bg-red-50 border border-red-200 p-4 rounded-md 
            transition-opacity duration-1000 ease-out 
            ${fadeOut ? "opacity-0" : "opacity-100"}
          `}
        >
          <p className="text-red-600 font-semibold">{error}</p>
        </div>
      )}

      {loading ? (
        // -------- Loading skeleton --------
        <div className="container mx-auto py-12">
          <h2 className="text-2xl font-semibold text-center mb-4">Cargando...</h2>
          <BentoGrid className="max-w-6xl mx-auto">
            {[1, 2, 3, 4].map((item) => (
              <BentoGridItem
                key={item}
                header={<TermSkeleton />}
                title="Cargando..."
                description="Por favor espere mientras cargamos el contenido."
                icon={<IconRefresh className="h-4 w-4 text-neutral-500 animate-spin" />}
                className={item === 3 ? "md:col-span-3" : ""}
              />
            ))}
          </BentoGrid>
        </div>
      ) : noTermsFound ? (
        // -------- No hay términos --------
        <div className="max-w-2xl mx-auto text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm">
          <IconAlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Términos No Disponibles</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            No se pudieron cargar los términos y condiciones en este momento. Esto puede
            deberse a que:
          </p>
          <ul className="text-left text-gray-600 dark:text-gray-300 mb-4 pl-8 list-disc">
            <li>Los términos están siendo actualizados</li>
            <li>Se requiere iniciar sesión para acceder a esta información</li>
            <li>Hay un problema temporal con el servidor</li>
          </ul>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Si necesita acceder a esta información, por favor inicie sesión o póngase en
            contacto con nuestro equipo de soporte.
          </p>

          {isAdmin && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Panel de Administrador</h3>
              <button
                onClick={() => setShowAddForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Añadir Nuevo Término
              </button>
            </div>
          )}

          {/* ------------- MODAL: AÑADIR NUEVO TÉRMINO cuando no hay ninguno ------------- */}
          {showAddForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-2xl w-full relative">
                {/* Error local del modal */}
                {modalError && (
                  <div
                    className={`
                      mb-4 text-center bg-red-50 border border-red-200 p-4 rounded-md
                      transition-opacity duration-1000 ease-out
                      ${modalFadeOut ? "opacity-0" : "opacity-100"}
                    `}
                  >
                    <p className="text-red-600 font-semibold">{modalError}</p>
                  </div>
                )}

                <h2 className="text-xl font-bold mb-4">Añadir Nuevo Término</h2>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Tipo de Término
                  </label>
                  <select
                    value={newTermType}
                    onChange={(e) => setNewTermType(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Seleccione un tipo</option>
                    <option value="terms">Términos de Uso</option>
                    <option value="cookies">Política de Cookies</option>
                    <option value="privacy">Política de Privacidad</option>
                    <option value="license">Licencias</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Contenido</label>
                  <textarea
                    value={newTermContent}
                    onChange={(e) => setNewTermContent(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md h-64"
                    placeholder="Ingrese el contenido HTML del término..."
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Versión</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder='Ej: "v1.0"'
                    value={newTermVersion}
                    onChange={(e) => setNewTermVersion(e.target.value)}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleAddTerm}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Guardar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        // -------- Sí hay términos (vista normal) --------
        <>
          {/* Botón para añadir término si eres Admin y quedan tipos disponibles */}
          {isAdmin && getAvailableTermTypes().length > 0 && (
            <div className="mb-10 text-center">
              <button
                onClick={() => setShowAddForm(true)}
                className="px-5 py-2.5 bg-green-600 text-white rounded-md hover:bg-green-700 inline-flex items-center shadow-sm"
              >
                <IconPlus className="mr-2" size={16} />
                Añadir Nuevo Término
              </button>
            </div>
          )}

          <BentoGrid className="max-w-6xl mx-auto">
            {terms.map((term, i) => {
              // Helper para truncar texto
              const truncateByWords = (text: string, wordLimit: number): string => {
                const words = text.split(" ");
                if (words.length <= wordLimit) return text;
                return words.slice(0, wordLimit).join(" ").concat("...");
              };

              const termTag = term.tag;
              let firstSentence = "";

              // Lógica de truncado según el tag
              if (termTag === "terms" || termTag === "license") {
                const content = term.content.split("## 4. ")[1] || term.content;
                firstSentence = truncateByWords(content, 45);
              } else if (termTag === "cookies" || termTag === "privacy") {
                const content = term.content.split("## 4. ")[1] || term.content;
                firstSentence = truncateByWords(content, 30);
              } else {
                firstSentence = truncateByWords(term.content, 45);
              }

              return (
                <BentoGridItem
                  key={i}
                  title={
                    <div className="flex items-center justify-between">
                      <span>{term.title}</span>
                      <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                        {term.version}
                      </span>
                    </div>
                  }
                  description={
                    editMode === term.id ? (
                      // -------- Modo edición (inline) --------
                      <div className="space-y-4">
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md h-64 text-sm font-mono"
                          placeholder="Escriba el contenido en formato Markdown..."
                        />
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => setEditMode(null)}
                            className="p-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                          >
                            <IconX size={16} />
                          </button>
                          <button
                            onClick={() => handleSave(term.id)}
                            className="p-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                          >
                            <IconCheck size={16} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      // -------- Modo visualización --------
                      <div className="text-sm">
                        <div className="prose dark:prose-invert prose-sm">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeRaw]}
                          >
                            {firstSentence}
                          </ReactMarkdown>
                        </div>

                        <div className="mt-4 flex justify-between items-center">
                          <button
                            onClick={() => setActiveTermId(term.id)}
                            className="px-3 py-1.5 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-md text-xs font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                          >
                            Ver documento completo
                          </button>

                          {isAdmin && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() =>
                                  handleEdit(term.id, term.content, term.version)
                                }
                                className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                              >
                                <IconEdit size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(term.id)}
                                className="p-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                              >
                                <IconTrash size={16} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  }
                  icon={term.icon}
                  className={
                    term.title === "Términos de Uso"
                      ? "md:col-span-2"
                      : term.title === "Política de Cookies"
                      ? "md:col-span-1"
                      : term.title === "Política de Privacidad"
                      ? "md:col-span-1"
                      : term.title === "Licencias"
                      ? "md:col-span-2"
                      : ""
                  }
                />
              );
            })}
          </BentoGrid>

          {/* Info adicional */}
          <div className="max-w-4xl mx-auto mb-16 prose dark:prose-invert prose-sm text-center space-y-6">
            <br />
            <br />
            <p className="text-gray-600 dark:text-gray-300">
              Estos acuerdos son aplicables a todos los usuarios que accedan a la
              plataforma FisioFind, ya sea a través de navegadores web o aplicaciones
              móviles.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              FisioFind se reserva el derecho de modificar estos acuerdos en función
              de cambios legislativos o necesidades operativas.
            </p>
            <p>
              El presente acuerdo se regirá e interpretará de acuerdo con la legislación
              española.
            </p>
            <p>
              La utilización de la plataforma implica la aceptación íntegra de todas las
              condiciones aquí expuestas.
            </p>
            <br />
            <hr className="my-8 border-gray-200 dark:border-gray-700" />
          </div>

          {/* Modal para ver documento completo */}
          {activeTermId !== null && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {(() => {
                  const activeTerm = terms.find((term) => term.id === activeTermId);
                  if (!activeTerm) return null;

                  return (
                    <>
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                        <h3 className="text-lg font-semibold">
                          {activeTerm.title} - {activeTerm.version}
                        </h3>
                        <button
                          onClick={() => setActiveTermId(null)}
                          className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                          <IconX size={20} />
                        </button>
                      </div>

                      <div className="flex-1 overflow-y-auto p-6">
                        <div className="prose dark:prose-invert max-w-none">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeRaw]}
                          >
                            {activeTerm.content}
                          </ReactMarkdown>
                        </div>
                      </div>

                      <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                        <button
                          onClick={() => {
                            // 1) Decidir el PDF según el "tag" del término
                            const pdfFile = getStaticPdfFilename(activeTerm.tag || "");
                            if (!pdfFile) {
                              // Por si no hay coincidencia
                              alert("No existe un PDF para este tipo de término.");
                              return;
                            }

                            // 2) Construir la URL pública (carpeta /public/pdfs/06_terms/)
                            const pdfUrl = `/pdfs/06_terms/${pdfFile}`;

                            // 3) Crear enlace "invisible" y forzar click para descargar
                            const link = document.createElement("a");
                            link.href = pdfUrl;
                            link.download = pdfFile; // Para que el navegador lo baje directamente
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            />
                          </svg>
                          Descargar documento
                        </button>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          )}

          {/* ------------- MODAL: AÑADIR NUEVO TÉRMINO cuando sí hay términos ------------- */}
          {showAddForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-2xl w-full relative">
                {/* Error local del modal */}
                {modalError && (
                  <div
                    className={`
                      mb-4 text-center bg-red-50 border border-red-200 p-4 rounded-md
                      transition-opacity duration-1000 ease-out
                      ${modalFadeOut ? "opacity-0" : "opacity-100"}
                    `}
                  >
                    <p className="text-red-600 font-semibold">{modalError}</p>
                  </div>
                )}

                <h2 className="text-xl font-bold mb-4">Añadir Nuevo Término</h2>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Tipo de Término</label>
                  <select
                    value={newTermType}
                    onChange={(e) => setNewTermType(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Seleccione un tipo</option>
                    {getAvailableTermTypes().map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Contenido</label>
                  <textarea
                    value={newTermContent}
                    onChange={(e) => setNewTermContent(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md h-64"
                    placeholder="Ingrese el contenido HTML del término..."
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Versión</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder='Ej: "v1.0"'
                    value={newTermVersion}
                    onChange={(e) => setNewTermVersion(e.target.value)}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleAddTerm}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Guardar
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="text-center mt-8 text-sm text-gray-500">
            <p>Última actualización: {new Date().toLocaleDateString()}</p>
            <p>
              Si tiene alguna pregunta sobre nuestros términos o no puede acceder a ellos, por favor
              contáctenos.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
