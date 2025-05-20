"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import RestrictedAccess from "@/components/RestrictedAccess";
import { getApiBaseUrl } from "@/utils/api";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, LineElement, PointElement } from "chart.js";
import { Pie, Line } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, LineElement, PointElement);

interface Payment {
  id: number;
  appointment_id: number;
  patient_name: string;
  amount: number;
  status: string;
  payment_date?: string;
  payment_deadline?: string;
  appointment_date: string;
}

interface Appointment {
  id: number;
  start_time: string;
  end_time: string;
  is_online: boolean;
  service: { type: string; duration: number };
  patient: number;
  physiotherapist: number;
  patient_name: string;
  physiotherapist_name: string;
  status: string;
  alternatives: null | any;
}

interface MonthlyStats {
  month: string;
  total_earnings: number;
  appointment_count: number;
}

interface OverallStats {
  total_earned: number;
  total_pending: number;
  total_appointments: number;
  payment_rate: number;
}

const status = {
  finished: "Finalizada",
  confirmed: "Confirmada",
  canceled: "Cancelada",
  booked: "Reservada",
  pending: "Pendiente"
};

const PaymentHistoryPage = () => {
  const router = useRouter();
  const [payments, setPayments] = useState<{
    not_paid_payments: Payment[];
    paid_payments: Payment[];
    redeemed_payments: Payment[];
    monthly_stats: MonthlyStats[];
    overall_stats: OverallStats;
  }>({
    not_paid_payments: [],
    paid_payments: [],
    redeemed_payments: [],
    monthly_stats: [],
    overall_stats: { total_earned: 0, total_pending: 0, total_appointments: 0, payment_rate: 0 },
  });
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [iban, setIban] = useState("");
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const hasRedeemedPayments = payments.redeemed_payments.some(payment => payment.status === "Redeemed");

  useEffect(() => {
    setToken(localStorage.getItem("token"));

    if (token) {
      fetch(`${getApiBaseUrl()}/api/app_user/check-role/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) throw new Error("Error fetching user role");
          return response.json();
        })
        .then((data) => setUserRole(data.user_role))
        .catch((error) => {
          console.error("Error fetching user role:", error);
          setUserRole(null);
        });
    }
  }, [token]);

  useEffect(() => {
    if (!token || userRole !== "physiotherapist") {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        const paymentsResponse = await fetch(`${getApiBaseUrl()}/api/payments/invoices/physio/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!paymentsResponse.ok) throw new Error("Error al obtener el historial de pagos");
        const paymentsData = await paymentsResponse.json();
        setPayments(paymentsData);

        const appointmentsResponse = await fetch(`${getApiBaseUrl()}/api/appointment/physio/list/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!appointmentsResponse.ok) throw new Error("Error al obtener las citas");
        const appointmentsData = await appointmentsResponse.json();
        setAppointments(appointmentsData.results);

      } catch (error) {
        setError("No se pudieron cargar los datos. Inténtalo de nuevo.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, userRole]);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleCollectMoney = () => {
    setIsModalOpen(true);
  };

  const handleSubmitIban = async () => {
    if (!iban) {
      setError("Por favor, introduce un IBAN válido");
      return;
    }

    try {
      const response = await fetch(`${getApiBaseUrl()}/api/payments/collect/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ iban: iban }),
      });

      if (!response.ok) {
        if (response.status === 400) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Error al procesar el cobro");
        }
        throw new Error("Error al procesar el cobro");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `factura_pagos_${new Date().toISOString().replace(/[:.]/g, "")}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      setPayments((prev) => ({
        ...prev,
        paid_payments: [],
        redeemed_payments: [
          ...prev.redeemed_payments,
          ...prev.paid_payments.map((p) => ({
            ...p,
            status: "Redeemed",
            payment_date: new Date().toISOString(),
          })),
        ],
        overall_stats: {
          ...prev.overall_stats,
          total_earned: prev.overall_stats.total_earned + prev.overall_stats.total_pending,
          total_pending: 0,
        },
      }));
      setIsModalOpen(false);
      setIban("");
      setError(null);

    } catch (err) {
      setError(err.message || "Error al procesar el cobro. Inténtalo de nuevo.");
      console.error(err);
    }
  };

  const getAppointmentDetails = (appointmentId: number | undefined) => {
    if (!appointmentId) {
      console.log("appointment_id es undefined");
      return null;
    }
    const appointment = appointments.find((appointment) => appointment.id === appointmentId);
    return appointment || null;
  };

  // Datos para los gráficos
  const pieData = {
    labels: ["Dinero Cobrado", "Dinero Pendiente"],
    datasets: [
      {
        data: [payments.overall_stats.total_earned, payments.overall_stats.total_pending],
        backgroundColor: ["#36A2EB", "#FF6384"],
      },
    ],
  };

  const pieOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.raw} €`,
        },
      },
    },
  };

  const lineData = {
    labels: payments.monthly_stats.map(stat => stat.month),
    datasets: [{
      label: "Ingresos Mensuales",
      data: payments.monthly_stats.map(stat => stat.total_earnings),
      fill: false,
      borderColor: "#36A2EB",
      tension: 0.3,
    }],
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!token) return <RestrictedAccess message="Necesitas iniciar sesión para acceder al historial de pagos." />;
  if (userRole !== "physiotherapist") return <RestrictedAccess message="Esta sección está reservada para fisioterapeutas." />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Historial de Pagos</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Resumen Financiero</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg">
            <p className="text-gray-600">Total Cobrado</p>
            <p className="text-xl font-bold text-green-500">{payments.overall_stats.total_earned.toFixed(2)} €</p>
          </div>
          <div className="p-4 border rounded-lg relative">
            <p className="text-gray-600">Pendiente por Cobrar</p>
            <p className="text-xl font-bold text-red-500">{payments.overall_stats.total_pending.toFixed(2)} €</p>
            {payments.paid_payments.length > 0 && !hasRedeemedPayments && (
              <button
                onClick={handleCollectMoney}
                className="absolute top-2 right-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
              >
                Cobrar Dinero
              </button>
            )}
          </div>
          <div className="p-4 border rounded-lg">
            <p className="text-gray-600">Citas Totales</p>
            <p className="text-xl font-bold">{payments.overall_stats.total_appointments}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Estadísticas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Ingresos Mensuales</h3>
            <div className="h-64">
              <Line 
                data={lineData}
                options={{
                  maintainAspectRatio: false,
                  scales: {
                    y: { beginAtZero: true }
                  }
                }}
              />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Estado de Pagos</h3>
            <div className="h-48">
              <Pie 
                data={pieData}
                options={pieOptions}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Historial de Pagos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* No Pagados */}
          <div>
            <button
              onClick={() => toggleSection('not_paid')}
              className="w-full text-left text-lg font-medium mb-2 flex justify-between items-center"
            >
              <span>No Pagados ({payments.not_paid_payments.length})</span>
              <span>{expandedSection === 'not_paid' ? '▲' : '▼'}</span>
            </button>
            {expandedSection === 'not_paid' && (
              payments.not_paid_payments.length === 0 ? (
                <p className="text-gray-500">No hay pagos pendientes de recibir.</p>
              ) : (
                <ul className="space-y-4">
                  {payments.not_paid_payments.map((payment) => {
                    const appointment = getAppointmentDetails(payment.appointment_id);
                    return (
                      <li key={payment.id} className="p-4 border rounded-lg">
                        <p><strong>Precio:</strong> {payment.amount} €</p>
                        <p><strong>Estado:</strong> No Pagado</p>
                        <p><strong>Fecha límite:</strong> {new Date(payment.payment_deadline!).toLocaleDateString("es-ES")}</p>
                        {appointment ? (
                          <div className="mt-2 p-2 bg-gray-100 rounded">
                            <h4 className="font-semibold">Detalles de la Cita:</h4>
                            <p><strong>Fecha:</strong> {new Date(appointment.start_time).toLocaleDateString("es-ES")}</p>
                            <p><strong>Paciente:</strong> {appointment.patient_name}</p>
                            <p><strong>Estado de la cita:</strong> {appointment.status ? status[appointment.status.toLocaleLowerCase()] : "Sin estado"}</p>
                            <p><strong>Tipo de servicio:</strong> {appointment.service.type}</p>
                            <p><strong>Duración:</strong> {appointment.service.duration} min</p>
                          </div>
                        ) : (
                          <p className="mt-2 text-gray-500">Cita no encontrada</p>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )
            )}
          </div>

          {/* Pagados */}
          <div>
            <button
              onClick={() => toggleSection('paid')}
              className="w-full text-left text-lg font-medium mb-2 flex justify-between items-center"
            >
              <span>Pagados ({payments.paid_payments.length})</span>
              <span>{expandedSection === 'paid' ? '▲' : '▼'}</span>
            </button>
            {expandedSection === 'paid' && (
              payments.paid_payments.length === 0 ? (
                <p className="text-gray-500">No hay pagos pendientes de reclamar.</p>
              ) : (
                <ul className="space-y-4">
                  {payments.paid_payments.map((payment) => {
                    const appointment = getAppointmentDetails(payment.appointment_id);
                    return (
                      <li key={payment.id} className="p-4 border rounded-lg">
                        <p><strong>Precio:</strong> {payment.amount} €</p>
                        <p><strong>Estado:</strong> Pagado</p>
                        <p><strong>Fecha de pago:</strong> {new Date(payment.payment_date!).toLocaleDateString("es-ES")}</p>
                        {appointment ? (
                          <div className="mt-2 p-2 bg-gray-100 rounded">
                            <h4 className="font-semibold">Detalles de la Cita:</h4>
                            <p><strong>Fecha:</strong> {new Date(appointment.start_time).toLocaleDateString("es-ES")}</p>
                            <p><strong>Paciente:</strong> {appointment.patient_name}</p>
                            <p><strong>Estado de la cita:</strong> {appointment.status ? status[appointment.status.toLocaleLowerCase()] : "Sin estado"}</p>
                            <p><strong>Tipo de servicio:</strong> {appointment.service.type}</p>
                            <p><strong>Duración:</strong> {appointment.service.duration} min</p>
                          </div>
                        ) : (
                          <p className="mt-2 text-gray-500">Cita no encontrada</p>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )
            )}
          </div>

          {/* Cobrados */}
          <div>
            <button
              onClick={() => toggleSection('redeemed')}
              className="w-full text-left text-lg font-medium mb-2 flex justify-between items-center"
            >
              <span>Cobrados ({payments.redeemed_payments.length})</span>
              <span>{expandedSection === 'redeemed' ? '▲' : '▼'}</span>
            </button>
            {expandedSection === 'redeemed' && (
              payments.redeemed_payments.length === 0 ? (
                <p className="text-gray-500">No hay pagos cobrados.</p>
              ) : (
                <ul className="space-y-4">
                  {payments.redeemed_payments.map((payment) => {
                    const appointment = getAppointmentDetails(payment.appointment_id);
                    return (
                      <li key={payment.id} className="p-4 border rounded-lg">
                        <p><strong>Precio:</strong> {payment.amount} €</p>
                        <p><strong>Estado:</strong> Cobrado</p>
                        <p><strong>Fecha de cobro:</strong> {new Date(payment.payment_date!).toLocaleDateString("es-ES")}</p>
                        {appointment ? (
                          <div className="mt-2 p-2 bg-gray-100 rounded">
                            <h4 className="font-semibold">Detalles de la Cita:</h4>
                            <p><strong>Fecha:</strong> {new Date(appointment.start_time).toLocaleDateString("es-ES")}</p>
                            <p><strong>Paciente:</strong> {appointment.patient_name}</p>
                            <p><strong>Estado de la cita:</strong> {appointment.status ? status[appointment.status.toLocaleLowerCase()] : "Sin estado"}</p>
                            <p><strong>Tipo de servicio:</strong> {appointment.service.type}</p>
                            <p><strong>Duración:</strong> {appointment.service.duration} min</p>
                          </div>
                        ) : (
                          <p className="mt-2 text-gray-500">Cita no encontrada</p>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )
            )}
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h3 className="text-lg font-semibold mb-4">Introducir IBAN</h3>
              <input
                type="text"
                value={iban}
                onChange={(e) => setIban(e.target.value)}
                placeholder="ESXX XXXX XXXX XXXX XXXX XXXX"
                className="w-full p-2 border rounded mb-4"
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmitIban}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistoryPage;