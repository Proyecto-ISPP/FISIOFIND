"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getApiBaseUrl } from "@/utils/api";

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
  const [patientResponse, setPatientResponse] = useState<{
    response_text?: string;
    response_scale?: number;
    submitted_at: string;
  } | null>(null);
  const [testAnswered, setTestAnswered] = useState(false);

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
            setPatientResponse(responses[0]); // Get the first response
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

      alert(existingTest ? "Test actualizado correctamente" : "Test creado correctamente");
      router.push(`/physio-management/follow-up/${treatmentId}/sessions`);
    } catch (error) {
      console.error("Error al guardar el test:", error);
      setError("Error al guardar el test");
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
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al eliminar el test");
      }

      alert("Test eliminado correctamente");
      router.push(`/physio-management/follow-up/${treatmentId}/sessions`);
    } catch (error) {
      console.error("Error al eliminar el test:", error);
      setError("Error al eliminar el test");
    }
  };

  const handleGoBack = () => {
    router.push(`/physio-management/follow-up/${treatmentId}/sessions`);
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
          Cuestionario de la {session}
        </h1>

        <div className="rounded-lg p-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {testAnswered && (
                <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-xl mb-6 max-w-2xl mx-auto">
                  <h2 className="font-semibold text-lg mb-2">Respuesta del paciente</h2>
                  {patientResponse && (
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      {formData.test_type === "text" ? (
                        <p className="text-gray-700">{patientResponse.response_text}</p>
                      ) : (
                        <div className="flex items-center">
                          <span className="font-bold text-lg mr-2">{patientResponse.response_scale}</span>
                          <span className="text-gray-600">
                            {formData.scale_labels.find(
                              (label) => label.scale_value === patientResponse?.response_scale?.toString()
                            )?.label || ""}
                          </span>
                        </div>
                      )}
                      <p className="text-sm text-gray-500 mt-2">
                        Respondido el: {patientResponse.submitted_at ? new Date(patientResponse.submitted_at).toLocaleString() : 'Fecha no disponible'}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
                {error && (
                  <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                    {error}
                  </div>
                )}

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2" htmlFor="question">
                    Pregunta
                  </label>
                  <textarea
                    id="question"
                    name="question"
                    rows={3}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      testAnswered ? "bg-gray-100" : ""
                    }`}
                    placeholder="Ingrese la pregunta para el paciente"
                    value={formData.question}
                    onChange={handleInputChange}
                    required
                    disabled={testAnswered}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">
                    Tipo de respuesta
                  </label>
                  <div className="flex flex-wrap gap-4 mt-2 justify-center">
                    <div 
                      className={`px-6 py-3 border rounded-xl transition-all duration-200 text-center ${
                        formData.test_type === "text"
                          ? "bg-[#05668d] border-[#05668d] shadow-md"
                          : "bg-white border-gray-300"
                      } ${testAnswered ? "opacity-70 cursor-not-allowed" : "cursor-pointer hover:bg-gray-50"}`}
                      onClick={() => !testAnswered && setFormData({...formData, test_type: "text"})}
                    >
                      <span className={`font-medium ${formData.test_type === "text" ? "text-white" : "text-gray-700"}`}>
                        Texto libre
                      </span>
                    </div>
                    <div 
                      className={`px-6 py-3 border rounded-xl transition-all duration-200 text-center ${
                        formData.test_type === "scale"
                          ? "bg-[#05668d] border-[#05668d] shadow-md"
                          : "bg-white border-gray-300"
                      } ${testAnswered ? "opacity-70 cursor-not-allowed" : "cursor-pointer hover:bg-gray-50"}`}
                      onClick={() => !testAnswered && setFormData({...formData, test_type: "scale"})}
                    >
                      <span className={`font-medium ${formData.test_type === "scale" ? "text-white" : "text-gray-700"}`}>
                        Escala numérica
                      </span>
                    </div>
                  </div>
                </div>

                {formData.test_type === "scale" && (
                  <div className="mb-4">
                    <p className="mb-2 text-gray-700">
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
                            className={`w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              testAnswered ? "bg-gray-100" : ""
                            }`}
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
                            className={`w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              testAnswered ? "bg-gray-100" : ""
                            }`}
                            required
                            disabled={testAnswered}
                          />
                        </div>
                        {!testAnswered && formData.scale_labels.length > 1 && (
                          <div className="flex justify-between items-start">
                            <button
                              onClick={() => removeScaleLabel(index)}
                              className="mb-1000 p-2 text-red-500 hover:text-red-700 transition-colors duration-200 bg-transparent hover:bg-transparent"
                              title="Eliminar serie"
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
                        className="w-full py-2 border border-dashed border-gray-300 rounded-xl hover:border-gray-40 text-white"
                      >
                        + Añadir etiqueta
                      </button>
                    )}
                  </div>
                )}

                <div className="flex justify-between mt-8">
                  {existingTest && !testAnswered && (
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="px-4 py-2 bg-red-400 text-white rounded-xl hover:bg-red-500"
                    >
                      Eliminar Test
                    </button>
                  )}
                  <div className="flex gap-3 ml-auto">
                    <button
                      type="button"
                      onClick={handleGoBack}
                      className="px-4 py-2 bg-[#05668d] border border-gray-300 rounded-xl hover:bg-[#045a7c]"
                    >
                      Cancelar
                    </button>
                    {!testAnswered && (
                      <button
                        type="submit"
                        disabled={submitting}
                        className="px-4 py-2 bg-[#6bc9be] text-white rounded-xl hover:bg-[#5ab8ad] disabled:opacity-50"
                      >
                        {submitting
                          ? "Procesando..."
                          : existingTest
                          ? "Actualizar"
                          : "Crear"}{" "}
                        Test
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
