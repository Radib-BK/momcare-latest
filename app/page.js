"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import ServiceCard from "@/components/ServiceCard"
import { gsap } from "gsap"
import { Button } from "@/components/ui/button"

export default function Home() {
  const heroRef = useRef(null)
  const cardsRef = useRef(null)

  useEffect(() => {
    // Hero section animation
    gsap.fromTo(
      heroRef.current.querySelectorAll(".gsap-reveal"),
      {
        y: 50,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        stagger: 0.2,
        duration: 1,
        ease: "power3.out",
      },
    )

    // Service cards animation
    gsap.fromTo(
      cardsRef.current.querySelectorAll(".service-card"),
      {
        y: 50,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        stagger: 0.15,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.5,
      },
    )
  }, [])

  const services = [
    {
      id: "medicine-store",
      title: "Medicine Store",
      description: "Find and order pregnancy-safe medications with ease.",
      icon: "pill",
    },
    {
      id: "medicine-dates",
      title: "Medicine Dates",
      description: "Track expiry dates of your medications and supplements.",
      icon: "calendar",
    },
    {
      id: "skin-disease-classification",
      title: "Skin Disease Classification",
      description: "Identify common skin conditions during pregnancy.",
      icon: "scan",
    },
    {
      id: "prescription-analyzer",
      title: "Prescription Analyzer",
      description: "Understand your prescriptions and medication instructions.",
      icon: "file-text",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section ref={heroRef} className="container mx-auto px-4 py-12 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold text-deep-pink mb-6 gsap-reveal">Welcome to MomCare</h1>
          <p className="text-lg mb-4 max-w-lg gsap-reveal">
            Your smart companion during pregnancy. Get expert help, track medications, and analyze prescriptions with
            ease.
          </p>
          <p className="text-gray-600 mb-8 max-w-lg gsap-reveal">
            MomCare provides essential tools for expectant mothers to manage their health journey. From tracking
            medication expiry dates to analyzing prescriptions and identifying skin conditions, we're here to support
            you every step of the way.
          </p>
          <Button asChild className="gsap-reveal bg-pink-600 hover:bg-pink-700">
            <Link href="/about">Read More</Link>
          </Button>
        </div>
        <div className="md:w-1/2 flex justify-center gsap-reveal">
          <Image
            src="/placeholder.svg?height=400&width=400"
            alt="Pregnancy Illustration"
            width={400}
            height={400}
            className="max-w-full h-auto"
            priority
          />
        </div>
      </section>

      {/* Services Section */}
      <section ref={cardsRef} className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-deep-pink mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                id={service.id}
                title={service.title}
                description={service.description}
                icon={service.icon}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
