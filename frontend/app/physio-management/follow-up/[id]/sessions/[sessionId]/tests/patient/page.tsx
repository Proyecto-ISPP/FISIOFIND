"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getApiBaseUrl } from "@/utils/api";

interface TestData {
  id: number;
  question: string;
  test_type: "text" | "scale";
  scale_labels?: Record<string, string>;
}

interface ResponseFormData {
  response_text: string;
  response_scale: number | null;
}

const PatientTestResponsePage = () => {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;
  const treatmentId = params.treatmentId as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [test, setTest] = useState<TestData | null>(null);
  const [formData, setFormData] = useState<ResponseFormData>({
    response_text: "",
    response_scale: null,
  });
  const [error, setError] = useState("");
  const [sessionName, setSessionName] = useState("");
  const [hasResponded, setHasResponded] = useState(false);

  useEffect(() => {
    const fetchTest = async () => {
      setLoading(true);
      try {
        // Fetch the test for this session
        const response = await fetch(
          `${getApiBaseUrl()}/api/treatments/sessions/${sessionId}/test/view/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          if (response.status === 404) {
            setError("No hay cuestionario disponible para esta sesión");
            return;
          }
          throw new Error("Error al cargar el cuestionario");
        }

        const data = await response.json();
        setTest(data);
      } catch (error) {
        console.error("Error al cargar el test:", error);
        setError("Error al cargar el cuestionario");
      } finally {
        setLoading(false);
      }
    };

    const fetchSession = async () => {
      try {
        const response = await fetch(
          `${getApiBaseUrl()}/api/treatments/sessions/${sessionId}/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const session = await response.json();
          if (session && session.name) {
            setSessionName(session.name);
          }
        }
      } catch (error) {
        console.error("Error al cargar la sesión:", error);
      }
    };

    const checkPreviousResponses = async () => {
      try {
        const response = await fetch(
          `${getApiBaseUrl()}/api/treatments/sessions/${sessionId}/test/responses/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setHasResponded(true);
            // Optionally, you could load the previous response into the form
            // if you want to allow editing
          }
        }
      } catch (error) {
        console.error("Error al verificar respuestas previas:", error);
      }
    };

    fetchTest();
    fetchSession();
    checkPreviousResponses();
  }, [sessionId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleScaleChange = (value: number) => {
    setFormData({
      ...formData,
      response_scale: value,
      response_text: "", // Clear text response when scale is selected
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    if (!test) {
      setError("No hay cuestionario para responder");
      setSubmitting(false);
      return;
    }

    // Validate form data based on test type
    if (test.test_type === "text" && !formData.response_text) {
      setError("Por favor, ingrese una respuesta");
      setSubmitting(false);
      return;
    }

    if (test.test_type === "scale" && formData.response_scale === null) {
      setError("Por favor, seleccione un valor en la escala");
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch(
        `${getApiBaseUrl()}/api/treatments/sessions/${sessionId}/test/respond/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            test: test.id,
            response_text: test.test_type === "text" ? formData.response_text : null,
            response_scale: test.test_type === "scale" ? formData.response_scale : null,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al enviar la respuesta");
      }

      alert("Respuesta enviada correctamente");
      // Remove the redirect
      // router.push(`/patient/treatments/${treatmentId}/sessions`);
      
      // Instead, update the UI to show the test has been completed
      setHasResponded(true);
    } catch (error) {
      console.error("Error al enviar la respuesta:", error);
      setError("Error al enviar la respuesta");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoBack = () => {
    router.push(`/patient/treatments/${treatmentId}/sessions`);
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={handleGoBack}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-xl inline-flex items-center mb-6"
        >
          ← Volver
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Cuestionario de {sessionName}
        </h1>

        <div className="rounded-lg p-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-4">
              {error}
            </div>
          ) : hasResponded ? (
            <div className="bg-green-100 text-green-700 p-4 rounded-xl mb-4">
              Ya has respondido a este cuestionario. Gracias por tu participación.
            </div>
          ) : test ? (
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
              <div className="mb-6 p-6 bg-white rounded-xl shadow-sm">
                <h2 className="text-xl font-semibold mb-4">{test.question}</h2>

                {test.test_type === "text" ? (
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="response_text">
                      Tu respuesta:
                    </label>
                    <textarea
                      id="response_text"
                      name="response_text"
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Escribe tu respuesta aquí..."
                      value={formData.response_text}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                ) : (
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">
                      Selecciona un valor en la escala:
                    </label>
                    <div className="flex flex-wrap gap-2 mt-4 justify-center">
                      {test.scale_labels && 
                        Object.entries(test.scale_labels).map(([value, label]) => (
                          <div 
                            key={value}
                            className={`px-4 py-3 border rounded-xl cursor-pointer transition-all duration-200 text-center ${
                              formData.response_scale === parseInt(value)
                                ? "bg-[#05668d] border-[#05668d] shadow-md"
                                : "bg-white border-gray-300 hover:bg-gray-50"
                            }`}
                            onClick={() => handleScaleChange(parseInt(value))}
                          >
                            <div className={`font-bold text-lg mb-1 ${formData.response_scale === parseInt(value) ? "text-white" : "text-gray-700"}`}>
                              {value}
                            </div>
                            <span className={`text-sm ${formData.response_scale === parseInt(value) ? "text-white" : "text-gray-600"}`}>
                              {label}
                            </span>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={handleGoBack}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 mr-3"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-[#05668d] text-white rounded-xl hover:bg-[#045a7c] disabled:opacity-50"
                >
                  {submitting ? "Enviando..." : "Enviar respuesta"}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">No hay cuestionario disponible para esta sesión.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientTestResponsePage;