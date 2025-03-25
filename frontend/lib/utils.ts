import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatAppointment(isoString: string): { date: string; time: string } {
  if (!isoString) return { date: "", time: "" };
  
  const date = new Date(isoString);

  return {
    date: date.toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    time: date.toISOString().split("T")[1].slice(0, 5), // Extrae la hora en formato HH:MM UTC
  };
}


export function prepareScheduleForBackend(schedule) {
  // Transformar weekly_schedule
  const weekly_schedule = Object.keys(schedule.weekly_schedule).reduce((acc, day) => {
    acc[day] = schedule.weekly_schedule[day].map((block) =>
      block.map(({ id, ...rest }) => rest)
    );
    return acc;
  }, {});

  // Transformar exceptions
  const exceptions = Object.keys(schedule.exceptions).reduce((acc, dateKey) => {
    acc[dateKey] = schedule.exceptions[dateKey].map(({ id, ...rest }) => rest);
    return acc;
  }, {});

  // Las appointments se pueden transformar de manera similar si contienen id's
  const appointments = schedule.appointments.map(({ id, ...rest }) => rest);

  return { 
    exceptions, 
    appointments, 
    weekly_schedule 
  };
};


export function formatDateFromIso(isoDate: string): string {
  const date = new Date(isoDate);

  // Formateamos la fecha en "DD-MM-YYYY HH:mm" pero en UTC
  const formattedDate = `${String(date.getUTCDate()).padStart(2, '0')}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${date.getUTCFullYear()} ${String(date.getUTCHours()).padStart(2, '0')}:${String(date.getUTCMinutes()).padStart(2, '0')}`;

  return formattedDate;
}