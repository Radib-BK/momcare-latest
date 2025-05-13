"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, Award, Calendar } from "lucide-react"

export default function AboutPage() {
  const pageRef = useRef(null)

  useEffect(() => {
    // Animation for page elements
    gsap.fromTo(
      ".about-anim",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: "power2.out" },
    )
  }, [])

  return (
    <div className="container mx-auto px-4 py-12" ref={pageRef}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-deep-pink mb-6 about-anim">About MomCare</h1>

        <div className="about-anim mb-10">
          <Card>
            <CardHeader>
              <CardTitle>Our Mission</CardTitle>
              <CardDescription>Supporting mothers through their pregnancy journey</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                MomCare is dedicated to providing expectant mothers with the tools and resources they need to navigate
                their pregnancy journey with confidence. Our platform offers a range of services designed to make
                pregnancy management easier and more accessible.
              </p>
              <p className="text-gray-700">
                From medication tracking to prescription analysis, we're committed to supporting maternal health through
                innovative technology solutions.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="about-anim mb-10">
          <h2 className="text-2xl font-semibold text-deep-pink mb-4">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="bg-pink-100 p-2 rounded-full">
                  <Heart className="h-6 w-6 text-pink-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Health Monitoring</CardTitle>
                  <CardDescription>Track your health throughout pregnancy</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Our platform helps you monitor vital health metrics and medication schedules.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="bg-pink-100 p-2 rounded-full">
                  <Calendar className="h-6 w-6 text-pink-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Medication Management</CardTitle>
                  <CardDescription>Never miss important medications</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Keep track of your medications, their expiry dates, and dosage instructions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="about-anim mb-10">
          <h2 className="text-2xl font-semibold text-deep-pink mb-6">Meet the Team</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="/placeholder.svg" alt="Radib Bin Kabir" />
                    <AvatarFallback>RK</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-medium">Radib Bin Kabir</h3>
                    <p className="text-gray-500">Lead Developer</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Passionate about creating technology solutions for healthcare.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="/placeholder.svg" alt="Mehedi Ahamed" />
                    <AvatarFallback>MA</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-medium">Mehedi Ahamed</h3>
                    <p className="text-gray-500">UX Designer</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Focused on creating intuitive and accessible user experiences.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="about-anim">
          <Card>
            <CardHeader>
              <CardTitle>Project Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-2">
                This project was developed by Radib Bin Kabir and Mehedi Ahamed for the Therap JavaFest 2025.
              </p>
              <p className="text-gray-700">
                MomCare aims to leverage technology to improve maternal healthcare accessibility and management.
              </p>
              <div className="mt-4 flex items-center">
                <Award className="h-5 w-5 text-pink-600 mr-2" />
                <span className="text-sm font-medium">Therap JavaFest 2025</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
