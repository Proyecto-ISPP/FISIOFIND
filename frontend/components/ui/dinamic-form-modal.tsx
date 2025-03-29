import Image from "next/image";
import { useEffect, useState } from "react";

interface DynamicFormModalProps {
  event: any;
  onClose: () => void;
  onSubmit: (
    alternatives: Record<string, { start: string; end: string }[]>
  ) => void;
  schedule: {
    exceptions: Record<string, { start: string; end: string }[]>;
    appointments: Array<{
      status: string;
      start_time: string;
      end_time: string;
    }>;
    weekly_schedule: Record<string, { start: string; end: string }[]>;
  }
};


const addMinutesToTime = (start: string, duration: string): string => {
  const [hours, minutes] = start.split(":").map(Number);
  const date = new Date();
  const int_duration = Number(duration);
  date.setHours(hours);
  date.setMinutes(minutes + int_duration);
  return date.toTimeString().slice(0, 5);
};

const DynamicFormModal = ({
  event,
  onClose,
  onSubmit,
  schedule
}: DynamicFormModalProps) => {
  const [alternatives, setAlternatives] = useState<
    Record<string, { start: string; end: string }[]>
  >({});

  // Función para obtener la fecha mínima y máxima
  const getDateRange = () => {
    const today = new Date();
    const minDate = today.toISOString().slice(0, 10); // Hoy

    const maxDate = new Date(today);
    maxDate.setFullYear(maxDate.getFullYear() + 1); // Un año después
    const maxDateString = maxDate.toISOString().slice(0, 10);

    return { minDate, maxDate: maxDateString };
  };

  // Función para obtener las horas ocupadas para una fecha específica
  const getOccupiedHours = (date: string) => {
    const occupiedHours: { start: string; end: string }[] = [];

    // Añadir excepciones para la fecha
    if (schedule.exceptions[date]) {
      occupiedHours.push(...schedule.exceptions[date]);
    }

    // Añadir citas para la fecha
    schedule.appointments.forEach(appointment => {
      const appointmentDate = appointment.start_time.slice(0, 10);
      if (appointmentDate === date) {
        occupiedHours.push({
          start: appointment.start_time.slice(11, 16),
          end: appointment.end_time.slice(11, 16)
        });
      }
    });

    return occupiedHours;
  };

  // Función para generar opciones de hora disponibles
  const getAvailableTimeSlots = (date: string) => {
    const occupiedHours = getOccupiedHours(date) || [];
    const allTimeSlots = Array.from({ length: 48 }, (_, i) => {
      const hour = String(Math.floor(i / 2)).padStart(2, "0");
      const minutes = i % 2 === 0 ? "00" : "30";
      return `${hour}:${minutes}`;
    }).filter(slot => {
      // Filtrar solo horas entre 6:00 y 21:00
      const [hours] = slot.split(':').map(Number);
      return hours >= 6 && hours <= 21;
    });

    // Filtrar slots ocupados
    return allTimeSlots.filter(slot => {
      const slotEnd = addMinutesToTime(slot, event.service.duration);
      return !occupiedHours.some(occupied =>
        (slot >= occupied.start && slot < occupied.end) ||
        (slotEnd > occupied.start && slotEnd <= occupied.end) ||
        (slot <= occupied.start && slotEnd >= occupied.end)
      );
    });
  };

  useEffect(() => {
    const { minDate } = getDateRange();
    const availableTimeSlots = getAvailableTimeSlots(minDate);

    setAlternatives({
      [minDate]: [
        {
          start: availableTimeSlots[0],
          end: addMinutesToTime(availableTimeSlots[0], event.service.duration),
        },
      ],
    });
  }, [event.service.duration, schedule]);

  const addAlternative = () => {
    const { minDate } = getDateRange();
    setAlternatives((prev) => {
      const lastSlot = prev[minDate]?.[prev[minDate].length - 1];
      const availableTimeSlots = getAvailableTimeSlots(minDate);

      // Encontrar el siguiente slot disponible después del último slot
      const nextSlotIndex = lastSlot
        ? availableTimeSlots.findIndex(slot => slot > lastSlot.end)
        : 0;

      const start = availableTimeSlots[nextSlotIndex] || availableTimeSlots[0];
      const end = addMinutesToTime(start, event.service.duration);

      return {
        ...prev,
        [minDate]: [
          ...(prev[minDate] || []),
          { start, end },
        ],
      };
    });
  };

  const updateAlternative = (date: string, index: number, start: string) => {
    const availableTimeSlots = getAvailableTimeSlots(date);

    // Verificar si el nuevo inicio está disponible
    const end = addMinutesToTime(start, event.service.duration);
    const isTimeAvailable = availableTimeSlots.includes(start) &&
      !getOccupiedHours(date).some(occupied =>
        (start >= occupied.start && start < occupied.end) ||
        (end > occupied.start && end <= occupied.end)
      );

    if (isTimeAvailable) {
      const updated = [...(alternatives[date] || [])];
      updated[index] = { start, end };
      setAlternatives((prev) => ({ ...prev, [date]: updated }));
    }
  };

  const removeAlternative = (date: string, index: number) => {
    const updated = (alternatives[date] || []).filter((_, i) => i !== index);
    setAlternatives((prev) => {
      const newState = { ...prev, [date]: updated };
      if (updated.length === 0) delete newState[date];
      return newState;
    });
  };

  return (
    <div
      className="z-[9999] fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-gray-300 p-1 rounded-2xl shadow-2xl w-[400px] relative z-[9999]"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="text-white text-xl font-bold text-center py-5 rounded-t-xl bg-[#d88c02]">
          Modificar fechas de la cita{" "}
        </h2>
        <div className="bg-gray-100 p-4 rounded-b-xl text-center">
          {" "}
          <div>
            {Object.entries(alternatives).map(([date, slots]) =>
              slots.map((slot, index) => {
                const { minDate, maxDate } = getDateRange();
                const availableTimeSlots = getAvailableTimeSlots(date);

                return (
                  <div
                    key={`${date}-${index}`}
                    className="flex items-center mb-2"
                  >
                    <input
                      type="date"
                      value={date}
                      min={minDate}
                      max={maxDate}
                      onChange={(e) => {
                        const newDate = e.target.value;
                        const availableTimeSlotsNewDate = getAvailableTimeSlots(newDate);

                        setAlternatives((prev) => {
                          const updated = { ...prev };
                          const movingSlot = updated[date]?.[index];
                          if (!movingSlot) return prev;

                          updated[date] = updated[date].filter(
                            (_, i) => i !== index
                          );

                          if (updated[date].length === 0) {
                            delete updated[date];
                          }

                          // Usar el primer slot disponible en la nueva fecha
                          const newStart = availableTimeSlotsNewDate[0];
                          const newEnd = addMinutesToTime(newStart, event.service.duration);

                          updated[newDate] = [
                            ...(updated[newDate] || []),
                            { start: newStart, end: newEnd },
                          ];

                          return updated;
                        });
                      }}
                      className="border p-2 rounded-md"
                    />
                    <select
                      value={slot.start}
                      onChange={(e) =>
                        updateAlternative(date, index, e.target.value)
                      }
                      className="border p-2 rounded-md ml-2"
                    >
                      {availableTimeSlots.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>

                    <span className="ml-2 text-gray-600 font-medium"> - &nbsp;{slot.end}</span>

                    {index > 0 && <button
                      onClick={() => removeAlternative(date, index)}
                      className="ml-3 text-red-500 text-[20px] absolute right-6"
                    >
                      X
                    </button>}
                  </div>
                );
              })
            )}
          </div>
          <hr className="mt-6 mb-2 border-gray-300" />

          <button
            onClick={addAlternative}
            className="p-2 my-4 bg-green-500 text-white rounded-xl hover:bg-green-600"
          >
            Añadir alternativa
          </button>
          <div className="mt-4 flex justify-between">
            <button
              onClick={() => onSubmit(alternatives)}
              className="mt-4 bg-[#05668D] text-white px-4 py-2 rounded-xl hover:bg-blue-600"
            >
              Proponer fechas
            </button>
            <button
              onClick={onClose}
              className="mt-4 bg-[#05668D] text-white px-4 py-2 rounded-xl hover:bg-blue-600"
            >
              Atrás
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicFormModal;