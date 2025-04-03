// components/WizardHeader.tsx
"use client";
import React from "react";
import { Step } from "@/lib/definitions";
import clsx from "clsx";

interface WizardHeaderProps {
  steps: Step[];
  currentStep: number;
}

const WizardHeader: React.FC<WizardHeaderProps> = ({ steps, currentStep }) => {
  const getBgColorClass = (step: number): string => {
    if (step < currentStep) return "bg-logo2"; // paso completado
    if (step === currentStep) return "bg-azulOscuroTitulos"; // paso actual
    return "bg-navBar1"; // pasos futuros
  };

  return (
    <>
      {/* Versión Desktop: chevrons */}
      <div className="hidden lg:flex items-center space-x-2">
        {steps.map((s) => (
          <div
            key={s.step}
            className={clsx(
              "relative flex flex-col items-center justify-center text-white px-6 py-2 min-w-[160px] text-center",
              getBgColorClass(s.step)
            )}
            style={{
              clipPath:
                "polygon(85% 0%, 100% 50%, 85% 100%, 0% 100%, 15% 50%, 0% 0%)",
            }}
          >
            <div className="px-4 py-2 flex flex-col items-center justify-center min-w-44 min-h-20">
              <span className="font-semibold">Paso {s.step}</span>
              <span className="text-sm">{s.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Versión Mobile: bolitas */}
      <div className="flex lg:hidden items-center space-x-2">
        {steps.map((s) => (
          <div key={s.step} className="flex flex-col items-center">
            <div
              className={clsx(
                "w-10 h-10 rounded-full flex items-center justify-center text-white",
                getBgColorClass(s.step)
              )}
            >
              {s.step < currentStep ? "✓" : s.step}
            </div>
            <span className="text-xs mt-1 text-gray-700 text-center">
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </>
  );
};

export default WizardHeader;
