"use client"

import type React from "react"

import { ArrowRight } from "lucide-react"
import { useState } from "react"

interface PhysioCallToActionAdvancedProps {
  className?: string
}

export const PhysioCallToActionAdvanced = ({ className = "" }: PhysioCallToActionAdvancedProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Track mouse position for gradient effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  return (
    <div
      className={`relative overflow-hidden p-8 rounded-2xl text-white text-center shadow-lg transition-all duration-300 ${className}`}
      style={{
        background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, #3B82F6, #1E40AF)`,
        transform: isHovered ? "scale(1.02)" : "scale(1)",
        boxShadow: isHovered
          ? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
          : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[10%] left-[10%] w-16 h-16 rounded-full bg-blue-400 opacity-20 blur-xl"></div>
        <div className="absolute bottom-[20%] right-[15%] w-20 h-20 rounded-full bg-blue-300 opacity-20 blur-xl"></div>
        <div className="absolute top-[40%] right-[10%] w-12 h-12 rounded-full bg-blue-500 opacity-20 blur-xl"></div>
      </div>

      <div className="relative z-10">
        <div className="mb-6">
          <h3 className="font-bold text-2xl mb-3">¿Eres fisioterapeuta?</h3>
          <p className="text-white/90 mb-6">Únete a nuestra red de profesionales y amplía tu alcance</p>
        </div>
        <button
          className="px-8 py-3 bg-white text-[#2563EB] rounded-xl font-semibold hover:bg-blue-50 transition-all shadow-md flex items-center mx-auto group"
          onClick={() => window.open("https://fisiofind-landing-page.netlify.app/", "_blank")}
        >
          <span>Para más información, accede aquí</span>
          <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  )
}

