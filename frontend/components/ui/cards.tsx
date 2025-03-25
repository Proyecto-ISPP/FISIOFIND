import { CalendarProps } from "@/lib/definitions";
import { AppointmentModal} from "./appointment-modal";
import DynamicFormModal from "./dinamic-form-modal";
import { formatDateFromIso } from "@/lib/utils";

const Cards = ({
  events,
  onCardHover,
  isClient,
  token,
  currentRole,
  handleAlternativesSubmit,
  setSelectedEvent,
  selectedEvent,
  setEditionMode,
  editionMode,
}: {
  events: CalendarProps[];
  onCardHover: (eventId: string | null) => void;
  isClient: boolean;
  token: string | null;
  currentRole: string;
  handleAlternativesSubmit: (alternatives: Record<string, { start: string; end: string }[]>) => void;
  setSelectedEvent: (event: CalendarProps | null) => void;
  selectedEvent: CalendarProps | null;
  setEditionMode: (mode: boolean) => void;
  editionMode: boolean;
}) => {

  return (
    <>
      <div className="bg-slate-100 flex flex-col h-auto w-full lg:w-1/3 gap-4 p-4 pt-4">
        {events.map((event, index) => (
          <div
            key={index}
            className="bg-blue shadow-lg rounded-lg p-4 mb-4 border-l-4 border-blue-500 cursor-pointer overflow-y-auto"
            onMouseEnter={() => onCardHover(event.title)} // Aquí detectamos el hover
            onMouseLeave={() => onCardHover(null)} // Limpiamos el hover cuando el mouse sale
            onClick={() => setSelectedEvent(event)} // Seleccionamos el evento al hacer clic
          >
            <h3 className="text-lg font-semibold text-gray-800">
              {event.title}
            </h3>
            <p className="text-gray-600">
              {formatDateFromIso(event.start)}
            </p>
            {event.end && (
              <p className="text-gray-500">
                Hasta {formatDateFromIso(event.end).split(" ")[1]}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* MODAL */}
      {selectedEvent && (
        <AppointmentModal
          selectedEvent={selectedEvent}
          setSelectedEvent={setSelectedEvent}
          setEditionMode={setEditionMode}
          token={token}
          isClient={isClient}
          currentRole={currentRole}
        />
      )}
      {/* MODAL */}
      {editionMode && (
        <DynamicFormModal
          event={selectedEvent}
          onClose={() => setEditionMode(false)}
          onSubmit={handleAlternativesSubmit}
        />
      )}
    </>
  );
};

export default Cards;