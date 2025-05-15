"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, Award, Calendar, Users, Star, Shield } from "lucide-react"
import Image from "next/image"

export default function AboutPage() {
  const pageRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animation for page elements
      gsap.fromTo(
        ".about-anim",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.15, duration: 0.8, ease: "power2.out" }
      )
    }, pageRef)

    return () => ctx.revert()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white" ref={pageRef}>
      <div className="container mx-auto px-6 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16 about-anim">
            <h1 className="text-5xl md:text-6xl font-bold text-deep-pink mb-6 font-serif">About MomCare</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Empowering mothers with innovative healthcare solutions for a safer and more comfortable pregnancy journey.
            </p>
          </div>

          {/* Mission Section */}
          <div className="about-anim mb-16">
            <Card className="overflow-hidden border-2 hover:border-pink-100 transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-pink-600 to-pink-500 text-white">
                <CardTitle className="text-2xl">Our Mission</CardTitle>
                <CardDescription className="text-pink-100">Supporting mothers through their pregnancy journey</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="prose prose-pink">
                  <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    MomCare is dedicated to providing expectant mothers with the tools and resources they need to navigate
                    their pregnancy journey with confidence. Our platform offers a range of services designed to make
                    pregnancy management easier and more accessible.
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    From medication tracking to prescription analysis, we're committed to supporting maternal health through
                    innovative technology solutions.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Services Grid */}
          <div className="about-anim mb-16">
            <h2 className="text-3xl font-bold text-deep-pink mb-8 text-center">Our Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <div className="bg-pink-100 p-3 rounded-2xl">
                    <Heart className="h-8 w-8 text-pink-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Health Monitoring</CardTitle>
                    <CardDescription>Track your health</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Comprehensive health tracking and monitoring throughout your pregnancy journey.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <div className="bg-pink-100 p-3 rounded-2xl">
                    <Calendar className="h-8 w-8 text-pink-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Medication Management</CardTitle>
                    <CardDescription>Stay on schedule</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Smart medication tracking with reminders and expiry date monitoring.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <div className="bg-pink-100 p-3 rounded-2xl">
                    <Shield className="h-8 w-8 text-pink-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Safety First</CardTitle>
                    <CardDescription>Expert guidance</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    AI-powered prescription analysis and medication safety checks.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Team Section */}
          <div className="about-anim mb-16">
            <h2 className="text-3xl font-bold text-deep-pink mb-8 text-center">Meet Our Team</h2>
            <Card className="overflow-hidden border-2 hover:border-pink-100 transition-all duration-300">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-pink-50">
                    <Avatar className="h-24 w-24 mb-4 ring-4 ring-pink-100">
                      <AvatarImage src="/122.jpg" alt="Radib Bin Kabir" />
                      <AvatarFallback className="bg-pink-600 text-white text-xl">RK</AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-semibold mb-1">Radib Bin Kabir</h3>
                    <p className="text-pink-600 font-medium mb-2">Full Stack Developer</p>
                    <p className="text-gray-600">
                      Passionate about creating innovative technology solutions for healthcare.
                    </p>
                  </div>

                  <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-pink-50">
                    <Avatar className="h-24 w-24 mb-4 ring-4 ring-pink-100">
                      <AvatarImage src="/125.jpg" alt="Mehedi Ahamed" />
                      <AvatarFallback className="bg-pink-600 text-white text-xl">MA</AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-semibold mb-1">Mehedi Ahamed</h3>
                    <p className="text-pink-600 font-medium mb-2">ML Developer</p>
                    <p className="text-gray-600">
                      Focused on creating innovative technology solutions for healthcare.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Project Info */}
          <div className="about-anim">
            <Card className="overflow-hidden border-2 hover:border-pink-100 transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-pink-600 to-pink-500 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-6 w-6" />
                  Project Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-4">
                  <p className="text-lg text-gray-700 leading-relaxed">
                    This project was developed by Radib Bin Kabir and Mehedi Ahamed for the Therap JavaFest 2025.
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    MomCare aims to leverage technology to improve maternal healthcare accessibility and management.
                  </p>
                  <div className="flex items-center gap-2 text-pink-600">
                    <Star className="h-5 w-5" />
                    <span className="font-medium">Therap JavaFest 2025</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
