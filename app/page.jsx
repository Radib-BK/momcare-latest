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
    const ctx = gsap.context(() => {
      // Hero section animation
      gsap.fromTo(
        ".hero-animate",
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
        }
      )

      // Service cards animation
      gsap.fromTo(
        ".service-card",
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
        }
      )
    }, heroRef)

    return () => ctx.revert()
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
    <div className="flex flex-col min-h-screen" ref={heroRef}>
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-12 md:mb-0 md:pr-12">
          <h1 className="hero-animate text-5xl md:text-6xl font-bold text-deep-pink mb-8 leading-tight">
            Welcome to <span className="font-serif italic">MomCare</span>
          </h1>
          <p className="hero-animate text-xl mb-6 max-w-lg text-gray-700 leading-relaxed">
            Your smart companion during pregnancy. Get expert help, track medications, and analyze prescriptions with
            ease.
          </p>
          <p className="hero-animate text-lg mb-10 max-w-lg text-gray-600 leading-relaxed">
            MomCare provides essential tools for expectant mothers to manage their health journey. From tracking
            medication expiry dates to analyzing prescriptions and identifying skin conditions, we're here to support
            you every step of the way.
          </p>
          <Button 
            asChild 
            className="hero-animate text-white bg-pink-600 hover:bg-pink-700 rounded-full text-lg px-8 py-4 h-auto font-medium transition-all duration-300 hover:shadow-lg hover:shadow-pink-200"
          >
            <Link href="/about">Read More</Link>
          </Button>
        </div>
        <div className="md:w-1/2 flex justify-center hero-animate">
          <Image
            src="/medcareLanding.svg"
            alt="Pregnancy Illustration"
            width={500}
            height={500}
            className="max-w-full h-auto hover:scale-105 transition-transform duration-500"
            priority
          />
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-deep-pink mb-6">Our Services</h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-2xl mx-auto">
            Comprehensive healthcare solutions designed specifically for expectant mothers
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
