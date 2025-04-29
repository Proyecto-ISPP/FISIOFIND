import { useState } from "react";

type Alternative = {
  start: string;
  end: string;
};

type AlternativesData = {
  [date: string]: Alternative[];
};

interface AlternativeSelectorProps {
  alternatives: AlternativesData;
  onConfirmSelection: (date: string, startTime: string) => void;
}

const AlternativeSelector: React.FC<AlternativeSelectorProps> = ({ alternatives, onConfirmSelection }) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      onConfirmSelection(selectedDate, selectedTime);
    } else {
      alert("Por favor, selecciona una fecha y un horario.");
    }
  };

  return (
    <div className="p-4 bg-white shadow-lg rounded-lg w-[300px] flex flex-col items-center justify-center">
      {/* Selección de fecha */}
      <select
        className="w-full p-2 border rounded"
        onChange={(e) => {
          setSelectedDate(e.target.value);
          setSelectedTime(null);
        }}
      >
        <option value="">Selecciona una fecha</option>
        {Object.keys(alternatives).map((date) => (
          <option key={date} value={date}>
            {date}
          </option>
        ))}
      </select>

      {/* Selección de intervalo de tiempo */}
      {selectedDate && (
        <select
          className="w-full p-2 border rounded mt-2"
          onChange={(e) => setSelectedTime(e.target.value)}
        >
          <option value="">Selecciona un horario</option>
          {alternatives[selectedDate].map((alt, index) => (
            <option key={index} value={`${alt.start} - ${alt.end}`}>
              {alt.start} - {alt.end}
            </option>
          ))}
        </select>
      )}

      {/* Mostrar selección */}
      {selectedDate && selectedTime && (
        <div className="mt-4 p-2 bg-gray-100 rounded">
          <p>
            <strong>Fecha:</strong> {selectedDate}
          </p>
          <p>
            <strong>Horario:</strong> {selectedTime}
          </p>
        </div>
      )}

      {/* Botón de confirmación */}
      <button
        className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        onClick={handleConfirm}
      >
        Confirmar selección
      </button>
    </div>
  );
};

export default AlternativeSelector;
