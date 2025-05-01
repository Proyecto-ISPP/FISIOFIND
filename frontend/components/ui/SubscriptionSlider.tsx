"use client";
import { getApiBaseUrl } from "@/utils/api";
import axios from "axios";
import { useState, useEffect } from "react";

function SubscriptionSlider() {
  const [isSubscribed, setIsSubscribed] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios(`${getApiBaseUrl()}/api/app_user/subscription/status/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.data)
      .then((data) => {
        setIsSubscribed(data.subscription_status);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching subscription status:", error);
        setLoading(false);
      });
  }, []);

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSubscriptionStatus = event.target.checked;

    // Llamada a la API para actualizar la suscripción en la base de datos
    fetch(`${getApiBaseUrl()}/api/app_user/subscription/update/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ is_subscribed: newSubscriptionStatus }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setIsSubscribed(newSubscriptionStatus);
        }
      })
      .catch((error) => {
        console.error("Error updating subscription:", error);
      });
  };

  if (loading)
    return (
      <div className="flex justify-center items-center p-6">
        <div className="text-xl font-semibold text-gray-600 animate-pulse">
          Cargando...
        </div>
      </div>
    );

  return (
    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-700">
          Actualmente estás{" "}
          <span
            className={`text-base font-semibold ${
              isSubscribed ? "text-green-600" : "text-red-600"
            }`}
          >
            {isSubscribed ? "suscrito" : "no suscrito"}
          </span>
          .
        </p>

        <div className="flex items-center gap-2">
          {" "}
          {/* Reduced gap */}
          <label className="inline-flex items-center cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only"
                checked={isSubscribed ?? false}
                onChange={handleSliderChange}
              />
              <div
                className={`block w-12 h-6 rounded-full transition-colors duration-300 ease-in-out ${
                  /* Smaller track */
                  isSubscribed ? "bg-logo2" : "bg-gray-300"
                }`}
              ></div>
              <div
                className={`absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition-transform duration-300 ease-in-out ${
                  /* Smaller thumb */
                  isSubscribed ? "transform translate-x-6" : ""
                }`}
              ></div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}

export default SubscriptionSlider;
