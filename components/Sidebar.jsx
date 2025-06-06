"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Pill, Calendar, Scan, FileText, ChevronRight, MapPin, Calculator } from "lucide-react"
import { gsap } from "gsap"

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false)
  const pathname = usePathname()

  const menuItems = [
    { id: "medicine-store", title: "Medicine Store", icon: Pill },
    { id: "medicine-dates", title: "Medicine Dates", icon: Calendar },
    { id: "skin-disease-classification", title: "Skin Disease", icon: Scan },
    { id: "prescription-analyzer", title: "Prescription Analyzer", icon: FileText },
    { id: "calorie-estimator", title: "Calorie Estimator", icon: Calculator },
    { id: "find-donor", title: "Find Blood Donor", icon: MapPin },
  ]

  useEffect(() => {
    // Animation for sidebar expand/collapse
    gsap.to(".sidebar", {
      width: isExpanded ? "240px" : "70px",
      duration: 0.3,
      ease: "power2.out",
    })

    gsap.to(".menu-text", {
      opacity: isExpanded ? 1 : 0,
      duration: 0.2,
      delay: isExpanded ? 0.1 : 0,
    })
  }, [isExpanded])

  return (
    <div
      className="sidebar fixed left-0 top-16 h-[calc(100vh-64px)] bg-white border-r border-gray-200 shadow-sm z-40 overflow-hidden transition-all"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      style={{ width: "70px" }}
    >
      <div className="py-6">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === `/${item.id}`
            return (
              <li key={item.id}>
                <Link
                  href={`/${item.id}`}
                  className={`flex items-center px-3 py-3 mx-2 rounded-lg transition-colors ${
                    isActive ? "bg-pink-100 text-pink-600" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <item.icon size={24} className="min-w-[24px]" />
                  <span className="menu-text ml-3 whitespace-nowrap" style={{ opacity: 0 }}>
                    {item.title}
                  </span>
                  {isActive && <ChevronRight size={16} className="ml-auto menu-text" style={{ opacity: 0 }} />}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
