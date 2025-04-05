import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { DateTime } from 'luxon';

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
      timeZone: "Europe/Madrid",
    }),
    time: date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Europe/Madrid",
    }),
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
   const dt = DateTime.fromISO(isoDate, {
    zone: "Europe/Madrid",
  });

  return dt.toFormat('dd-MM-yyyy HH:mm');
}