"use client"

import Link from "next/link"
import { Pill, Calendar, Scan, FileText, ArrowRight, MapPin } from "lucide-react"
import { useRef, useEffect } from "react"
import { gsap } from "gsap"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import React from "react"

export default function ServiceCard({ id, title, description, icon }) {
  const cardRef = useRef(null)

  useEffect(() => {
    const card = cardRef.current

    // Hover animation
    card.addEventListener("mouseenter", () => {
      gsap.to(card, {
        y: -5,
        scale: 1.02,
        boxShadow: "0 20px 25px -5px rgba(219, 39, 119, 0.1), 0 10px 10px -5px rgba(219, 39, 119, 0.04)",
        duration: 0.2,
      })
    })

    card.addEventListener("mouseleave", () => {
      gsap.to(card, {
        y: 0,
        scale: 1,
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        duration: 0.2,
      })
    })

    return () => {
      card.removeEventListener("mouseenter", () => {})
      card.removeEventListener("mouseleave", () => {})
    }
  }, [])

  const getIcon = () => {
    // If icon is already a JSX element, return it directly
    if (React.isValidElement(icon)) {
      return React.cloneElement(icon, { size: 32 })
    }
    
    // Otherwise, handle string cases
    switch (icon) {
      case "pill":
        return <Pill size={32} />
      case "calendar":
        return <Calendar size={32} />
      case "scan":
        return <Scan size={32} />
      case "file-text":
        return <FileText size={32} />
      case "map-pin":
        return <MapPin size={32} />
      default:
        return <Pill size={32} />
    }
  }

  return (
    <Link href={`/${id}`}>
      <Card 
        ref={cardRef} 
        className="service-card h-full cursor-pointer rounded-xl border-2 border-transparent hover:border-pink-100 transition-all duration-300"
      >
        <CardHeader className="space-y-4 p-6">
          <div className="text-pink-600 bg-pink-50 w-16 h-16 rounded-2xl flex items-center justify-center">{getIcon()}</div>
          <CardTitle className="text-xl font-semibold tracking-tight">{title}</CardTitle>
          <CardDescription className="text-base leading-relaxed">{description}</CardDescription>
        </CardHeader>
        <CardFooter className="p-6 pt-0">
          <div className="flex items-center text-pink-600 font-medium group">
            <span>Learn more</span>
            <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
