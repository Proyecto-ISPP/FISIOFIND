// src/context/appointmentContext.tsx
"use client";
import React, { createContext, useReducer, useContext } from "react";
import { AppointmentData, QuestionaryResponse } from "@/lib/definitions";
import { QuestionElement } from "@/lib/definitions";

type State = {
  appointmentData: AppointmentData;
};

type Action =
  | {
    type: "SELECT_SERVICE";
    payload: {
      service: { type: string; price: number; duration: number, questionary: { type: string; label: string; elements: QuestionElement[] } };
      physiotherapist: number;
    }
  }
  | { type: "DESELECT_SERVICE" }
  | { type: "SELECT_PAYMENT_METHOD"; payload: string }
  | { type: "SELECT_SLOT"; payload: { start_time: string; end_time: string; is_online: boolean } }
  | { type: 'UPDATE_QUESTIONARY_RESPONSES'; payload: QuestionaryResponse }

const initialState: State = {
  appointmentData: {
    start_time: "",
    end_time: "",
    is_online: false,
    service: { type: "", price: 0, duration: 0, questionary: { type: "", label: "", elements: [] } },
    physiotherapist: 0,
    status: "",
    alternatives: "",
    questionaryResponses: {} // Inicializar como objeto vacío

  },
};

const AppointmentContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

const appointmentReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SELECT_SERVICE":
      return {
        ...state,
        appointmentData: {
          ...state.appointmentData,
          service: action.payload.service,
          physiotherapist: action.payload.physiotherapist,
          // Se limpian los valores de slot si se selecciona un nuevo servicio
          start_time: "",
          end_time: "",
        },
      };
    case "DESELECT_SERVICE":
      return {
        ...state,
        appointmentData: {
          start_time: "",
          end_time: "",
          is_online: false,
          service: { type: "", price: 0, duration: 0, questionary: { type: "", label: "", elements: [] } },
          physiotherapist: 0,
          status: "",
          alternatives: "",
        },
      };
    case "SELECT_PAYMENT_METHOD":
      return {
        ...state,
        appointmentData: {
          ...state.appointmentData,
          alternatives: action.payload,
        },
      };
    case "SELECT_SLOT":
      return {
        ...state,
        appointmentData: {
          ...state.appointmentData,
          start_time: action.payload.start_time,
          end_time: action.payload.end_time,
          is_online: action.payload.is_online,
          status: "pending",
        },
      };
      case 'UPDATE_QUESTIONARY_RESPONSES':
        return {
          ...state,
          appointmentData: {
            ...state.appointmentData,
            questionaryResponses: action.payload
          }
        };
    default:
      return state;
  }
};

export const AppointmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appointmentReducer, initialState);
  return (
    <AppointmentContext.Provider value={{ state, dispatch }}>
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointment = () => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error("useAppointment must be used within an AppointmentProvider");
  }
  return context;
};


