"use client"

import { ArrowRight } from "lucide-react"

interface PhysioCallToActionProps {
  className?: string
}

export const PhysioCallToAction = ({ className = "" }: PhysioCallToActionProps) => {
  return (
    <div
      className={`bg-gradient-to-r from-[#1E40AF] via-[#3B82F6] to-[#2563EB] p-8 rounded-2xl text-white text-center shadow-lg transform transition-all hover:scale-[1.02] hover:shadow-xl ${className}`}
    >
      <div className="mb-6">
        <h3 className="font-bold text-2xl mb-3">¿Eres fisioterapeuta?</h3>
        <p className="text-white/90 mb-6">Únete a nuestra red de profesionales y amplía tu alcance</p>
      </div>
      <button
        className="px-8 py-3 bg-white text-[#2563EB] rounded-xl font-semibold hover:bg-blue-50 transition-all shadow-md flex items-center mx-auto"
        onClick={() => window.open("https://fisiofind-landing-page.netlify.app/", "_blank")}
      >
        <span>Para más información, accede aquí</span>
        <ArrowRight className="h-5 w-5 ml-2" />
      </button>
    </div>
  )
}

