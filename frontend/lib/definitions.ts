export type CalendarProps = {
  title: string;
  start: string;
  end?: string;
  allDay?: boolean;
  description?: string;
  status?: string;
  id?: string;
  service?: {
    type: string;
    duration: number;
  };
  alternatives?: Record<string, { start: string; end: string }[]>;
};

export interface Step {
  step: number;
  label: string;
}

export interface QuestionElement {
  type: string;
  label: string;
  scope: string;
}

export interface Questionary {
  type: string;
  label: string;
  elements: QuestionElement[];
}

export interface QuestionaryResponse {
  [key: string]: string; // El key es el nombre de la propiedad (desde scope) y el valor es la respuesta
}

export interface Service {
  id: string;
  title: string;
  price: number;
  description: string;
  duration: string;
  questionary: Questionary;
}

export interface AppointmentData {
  start_time: string;
  end_time: string;
  is_online: boolean;
  service: {
    type: string;
    price: number;
    duration: number;
    questionary: Questionary;
  };
  physiotherapist: number;
  status: string;
  alternatives: string;
  questionaryResponses?: QuestionaryResponse;
}

export interface PaymentMethod {
  id: string;
  name: string;
  description?: string;
  imageUrl: string;
}

export interface ScheduleInterval {
  start: string;
  end: string;
}

export interface WeeklySchedule {
  monday: ScheduleInterval[];
  tuesday: ScheduleInterval[];
  wednesday: ScheduleInterval[];
  thursday: ScheduleInterval[];
  friday: ScheduleInterval[];
  saturday: ScheduleInterval[];
  sunday: ScheduleInterval[];
}

export interface ScheduleData {
  weekly_schedule: WeeklySchedule;
}
