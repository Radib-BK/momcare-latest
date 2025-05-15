"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { gsap } from "gsap"
import { Camera, Mail, MapPin, Droplet, Calendar, User } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import UploadBox from "@/components/UploadBox"

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "Jane Smith",
    email: "jane@example.com",
    address: "123 Main St, City, Country",
    bloodType: "O+",
    pregnancyStatus: "First Trimester",
    dueDate: "2024-12-25",
    profileImage: null
  })
  const router = useRouter()

  useEffect(() => {
    // Animation for profile page
    gsap.fromTo(
      ".profile-anim",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.15, duration: 0.8, ease: "power2.out" }
    )
  }, [])

  const handleImageUpload = (file) => {
    // Here you would typically upload the file to your server/storage
    // For now, we'll just create a local URL
    const imageUrl = URL.createObjectURL(file)
    setProfileData(prev => ({ ...prev, profileImage: imageUrl }))
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate profile update
    setTimeout(() => {
      setIsLoading(false)
      // Show success message or redirect
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="space-y-8">
          {/* Profile Header */}
          <div className="text-center profile-anim">
            <h1 className="text-4xl font-bold text-pink-600 mb-2">My Profile</h1>
            <p className="text-gray-600">Manage your personal information and pregnancy details</p>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-8">
            {/* Profile Image Section */}
            <Card className="profile-anim overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-pink-600 to-pink-500 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Profile Photo
                </CardTitle>
                <CardDescription className="text-pink-100">
                  Upload a photo to personalize your profile
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-col items-center gap-6">
                  <Avatar className="h-32 w-32 ring-4 ring-pink-100">
                    <AvatarImage src={profileData.profileImage || "/placeholder.svg"} alt={profileData.name} />
                    <AvatarFallback className="bg-pink-600 text-white text-3xl">
                      {profileData.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <UploadBox onUpload={handleImageUpload} label="Upload Profile Photo" />
                </div>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card className="profile-anim">
              <CardHeader className="bg-gradient-to-r from-pink-600 to-pink-500 text-white">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
                <CardDescription className="text-pink-100">
                  Update your personal details
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="email"
                        value={profileData.email}
                        disabled
                        className="pl-10 bg-gray-50"
                      />
                    </div>
                    <p className="text-xs text-gray-500">Email cannot be changed</p>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="address"
                        value={profileData.address}
                        onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pregnancy Information */}
            <Card className="profile-anim">
              <CardHeader className="bg-gradient-to-r from-pink-600 to-pink-500 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Pregnancy Information
                </CardTitle>
                <CardDescription className="text-pink-100">
                  Update your pregnancy details
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="bloodType">Blood Type</Label>
                    <Select
                      value={profileData.bloodType}
                      onValueChange={(value) => setProfileData(prev => ({ ...prev, bloodType: value }))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select blood type" />
                      </SelectTrigger>
                      <SelectContent>
                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pregnancyStatus">Pregnancy Status</Label>
                    <Select
                      value={profileData.pregnancyStatus}
                      onValueChange={(value) => setProfileData(prev => ({ ...prev, pregnancyStatus: value }))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select pregnancy status" />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          "First Trimester",
                          "Second Trimester",
                          "Third Trimester",
                          "Postpartum",
                          "Not Pregnant"
                        ].map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={profileData.dueDate}
                      onChange={(e) => setProfileData(prev => ({ ...prev, dueDate: e.target.value }))}
                      className="w-full"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Update Button */}
            <div className="profile-anim flex justify-center">
              <Button
                type="submit"
                className="w-full md:w-auto px-8 h-12 text-base rounded-xl bg-pink-600 hover:bg-pink-700 transition-colors duration-200 shadow-lg hover:shadow-xl disabled:opacity-70"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Updating profile...</span>
                  </div>
                ) : (
                  "Update Profile"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 