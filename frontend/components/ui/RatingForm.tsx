"use client";

import { getApiBaseUrl } from "@/utils/api";
import { useState } from "react";
import { BsStar, BsStarHalf, BsStarFill } from "react-icons/bs";

interface ModalRatingProps {
  appointmentId: number; // Replace 'string' with the appropriate type if needed
}

const ModalRating = ({ appointmentId }: ModalRatingProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [input, setInput] = useState({ comment: "", rating: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

//   useEffect(() => {
//     if (submitted) {
//       const timer = setTimeout(() => {
//         window.location.href = "/";
//       }, 2000);
//       return () => clearTimeout(timer);
//     }
//   }, [submitted]);

  const submitHandler = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No se ha encontrado el token de autenticación");
      }

      const response = await fetch(`${getApiBaseUrl()}/api/ratings/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appointment: appointmentId,
          score: input.rating,
          comment: input.comment,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al enviar la valoración");
      }
      await response.json();
      setSubmitted(true); // Marca como enviado
    } catch (error) {
      alert(error.message || "Error al enviar la valoración");
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setInput({ comment: "", rating: 0 });
    setSubmitted(false);
  };

  return (
    <>
      <button onClick={() => setModalVisible(true)}>Dejar valoración</button>

      {modalVisible && (
        <div onClick={() => closeModal()}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div onClick={(e) => e.stopPropagation()} 
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              width: "400px",
              maxWidth: "90%",
              textAlign: "center",
            }}
          >
            {submitted ? (
              <>
                <h3>¡Gracias por tu opinión!</h3>
                <div style={{ marginTop: "20px", height: "50px", width: "50px", justifySelf: "center", marginBottom: "8px"}}>
                  <svg
                    fill="#1cb521"
                    version="1.1"
                    id="Capa_1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 32.00 32.00"
                    stroke="#1cb521"
                    stroke-width="0.00031999"
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <g>
                        {" "}
                        <path d="M31.41,16.733c0.785-0.402,0.785-1.063,0-1.471c-0.782-0.403-0.864-1.191-0.184-1.749c0.684-0.558,0.545-1.206-0.305-1.438 c-0.853-0.233-1.096-0.987-0.544-1.675s0.282-1.291-0.599-1.343c-0.881-0.05-1.276-0.734-0.879-1.522 c0.395-0.79,0.009-1.324-0.863-1.19c-0.874,0.134-1.403-0.454-1.18-1.309c0.226-0.852-0.267-1.295-1.092-0.984 c-0.824,0.313-1.467-0.152-1.425-1.034c0.043-0.881-0.53-1.212-1.272-0.734c-0.742,0.477-1.465,0.155-1.608-0.717 c-0.143-0.871-0.771-1.074-1.396-0.454c-0.628,0.622-1.401,0.456-1.722-0.365c-0.32-0.823-0.977-0.891-1.461-0.155 c-0.485,0.739-1.277,0.739-1.762,0c-0.482-0.736-1.142-0.667-1.461,0.155c-0.319,0.821-1.095,0.986-1.721,0.365 c-0.628-0.62-1.256-0.417-1.397,0.454C10.396,2.44,9.674,2.762,8.932,2.285C8.188,1.808,7.616,2.139,7.657,3.02 c0.042,0.882-0.599,1.347-1.424,1.034C5.408,3.742,4.916,4.186,5.14,5.038C5.366,5.892,4.835,6.48,3.964,6.347 c-0.873-0.134-1.262,0.4-0.864,1.19c0.396,0.788,0.001,1.472-0.88,1.522c-0.882,0.052-1.151,0.655-0.599,1.343 c0.551,0.688,0.308,1.441-0.542,1.675c-0.854,0.231-0.99,0.88-0.307,1.438c0.684,0.558,0.602,1.346-0.184,1.749 c-0.785,0.406-0.785,1.067,0,1.47c0.784,0.406,0.867,1.192,0.184,1.752c-0.684,0.559-0.547,1.206,0.307,1.438 c0.85,0.231,1.094,0.985,0.542,1.675c-0.553,0.687-0.283,1.291,0.599,1.343c0.88,0.049,1.275,0.733,0.879,1.523 c-0.396,0.786-0.009,1.321,0.864,1.188c0.871-0.132,1.402,0.456,1.176,1.309c-0.224,0.854,0.269,1.296,1.094,0.984 c0.825-0.313,1.466,0.153,1.423,1.035c-0.042,0.88,0.531,1.21,1.273,0.732c0.742-0.476,1.465-0.153,1.608,0.717 c0.143,0.869,0.771,1.075,1.397,0.453c0.626-0.62,1.401-0.455,1.72,0.367c0.32,0.823,0.979,0.892,1.462,0.154 c0.484-0.738,1.276-0.738,1.762,0c0.483,0.736,1.141,0.669,1.461-0.154c0.32-0.822,1.094-0.987,1.722-0.367 c0.627,0.622,1.255,0.416,1.396-0.453c0.144-0.87,0.866-1.191,1.608-0.717c0.743,0.478,1.315,0.146,1.272-0.732 c-0.042-0.882,0.601-1.349,1.425-1.035c0.825,0.312,1.316-0.13,1.092-0.984c-0.224-0.853,0.306-1.439,1.18-1.309 c0.871,0.135,1.258-0.4,0.863-1.188c-0.397-0.79-0.002-1.476,0.879-1.523c0.881-0.052,1.15-0.656,0.599-1.346 c-0.553-0.688-0.309-1.441,0.544-1.674c0.85-0.23,0.988-0.879,0.305-1.438C30.546,17.926,30.628,17.14,31.41,16.733z M16.055,29.127c-3.899,0-7.393-1.729-9.767-4.449c0.298-0.022,0.633-0.045,0.917-0.045c0.281,0,0.565-0.018,0.839-0.033 c0.24-0.017,0.471-0.027,0.683-0.027h0.1c0.199,0.041,0.401,0.062,0.612,0.087c0.188,0.02,0.382,0.039,0.586,0.079 c0.229,0.045,0.466,0.268,0.694,0.482c0.132,0.125,0.263,0.246,0.391,0.339c0.132,0.093,0.259,0.185,0.389,0.278 c0.396,0.289,0.809,0.589,1.275,0.797c0.576,0.248,1.211,0.33,1.828,0.409c0.299,0.038,0.597,0.075,0.881,0.134 c0.187,0.021,0.347,0.039,0.508,0.058c0.482,0.055,0.981,0.112,1.48,0.112c0.337,0,0.635-0.026,0.909-0.081 c0.985-0.28,1.611-1.079,1.612-1.996c0.501-0.199,0.947-0.617,1.23-1.152c0.252-0.479,0.337-0.991,0.246-1.443 c0.951-0.623,1.441-1.79,1.178-2.791c0.419-0.288,0.709-0.771,0.811-1.359c0.14-0.816-0.111-1.684-0.641-2.208 c-0.7-0.667-1.667-0.829-2.521-0.971c-0.134-0.021-0.267-0.046-0.396-0.068c-0.096-0.026-0.219-0.055-0.343-0.082 c-1.138-0.266-1.943-0.523-1.944-1.455c-0.003-0.614,0.2-1.181,0.413-1.784c0.245-0.689,0.498-1.403,0.458-2.235 c-0.077-1.481-0.706-2.771-1.683-3.45c-0.39-0.312-0.904-0.496-1.392-0.496c-0.728,0-1.27,0.395-1.49,1.083 c-0.155,0.465-0.129,0.914-0.103,1.392c0.006,0.118,0.015,0.239,0.019,0.364c0.026,0.657-0.051,1.199-0.243,1.713 c-0.364,1.026-1.094,1.982-1.689,2.702l-0.326,0.409c-0.456,0.574-0.927,1.17-1.463,1.647c-0.263,0.208-0.543,0.282-0.902,0.36 c-0.102,0.005-0.189,0.033-0.265,0.054c-0.047,0.018-0.1,0.033-0.128,0.033c-0.354-0.026-0.73-0.054-1.119-0.054 c-0.535,0-3.091,0.025-4.547,0.04C3.543,8.776,9.173,3.406,16.055,3.406c7.136,0,12.942,5.769,12.942,12.86 S23.189,29.127,16.055,29.127z M15.151,8.15l-0.006-0.112c-0.027-0.45-0.036-0.936,0.22-0.972c0.018-0.001,0.038-0.003,0.06-0.003 c0.414,0,0.934,0.519,1.242,1c0.323,0.612,0.491,1.255,0.475,1.834c-0.017,0.603-0.213,1.174-0.422,1.779 c-0.245,0.712-0.5,1.451-0.44,2.257c0.083,1.096,0.953,2.043,2.165,2.356c0.354,0.093,0.729,0.153,1.091,0.212 c0.676,0.109,1.374,0.226,1.943,0.543c0.372,0.188,0.769,0.579,0.698,1.096c-0.033,0.28-0.161,0.627-0.587,0.704 c-0.23,0.065-0.384,0.199-0.458,0.39c-0.089,0.227-0.056,0.511,0.091,0.755c0.154,0.184,0.178,0.564,0.087,0.898 c-0.125,0.397-0.414,0.678-0.863,0.83c-0.19,0.023-0.361,0.155-0.454,0.357c-0.106,0.229-0.083,0.479,0.063,0.651 c0.126,0.182,0.103,0.59-0.073,0.929c-0.139,0.265-0.336,0.426-0.527,0.426c-0.026,0-0.054-0.002-0.081-0.01l-0.03-0.006H19.31 c-0.234,0-0.541,0.104-0.692,0.338c-0.101,0.152-0.114,0.343-0.038,0.514c0.094,0.253,0.083,0.54-0.033,0.732 c-0.085,0.139-0.219,0.223-0.401,0.245c-0.321,0.086-0.643,0.086-0.954,0.086c-0.923-0.083-1.904-0.172-2.852-0.344l-0.452-0.102 c-0.234-0.054-0.467-0.104-0.673-0.157c-0.339-0.166-0.719-0.452-1.084-0.729c-0.122-0.093-0.241-0.183-0.359-0.268 c-0.085-0.066-0.178-0.155-0.271-0.244c-0.242-0.228-0.513-0.481-0.85-0.574c-0.316-0.195-0.653-0.195-0.929-0.195 c-0.882-0.082-1.3-0.401-1.515-1.176C7.995,21.413,7.987,20.523,8,19.752l0.002-0.174c0.007-0.728,0.019-1.635,0.392-2.296 c0.187-0.315,0.556-0.383,0.983-0.463c0.591-0.097,1.058-0.291,1.493-0.626c0.062-0.021,0.126-0.067,0.172-0.154 c0.177-0.12,0.321-0.298,0.455-0.457c0.699-0.762,1.345-1.555,1.851-2.284c0.119-0.177,0.237-0.345,0.354-0.511 c0.539-0.771,1.097-1.566,1.334-2.549C15.206,9.517,15.188,8.892,15.151,8.15z"></path>{" "}
                      </g>{" "}
                    </g>
                  </svg>{" "}
                </div>
              </>
            ) : (
              <>
                <h3>Deja tu valoración</h3>
                <div
                  style={{
                    display: "flex",
                    marginBottom: "10px",
                    justifyContent: "center",
                  }}
                >
                  {Array.from({ length: 5 }, (_, index) => {
                    const starValue = index + 1;
                    let icon;
                    if (input.rating >= starValue) {
                      icon = <BsStarFill color="gold" size={24} />;
                    } else if (input.rating >= starValue - 0.5) {
                      icon = <BsStarHalf color="gold" size={24} />;
                    } else {
                      icon = <BsStar color="gold" size={24} />;
                    }
                    return (
                      <div
                        key={index}
                        style={{
                          display: "inline-block",
                          position: "relative",
                          width: "24px",
                          height: "24px",
                          marginRight: "4px",
                        }}
                      >
                        {icon}
                        <div
                          onClick={() =>
                            setInput({ ...input, rating: index + 0.5 })
                          }
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "50%",
                            height: "100%",
                            cursor: "pointer",
                            zIndex: 1,
                          }}
                        />
                        <div
                          onClick={() =>
                            setInput({ ...input, rating: index + 1 })
                          }
                          style={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            width: "50%",
                            height: "100%",
                            cursor: "pointer",
                            zIndex: 1,
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <textarea
                    rows={4}
                    style={{
                      width: "100%",
                      padding: "8px",
                      fontSize: "14px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                    }}
                    placeholder="Escribe tu comentario (máx 250 caracteres)..."
                    value={input.comment}
                    onChange={(e) =>
                      setInput({
                        ...input,
                        comment: e.target.value.substring(0, 250),
                      })
                    }
                  />
                  <p style={{ fontSize: "12px", textAlign: "right" }}>
                    {input.comment.length}/250 caracteres
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "20px",
                  }}
                >
                  <button
                    onClick={closeModal}
                    disabled={isLoading}
                    style={{
                      padding: "8px 16px",
                      border: "none",
                      backgroundColor: "#ccc",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={submitHandler}
                    disabled={!input.rating || isLoading}
                    style={{
                      padding: "8px 16px",
                      border: "none",
                      backgroundColor: "#0070f3",
                      color: "white",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    {isLoading ? "Enviando..." : "Enviar valoración"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ModalRating;
