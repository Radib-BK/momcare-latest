"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { gsap } from "gsap"
import { Camera, Mail, MapPin, Droplet, Calendar, User, Phone } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import UploadBox from "@/components/UploadBox"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_BACKEND_API}/api`;

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    address: "",
    bloodType: "",
    pregnancyStatus: "",
    dueDate: "",
    phoneNumber: "",
    profileImage: null
  })
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Animation for profile page
    gsap.fromTo(
      ".profile-anim",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.15, duration: 0.8, ease: "power2.out" }
    )

    // Fetch user profile data
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/auth')
        return
      }

      const response = await fetch(`${API_BASE_URL}/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) throw new Error('Failed to fetch profile')

      const data = await response.json()
      setProfileData({
        name: data.name || "",
        email: data.email || "",
        address: data.address || "",
        phoneNumber: data.phoneNumber || "",
        bloodType: data.bloodType || "UNSPECIFIED",
        pregnancyStatus: data.pregnancyStatus || "UNSPECIFIED",
        dueDate: data.dueDate || "",
        profileImage: data.profileImageUrl ? `${API_BASE_URL}/uploads/${data.profileImageUrl}` : null
      })
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive"
      })
    }
  }

  const handleImageUpload = async (file) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(`${API_BASE_URL}/profile/image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (!response.ok) throw new Error('Failed to upload image')

      const fileName = await response.text()
      setProfileData(prev => ({ 
        ...prev, 
        profileImage: `${API_BASE_URL}/uploads/${fileName}` 
      }))

      toast({
        title: "Success",
        description: "Profile photo updated successfully",
      })
    } catch (error) {
      console.error('Error uploading image:', error)
      toast({
        title: "Error",
        description: "Failed to upload profile photo",
        variant: "destructive"
      })
    }
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/auth')
        return
      }

      const updatedProfile = {
        name: profileData.name,
        email: profileData.email,
        address: profileData.address || "",
        phoneNumber: profileData.phoneNumber || "",
        bloodType: profileData.bloodType || "UNSPECIFIED",
        pregnancyStatus: profileData.pregnancyStatus || "UNSPECIFIED",
        dueDate: profileData.dueDate || null
      }

      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedProfile)
      })

      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(errorData || 'Failed to update profile')
      }

      toast({
        title: "Success",
        description: "Profile updated successfully",
      })

      // Update local storage with new name for header display
      localStorage.setItem('userName', profileData.name)
      // Trigger auth state change for header update
      window.dispatchEvent(new Event('authStateChanged'))
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
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

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="phoneNumber"
                        type="tel"
                        value={profileData.phoneNumber}
                        onChange={(e) => setProfileData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                        className="pl-10"
                        placeholder="+1 (555) 000-0000"
                        required
                      />
                    </div>
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
                    <Label htmlFor="bloodType" className="flex items-center gap-2">
                      <Droplet className="h-4 w-4 text-pink-500" />
                      Blood Type
                    </Label>
                    <Select
                      value={profileData.bloodType}
                      onValueChange={(value) => setProfileData(prev => ({ ...prev, bloodType: value }))}
                    >
                      <SelectTrigger className="w-full bg-white hover:bg-gray-50 transition-colors">
                        <SelectValue placeholder="Select blood type" />
                      </SelectTrigger>
                      <SelectContent className="bg-white shadow-lg border rounded-lg min-w-[240px]">
                        <div className="p-1">
                          <SelectItem value="UNSPECIFIED" className="py-2.5 px-3 focus:bg-pink-50 hover:bg-pink-50/50 rounded-md cursor-pointer">Not specified</SelectItem>
                          <SelectItem value="O+" className="py-2.5 px-3 focus:bg-pink-50 hover:bg-pink-50/50 rounded-md cursor-pointer">O Positive (O+)</SelectItem>
                          <SelectItem value="O-" className="py-2.5 px-3 focus:bg-pink-50 hover:bg-pink-50/50 rounded-md cursor-pointer">O Negative (O-)</SelectItem>
                          <SelectItem value="A+" className="py-2.5 px-3 focus:bg-pink-50 hover:bg-pink-50/50 rounded-md cursor-pointer">A Positive (A+)</SelectItem>
                          <SelectItem value="A-" className="py-2.5 px-3 focus:bg-pink-50 hover:bg-pink-50/50 rounded-md cursor-pointer">A Negative (A-)</SelectItem>
                          <SelectItem value="B+" className="py-2.5 px-3 focus:bg-pink-50 hover:bg-pink-50/50 rounded-md cursor-pointer">B Positive (B+)</SelectItem>
                          <SelectItem value="B-" className="py-2.5 px-3 focus:bg-pink-50 hover:bg-pink-50/50 rounded-md cursor-pointer">B Negative (B-)</SelectItem>
                          <SelectItem value="AB+" className="py-2.5 px-3 focus:bg-pink-50 hover:bg-pink-50/50 rounded-md cursor-pointer">AB Positive (AB+)</SelectItem>
                          <SelectItem value="AB-" className="py-2.5 px-3 focus:bg-pink-50 hover:bg-pink-50/50 rounded-md cursor-pointer">AB Negative (AB-)</SelectItem>
                        </div>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500">This information is important for medical purposes</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pregnancyStatus" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-pink-500" />
                      Pregnancy Status
                    </Label>
                    <Select
                      value={profileData.pregnancyStatus}
                      onValueChange={(value) => setProfileData(prev => ({ ...prev, pregnancyStatus: value }))}
                    >
                      <SelectTrigger className="w-full bg-white hover:bg-gray-50 transition-colors">
                        <SelectValue placeholder="Select pregnancy status" />
                      </SelectTrigger>
                      <SelectContent className="bg-white shadow-lg border rounded-lg min-w-[280px]">
                        <div className="p-1">
                          <SelectItem value="UNSPECIFIED" className="py-2.5 px-3 focus:bg-pink-50 hover:bg-pink-50/50 rounded-md cursor-pointer">Not specified</SelectItem>
                          <SelectItem value="TRYING" className="py-2.5 px-3 focus:bg-pink-50 hover:bg-pink-50/50 rounded-md cursor-pointer">Trying to Conceive (TTC)</SelectItem>
                          <SelectItem value="FIRST" className="py-2.5 px-3 focus:bg-pink-50 hover:bg-pink-50/50 rounded-md cursor-pointer">First Trimester (Weeks 1-12)</SelectItem>
                          <SelectItem value="SECOND" className="py-2.5 px-3 focus:bg-pink-50 hover:bg-pink-50/50 rounded-md cursor-pointer">Second Trimester (Weeks 13-26)</SelectItem>
                          <SelectItem value="THIRD" className="py-2.5 px-3 focus:bg-pink-50 hover:bg-pink-50/50 rounded-md cursor-pointer">Third Trimester (Weeks 27-40)</SelectItem>
                          <SelectItem value="POSTPARTUM" className="py-2.5 px-3 focus:bg-pink-50 hover:bg-pink-50/50 rounded-md cursor-pointer">Postpartum (After Birth)</SelectItem>
                          <SelectItem value="NOT_PREGNANT" className="py-2.5 px-3 focus:bg-pink-50 hover:bg-pink-50/50 rounded-md cursor-pointer">Not Currently Pregnant</SelectItem>
                        </div>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500">Help us provide relevant information for your stage</p>
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