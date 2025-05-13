"use client"

import Link from "next/link"
import { Pill, Calendar, Scan, FileText, ArrowRight } from "lucide-react"
import { useRef, useEffect } from "react"
import { gsap } from "gsap"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function ServiceCard({ id, title, description, icon }) {
  const cardRef = useRef(null)

  useEffect(() => {
    const card = cardRef.current

    // Hover animation
    card.addEventListener("mouseenter", () => {
      gsap.to(card, {
        y: -5,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        duration: 0.2,
      })
    })

    card.addEventListener("mouseleave", () => {
      gsap.to(card, {
        y: 0,
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
    switch (icon) {
      case "pill":
        return <Pill size={32} />
      case "calendar":
        return <Calendar size={32} />
      case "scan":
        return <Scan size={32} />
      case "file-text":
        return <FileText size={32} />
      default:
        return <Pill size={32} />
    }
  }

  return (
    <Link href={`/${id}`}>
      <Card ref={cardRef} className="service-card h-full cursor-pointer">
        <CardHeader>
          <div className="text-pink-600 mb-2">{getIcon()}</div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardFooter>
          <div className="flex items-center text-pink-600 font-medium">
            <span>Learn more</span>
            <ArrowRight size={16} className="ml-1" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
