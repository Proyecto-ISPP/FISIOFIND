import axios from "axios";
import { CalendarProps } from "@/lib/definitions";
import Image from "next/image";
import AlternativeSelector from "./alternative-selector";
import { getApiBaseUrl } from "@/utils/api";

interface AppointmentModalProps {
  selectedEvent: CalendarProps | null;
  currentRole: string;
  setSelectedEvent: (event: CalendarProps | null) => void;
  setEditionMode: (mode: boolean) => void;
  isClient: boolean;
  token: string | null;
}

const AppointmentModal: React.FC<AppointmentModalProps> = ({
  selectedEvent,
  currentRole,
  setSelectedEvent,
  setEditionMode,
  isClient,
  token,
}) => {
  if (!selectedEvent) return null;
  const deleteEvent = (selectedEvent: CalendarProps | null) => {
    if (!selectedEvent) return;
    if (isClient) {
      if (token) {
        axios
          .delete(
            `${getApiBaseUrl()}/api/appointment/delete/${selectedEvent.id}/`,
            {
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          )
          .then((response) => {
            const status = response.status;
            if (status == 204) {
              alert("La cita fue cancelada correctamente.");
              setSelectedEvent(null);
              window.location.reload();
            }
          })
          .catch((error) => {
            if (error.response) {
              const msg = error.response.data.error;
              alert(msg);
            }
          });
      }
    }
  };

  const handleSelection = (date: string, startTime: string) => {
    const [startTimeSplit, endTimeSplit] = startTime.split(" - "); // Tomamos solo la hora de inicio
    const startDateTime = new Date(
      `${date}T${startTimeSplit}:00Z`
    ).toISOString(); // Generamos la fecha completa en formato UTC
    const endDateTime = new Date(`${date}T${endTimeSplit}:00Z`).toISOString(); // Generamos la fecha completa en formato UTC

    console.log("Seleccion confirmada:", { startDateTime, endDateTime });
    alert(`Seleccionaste: ${startDateTime} - ${endDateTime}`);

    axios
      .put(
        `${getApiBaseUrl()}/api/appointment/update/${selectedEvent?.id}/`,
        {
          start_time: startDateTime,
          end_time: endDateTime,
          status: "confirmed",
          alternatives: selectedEvent?.alternatives,
        },
        {
          headers: {
            Authorization: "Bearer " + token, // Envía el JWT en la cabecera de la petición
          },
        }
      )
      .then((response) => {
        // Si la respuesta fue exitosa
        alert("La cita se actualizó correctamente.");
        console.log("Cita actualizada correctamente", response);
        setSelectedEvent(null);
        window.location.reload();
      })
      .catch((error) => {
        // Si hubo un error en la solicitud
        console.error("Error en la actualización de la cita:", error);
        alert("Hubo un problema con la conexión. Intenta nuevamente.");
      });
  };

  const confirmAppointment = () => {
    if (!selectedEvent || !token) return;

    axios
      .put(
        `${getApiBaseUrl()}/api/appointment/update/${
          selectedEvent.id
        }/confirm/`,
        {
          status: "confirmed",
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((response) => {
        const message = response.data.message;
        alert(message);
        setSelectedEvent(null);
        window.location.reload();
      })
      .catch((error) => {
        if (error.response) {
          const msg = error.response.data.error;
          alert(msg);
        }
      });
  };

  const isFutureAndTwoDaysAhead = () => {
    const eventStart = new Date(selectedEvent?.start);
    const now = new Date();
    const diffInMs = eventStart.getTime() - now.getTime();
    const diffInDays = diffInMs / (1000 * 3600 * 24);
    return diffInDays >= 2;
  };

  return (
    <div
      className="z-10 fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      onClick={() => setSelectedEvent(null)}
    >
      <div
        className="bg-gray-300 p-1 rounded-2xl shadow-2xl w-[400px] relative z-50"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 bg-gray-300 p-1 rounded-full"
          onClick={() => setSelectedEvent(null)}
        >
          <Image src="/static/close.svg" alt="Cerrar" width={18} height={18} />
        </button>{" "}
        <h2 className="text-white text-xl font-bold text-center py-5 rounded-t-xl bg-[#05668D]">
          {selectedEvent.title}
        </h2>
        <div className="bg-gray-100 p-4 rounded-b-xl">
          <p className="text-gray-600 mt-2">
            <strong>Inicio:</strong>{" "}
            {new Date(selectedEvent.start).toLocaleString()}
          </p>
          {selectedEvent.end && (
            <p className="text-gray-600">
              <strong>Fin:</strong>{" "}
              {new Date(selectedEvent.end).toLocaleString()}
            </p>
          )}
          <p className="mt-2">{selectedEvent.description}</p>
          {selectedEvent.alternatives && currentRole == "patient" && (
            <div className="flex justify-center items-center">
              <AlternativeSelector
                alternatives={selectedEvent.alternatives}
                onConfirmSelection={handleSelection}
              />
            </div>
          )}
          {selectedEvent.status != "finished" && (
            <div
              className="flex flex-row mt-4"
              style={{ justifyContent: "space-between" }}
            >
              {currentRole == "physiotherapist" &&
                selectedEvent.status === "booked" &&
                isFutureAndTwoDaysAhead() && (
                  <button
                    className="mt-4 bg-[#05668D] text-white px-4 py-2 rounded-xl hover:bg-blue-600"
                    onClick={confirmAppointment}
                  >
                    Confirmar cita
                  </button>
                )}
              {currentRole == "physiotherapist" && (
                <button
                  className="mt-4 bg-[#05668D] text-white px-4 py-2 rounded-xl hover:bg-blue-600"
                  onClick={() => setEditionMode(true)}
                >
                  Modificar cita
                </button>
              )}
              {selectedEvent && new Date(selectedEvent.start) > new Date() && (
                <button
                  className="mt-4 bg-[#05668D] text-white px-4 py-2 rounded-xl hover:bg-blue-600"
                  onClick={() => deleteEvent(selectedEvent)}
                >
                  Cancelar cita
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { AppointmentModal };
