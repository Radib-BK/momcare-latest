"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import ServiceCard from "@/components/ServiceCard"
import { gsap } from "gsap"
import { Button } from "@/components/ui/button"
import { Heart, ArrowRight, Star, Users, Clock, Award, MapPin, Pill, Calendar, Scan, FileText } from "lucide-react"
import { Playfair_Display } from "next/font/google"

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '900'],
  variable: '--font-playfair',
})

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

      // Enhanced floating animation
      gsap.to(".float-animation", {
        y: -10,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      })

      // Enhanced glow pulse effect
      gsap.to(".glow-effect", {
        opacity: 0.8,
        scale: 1.1,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      })
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
    {
      id: "calorie-estimator",
      title: "Calorie Estimator",
      description: "Upload food images and get calorie estimates per 100g.",
      icon: "calculator",
    },
    {
      id: "find-donor",
      title: "Find Blood Donor",
      description: "Locate nearby blood donors quickly with our interactive map.",
      icon: "map-pin",
    }
  ]

  return (
    <div className="flex flex-col min-h-screen" ref={heroRef}>
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-8 md:py-8 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-12 md:mb-0 md:pr-12">
          <span className="hero-animate inline-flex items-center gap-2 text-pink-600 font-medium mb-4 px-4 py-2 bg-pink-50 rounded-full">
            <Award className="w-5 h-5" />
            Trusted by Mothers Worldwide
          </span>
          <h1 className={`hero-animate ${playfair.variable} font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight`}>
            Empowering Your 
            <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent"> Pregnancy Journey</span>
          </h1>
          <p className="hero-animate text-xl mb-6 text-gray-600 leading-relaxed max-w-lg">
            Join thousands of mothers who trust MomCare for expert guidance, medication tracking, and personalized health insights during their pregnancy journey.
          </p>
          <div className="hero-animate flex flex-col sm:flex-row gap-4 mb-8">
            <Button 
              asChild 
              className="bg-pink-600 hover:bg-pink-700 text-white rounded-full text-lg px-12 py-3 h-auto font-medium transition-all duration-300 hover:shadow-lg hover:shadow-pink-200 flex items-center justify-center"
            >
              <Link href="/auth">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button 
              asChild 
              variant="outline"
              className="border-pink-200 hover:bg-pink-50 text-gray-700 rounded-full text-lg px-10 py-3 h-auto font-medium"
            >
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
          <div className="hero-animate grid grid-cols-2 sm:grid-cols-4 gap-6 mt-10 pb-4">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-full bg-pink-50">
                <Star className="w-6 h-6 text-pink-600" />
              </div>
              <div className="font-bold text-2xl text-gray-900">4.9/5</div>
              <div className="text-sm text-gray-500">User Rating</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-full bg-pink-50">
                <Users className="w-6 h-6 text-pink-600" />
              </div>
              <div className="font-bold text-2xl text-gray-900">10k+</div>
              <div className="text-sm text-gray-500">Active Users</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-full bg-pink-50">
                <Clock className="w-6 h-6 text-pink-600" />
              </div>
              <div className="font-bold text-2xl text-gray-900">24/7</div>
              <div className="text-sm text-gray-500">Support</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-full bg-pink-50">
                <Award className="w-6 h-6 text-pink-600" />
              </div>
              <div className="font-bold text-2xl text-gray-900">#1</div>
              <div className="text-sm text-gray-500">Care App</div>
            </div>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center items-center hero-animate relative">
          {/* Multiple layered glows for stronger effect */}
          <div className="absolute inset-4 bg-pink-200/30 rounded-full blur-2xl glow-effect"></div>
          <div className="absolute inset-8 bg-purple-200/30 rounded-full blur-3xl glow-effect"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-pink-200/40 to-purple-200/40 rounded-full blur-xl glow-effect"></div>
          
          <div className="relative float-animation">
            <Image
              src="/medcareLanding.svg"
              alt="Pregnancy Illustration"
              width={480}
              height={480}
              className="relative max-w-full h-auto w-auto hover:scale-105 transition-transform duration-500"
              priority
            />
            <div className="absolute -top-4 right-0 text-pink-400 animate-bounce">
              <Heart size={16} fill="currentColor" />
            </div>
            <div className="absolute bottom-0 left-0 text-pink-500 animate-pulse">
              <Heart size={20} fill="currentColor" />
            </div>
            {/* Additional decorative elements */}
            <div className="absolute top-1/2 -left-4 text-purple-400 animate-pulse delay-100">
              <Heart size={18} fill="currentColor" />
            </div>
            <div className="absolute top-1/4 -right-4 text-pink-300 animate-bounce delay-200">
              <Heart size={14} fill="currentColor" />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-deep-pink mb-6">Our Services</h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-2xl mx-auto">
            Comprehensive healthcare solutions designed specifically for expectant mothers
          </p>
          <div className="relative overflow-hidden max-w-[1400px] mx-auto">
            <div 
              className="flex animate-slide"
              style={{
                width: 'max-content',
              }}
            >
              {/* First set of cards */}
              <div className="flex">
                {services.map((service) => (
                  <div key={service.id} className="w-[300px] mx-4">
                    <ServiceCard
                      id={service.id}
                      title={service.title}
                      description={service.description}
                      icon={service.icon}
                    />
                  </div>
                ))}
              </div>
              {/* Duplicate set for infinite loop */}
              <div className="flex">
                {services.map((service) => (
                  <div key={`${service.id}-duplicate`} className="w-[340px] mx-4">
                    <ServiceCard
                      id={service.id}
                      title={service.title}
                      description={service.description}
                      icon={service.icon}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <style jsx>{`
            .animate-slide {
              animation: slide 30s linear infinite;
            }
            .animate-slide:hover {
              animation-play-state: paused;
            }
            @keyframes slide {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-50%);
              }
            }
          `}</style>
        </div>
      </section>
    </div>
  )
}

// Add the styles to the existing global.css file or create a new one if needed
const styles = {
  '@keyframes autoScroll': {
    '0%': {
      transform: 'translateX(0)',
    },
    '100%': {
      transform: 'translateX(-50%)',
    },
  },
}

// Add this to your global styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style')
  styleSheet.textContent = `
    @keyframes autoScroll {
      0% {
        transform: translateX(0);
      }
      100% {
        transform: translateX(-50%);
      }
    }
  `
  document.head.appendChild(styleSheet)
}
