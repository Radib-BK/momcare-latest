"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { gsap } from "gsap"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pill, Calendar, Scan, FileText, ArrowRight, Shield } from "lucide-react"
import Sidebar from "@/components/Sidebar"
import { Playfair_Display } from "next/font/google"

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  display: 'swap',
})

export default function ServicesPage() {
  const pageRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial animation for cards
      gsap.fromTo(
        ".service-anim",
        { 
          y: 50, 
          opacity: 0,
          scale: 0.95
        },
        { 
          y: 0, 
          opacity: 1, 
          scale: 1,
          stagger: 0.1, 
          duration: 0.8, 
          ease: "back.out(1.7)" 
        }
      )

      // Hover animation for cards
      const cards = document.querySelectorAll('.service-card')
      cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            y: -10,
            scale: 1.02,
            duration: 0.3,
            ease: "power2.out"
          })
          gsap.to(card.querySelector('.card-icon'), {
            rotation: 360,
            duration: 0.6,
            ease: "back.out(1.7)"
          })
        })
        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            y: 0,
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
          })
          gsap.to(card.querySelector('.card-icon'), {
            rotation: 0,
            duration: 0.6,
            ease: "back.out(1.7)"
          })
        })
      })
    }, pageRef)

    return () => ctx.revert()
  }, [])

  const services = [
    {
      id: "medicine-store",
      title: "Medicine Store",
      description: "Access our comprehensive database of pregnancy-safe medications. Get detailed information about dosage, side effects, and safety ratings.",
      icon: <Pill className="h-8 w-8" />,
      color: "pink",
    },
    {
      id: "medicine-dates",
      title: "Medicine Dates",
      description: "Never miss a dose or let your medications expire. Set reminders and track expiry dates efficiently.",
      icon: <Calendar className="h-8 w-8" />,
      color: "purple",
    },
    {
      id: "skin-disease-classification",
      title: "Skin Disease Classification",
      description: "AI-powered analysis to identify common pregnancy-related skin conditions. Get instant preliminary assessments.",
      icon: <Scan className="h-8 w-8" />,
      color: "blue",
    },
    {
      id: "prescription-analyzer",
      title: "Prescription Analyzer",
      description: "Upload your prescriptions for instant digital analysis. Understand your medications better with our smart system.",
      icon: <FileText className="h-8 w-8" />,
      color: "green",
    },
  ]

  const getGradient = (color) => {
    const gradients = {
      pink: "from-pink-500 to-rose-500",
      purple: "from-purple-500 to-violet-500",
      blue: "from-blue-500 to-cyan-500",
      green: "from-green-500 to-emerald-500",
    }
    return gradients[color]
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 bg-gradient-to-b from-pink-50 to-white py-16 md:py-24 pl-[70px]" ref={pageRef}>
        <div className="container mx-auto px-6 max-w-7xl">
          {/* Header */}
          <div className="text-center mb-16 service-anim">
            <h1 className={`text-4xl md:text-5xl font-bold text-deep-pink mb-6 ${playfair.className}`}>
              Our Services
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Comprehensive healthcare solutions designed specifically for expectant mothers. Each service is crafted to
              ensure your comfort and well-being throughout your pregnancy journey.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto">
            {services.map((service, index) => (
              <div key={service.id} className="service-anim" style={{ animationDelay: `${index * 0.1}s` }}>
                <Link href={`/${service.id}`}>
                  <Card className="service-card group h-full hover:shadow-xl transition-all duration-300 overflow-hidden border-2 hover:border-pink-100 rounded-2xl">
                    <CardHeader className={`bg-gradient-to-r ${getGradient(service.color)} p-8 h-[280px] flex flex-col justify-between`}>
                      <div className="bg-white/10 w-16 h-16 rounded-xl flex items-center justify-center mb-4 card-icon">
                        <div className="text-white">{service.icon}</div>
                      </div>
                      <div>
                        <CardTitle className="text-2xl text-white mb-3">{service.title}</CardTitle>
                        <CardDescription className="text-white/90 text-base line-clamp-3">
                          {service.description}
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <Button 
                        variant="ghost" 
                        className="group-hover:text-pink-600 transition-all duration-200 p-0 rounded-xl hover:bg-pink-50"
                      >
                        Learn more
                        <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center service-anim">
            <Card className="max-w-2xl mx-auto overflow-hidden border-2 hover:border-pink-100 transition-all duration-300 rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-pink-600 to-pink-500 text-white p-8">
                <div className="mb-4 card-icon">
                  <Shield className="h-12 w-12 mx-auto" />
                </div>
                <CardTitle className="text-2xl mb-2">Need Help Choosing?</CardTitle>
                <CardDescription className="text-white/90 text-lg">
                  Our team is here to guide you through the best options for your pregnancy journey.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <Button 
                  asChild
                  className="bg-pink-600 hover:bg-pink-700 transition-all duration-200 rounded-xl hover:shadow-lg hover:shadow-pink-200 text-white"
                >
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
