"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getApiBaseUrl } from "@/utils/api";
import Alert from "@/components/ui/Alert";

interface TestFormData {
  question: string;
  test_type: "text" | "scale";
  scale_labels?: Record<string, string>;
}

const TestPage = () => {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;
  const treatmentId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [existingTest, setExistingTest] = useState<TestFormData | null>(null);
  const [formData, setFormData] = useState({
    question: "",
    test_type: "text",
    scale_labels: [{ scale_value: "1", label: "" }],
  });
  const [error, setError] = useState("");
  const [session, setSession] = useState("");
  // Update the state to store multiple responses
  const [patientResponses, setPatientResponses] = useState<{
    response_text?: string;
    response_scale?: number;
    submitted_at: string;
  }[]>([]);
  const [testAnswered, setTestAnswered] = useState(false);
  
  const [alert, setAlert] = useState<{
    show: boolean;
    type: "success" | "error" | "info" | "warning";
    message: string;
  }>({ show: false, type: "success", message: "" });
  // Fetch existing test if available
  useEffect(() => {
    const fetchTest = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${getApiBaseUrl()}/api/treatments/sessions/${sessionId}/test/view/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        setExistingTest(data);
  
        // Set form values from existing test
        setFormData({
          question: data.question,
          test_type: data.test_type,
          scale_labels: data.scale_labels
            ? Object.entries(data.scale_labels).map(([key, value]) => ({
                scale_value: key,
                label: value as string,
              }))
            : [{ scale_value: "1", label: "" }],
        });
        
        // Check if the test has been answered
        const responseData = await fetch(
          `${getApiBaseUrl()}/api/treatments/sessions/${sessionId}/test/responses/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        
        if (responseData.ok) {
          const responses = await responseData.json();
          if (responses && responses.length > 0) {
            setPatientResponses(responses); // Store all responses
            setTestAnswered(true);
          }
        }
      } catch (error: Error | unknown) {
        if ((error as { status?: number }).status !== 404) {
          setError("Error al cargar el test");
        }
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

        // Check if there's content before parsing
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const session = await response.json();
          if (session && session.name) {
            setSession(session.name);
          }
        } else {
          console.log("La respuesta no es JSON válido");
        }
      } catch (error) {
        console.error("Error al cargar la sesión:", error);
      }
    };

    fetchTest();
    fetchSession();
  }, [sessionId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleScaleLabelChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updatedLabels = [...formData.scale_labels];
    updatedLabels[index] = {
      ...updatedLabels[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      scale_labels: updatedLabels,
    });
  };

  const addScaleLabel = () => {
    setFormData({
      ...formData,
      scale_labels: [...formData.scale_labels, { scale_value: "", label: "" }],
    });
  };

  const removeScaleLabel = (index: number) => {
    const updatedLabels = [...formData.scale_labels];
    updatedLabels.splice(index, 1);
    setFormData({
      ...formData,
      scale_labels: updatedLabels,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent submission if the test has been answered
    if (testAnswered) {
      return;
    }
    
    setSubmitting(true);
    setError("");

    // Format scale labels if present
    const formattedData: TestFormData = {
      question: formData.question,
      test_type: formData.test_type as "text" | "scale",
    };

    if (formData.test_type === "scale" && formData.scale_labels) {
      const scaleLabels: Record<string, string> = {};
      formData.scale_labels.forEach(
        (item: { scale_value: string; label: string }) => {
          if (item.scale_value && item.label) {
            scaleLabels[item.scale_value] = item.label;
          }
        }
      );
      formattedData.scale_labels = scaleLabels;
    }

    try {
      const response = await fetch(
        `${getApiBaseUrl()}/api/treatments/sessions/${sessionId}/test/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(formattedData),
        }
      );

      if (!response.ok) {
        throw new Error("Error al guardar el test");
      }

      setAlert({
        show: true,
        type: "success",
        message: existingTest ? "Test actualizado correctamente" : "Test creado correctamente"
      });
      setTimeout(() => {
        router.push(`/physio-management/follow-up/${treatmentId}/sessions`);
      }, 1000);
    } catch (error) {
      console.error("Error al guardar el test:", error);
      setAlert({
        show: true,
        type: "error",
        message: "Error al guardar el test"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!existingTest) return;

    try {
      const response = await fetch(
        `${getApiBaseUrl()}/api/treatments/sessions/${sessionId}/test/delete/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al eliminar el test");
      }

      setAlert({
        show: true,
        type: "success",
        message: "Test eliminado correctamente"
      });
      setTimeout(() => {
        router.push(`/physio-management/follow-up/${treatmentId}/sessions`);
      }, 1000);
    } catch (error) {
      console.error("Error al eliminar el test:", error);
      setAlert({
        show: true,
        type: "error",
        message: "Error al eliminar el test"
      });
    }
  };

  const handleGoBack = () => {
    router.push(`/physio-management/follow-up/${treatmentId}/sessions`);
  };

  // Update the render section to display all responses
  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white py-8 px-2">
      {alert.show && (
        <div className="max-w-2xl mx-auto mb-6">
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert({ ...alert, show: false })}
          />
        </div>
      )}
      <div className="max-w-3xl mx-auto">
      <button
        onClick={handleGoBack}
        className="mb-6 flex items-center text-blue-600 hover:text-blue-800"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Volver a las sesiones
      </button>
        <h1 className="text-3xl font-bold text-[#05668D] mb-8 text-center">
          Cuestionario de la {session}
        </h1>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-[#e0f2f1]">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#41B8D5]"></div>
            </div>
          ) : (
            <>
              {testAnswered && (
                <div className="bg-[#e6f7f6] border border-[#6BC9BE] text-[#05668D] p-4 rounded-xl mb-6 max-w-2xl mx-auto">
                  <h2 className="font-semibold text-lg mb-2 text-[#05668D]">
                    Respuestas del paciente
                  </h2>
                  {patientResponses.length > 0 ? (
                    <div className="space-y-4">
                      {patientResponses.map((response, index) => (
                        <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-[#e0f2f1]">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-[#05668D]">Respuesta {index + 1}</span>
                            <span className="text-sm text-gray-500">
                              {response.submitted_at ? new Date(response.submitted_at).toLocaleString() : 'Fecha no disponible'}
                            </span>
                          </div>
                          {formData.test_type === "text" ? (
                            <p className="text-gray-700">{response.response_text}</p>
                          ) : (
                            <div className="flex items-center">
                              <span className="font-bold text-lg mr-2 text-[#41B8D5]">{response.response_scale}</span>
                              <span className="text-gray-600">
                                {formData.scale_labels.find(
                                  (label) => label.scale_value === response.response_scale?.toString()
                                )?.label || ""}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">No hay respuestas disponibles</p>
                  )}
                </div>
              )}

              <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
                {error && (
                  <div className="bg-red-100 text-red-700 p-3 rounded mb-4 border border-red-200">
                    {error}
                  </div>
                )}

                <div className="mb-6">
                  <label className="block text-[#05668D] font-medium mb-2" htmlFor="question">
                    Pregunta
                  </label>
                  <textarea
                    id="question"
                    name="question"
                    rows={3}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#41B8D5] transition-all duration-200 ${testAnswered ? "bg-gray-100" : ""}`}
                    placeholder="Ingrese la pregunta para el paciente"
                    value={formData.question}
                    onChange={handleInputChange}
                    required
                    disabled={testAnswered}
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-[#05668D] font-medium mb-2">
                    Tipo de respuesta
                  </label>
                  <div className="flex flex-wrap gap-4 mt-2 justify-center">
                    <div
                      className={`px-6 py-2 border rounded-xl transition-all duration-200 text-center text-sm font-medium ${
                        formData.test_type === "text"
                          ? "bg-[#05668d] border-[#05668d] text-white shadow-md"
                          : "bg-white border-gray-300 text-[#05668D]"
                      } ${testAnswered ? "opacity-70 cursor-not-allowed" : "cursor-pointer hover:bg-gray-50"}`}
                      onClick={() => !testAnswered && setFormData({...formData, test_type: "text"})}
                    >
                      Texto libre
                    </div>
                    <div
                      className={`px-6 py-2 border rounded-xl transition-all duration-200 text-center text-sm font-medium ${
                        formData.test_type === "scale"
                          ? "bg-[#05668d] border-[#05668d] text-white shadow-md"
                          : "bg-white border-gray-300 text-[#05668D]"
                      } ${testAnswered ? "opacity-70 cursor-not-allowed" : "cursor-pointer hover:bg-gray-50"}`}
                      onClick={() => !testAnswered && setFormData({...formData, test_type: "scale"})}
                    >
                      Escala numérica
                    </div>
                  </div>
                </div>

                {formData.test_type === "scale" && (
                  <div className="mb-6">
                    <p className="mb-2 text-[#05668D] font-medium">
                      Etiquetas para la escala numérica:
                    </p>
                    {formData.scale_labels.map((item, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <div className="w-1/4">
                          <input
                            type="number"
                            min={1}
                            max={10}
                            placeholder="Valor (1-10)"
                            value={item.scale_value}
                            onChange={(e) =>
                              handleScaleLabelChange(
                                index,
                                "scale_value",
                                e.target.value
                              )
                            }
                            className={`w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#41B8D5] transition-all duration-200 ${testAnswered ? "bg-gray-100" : ""}`}
                            required
                            disabled={testAnswered}
                          />
                        </div>
                        <div className="w-3/4">
                          <input
                            type="text"
                            placeholder="Etiqueta (ej: 'Poco dolor')"
                            value={item.label}
                            onChange={(e) =>
                              handleScaleLabelChange(
                                index,
                                "label",
                                e.target.value
                              )
                            }
                            className={`w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#41B8D5] transition-all duration-200 ${testAnswered ? "bg-gray-100" : ""}`}
                            required
                            disabled={testAnswered}
                          />
                        </div>
                        {!testAnswered && formData.scale_labels.length > 1 && (
                          <div className="flex justify-between items-start">
                            <button
                              onClick={() => removeScaleLabel(index)}
                              className="p-2 text-red-500 hover:text-red-700 transition-colors duration-200 bg-transparent hover:bg-transparent"
                              title="Eliminar serie"
                              type="button"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                viewBox="1 1 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                    {!testAnswered && (
                      <button
                        type="button"
                        onClick={addScaleLabel}
                        className="w-full py-2 border border-dashed border-[#41B8D5] rounded-xl hover:border-[#6BC9BE] text-[#41B8D5] font-medium mt-2"
                      >
                        + Añadir etiqueta
                      </button>
                    )}
                  </div>
                )}

                <div className="flex flex-wrap justify-between mt-8 gap-2">
                  {existingTest && !testAnswered && (
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="px-4 py-2 bg-[#e57373] text-white rounded-xl hover:bg-[#d32f2f] transition-all duration-200"
                    >
                      Eliminar Test
                    </button>
                  )}
                  <div className="flex gap-3 ml-auto">
                    <button
                      type="button"
                      onClick={handleGoBack}
                      className="px-4 py-2 bg-white border border-[#05668D] text-[#05668D] rounded-xl hover:bg-[#e6f7f6] transition-all duration-200 font-medium"
                    >
                      Cancelar
                    </button>
                    {!testAnswered && (
                      <button
                        type="submit"
                        disabled={submitting}
                        className="px-4 py-2 bg-gradient-to-r from-[#6BC9BE] to-[#05668D] text-white rounded-xl hover:opacity-90 disabled:opacity-50 font-medium shadow-md"
                      >
                        {submitting
                          ? "Procesando..."
                          : existingTest
                          ? "Actualizar"
                          : "Crear"} Test
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestPage;
