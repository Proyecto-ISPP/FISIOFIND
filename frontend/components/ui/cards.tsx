import { CalendarProps } from "@/lib/definitions";

const Cards = ({ events }: { events: CalendarProps[] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {events.map((event, index) => (
        <div
          key={index}
          className="bg-blue shadow-lg rounded-lg p-4 border-l-4 border-blue-500"
        >
          <h3 className="text-lg font-semibold text-gray-800">{event.title}</h3>
          <p className="text-gray-600">
            {new Date(event.start).toLocaleString()}
          </p>
          {event.end && (
            <p className="text-gray-500">
              Hasta {new Date(event.end).toLocaleString()}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default Cards;