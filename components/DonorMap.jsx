'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select'

// Create a Map wrapper component that only renders on client side
const Map = dynamic(() => import('./Map'), {
  loading: () => (
    <div className="flex items-center justify-center h-[80vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600" />
    </div>
  ),
  ssr: false
})

// Mock donor data with locations around Gazipur, Boardbazar (IUT area), and Uttara
const mockDonors = [
  { id: 1, name: "Rahima Begum", bloodType: "A+", phone: "01712345678", lat: 23.9985, lng: 90.4125 }, // Gazipur
  { id: 2, name: "Abdul Karim", bloodType: "O-", phone: "01823456789", lat: 23.9825, lng: 90.4275 }, // Gazipur East
  { id: 3, name: "Fatima Khan", bloodType: "B+", phone: "01934567890", lat: 23.9615, lng: 90.3650 }, // Boardbazar (IUT area)
  { id: 4, name: "Mohammad Ali", bloodType: "A+", phone: "01645678901", lat: 23.9625, lng: 90.3665 }, // Boardbazar (IUT area)
  { id: 5, name: "Nusrat Jahan", bloodType: "O+", phone: "01556789012", lat: 23.9605, lng: 90.3645 }, // Boardbazar (IUT area)
  { id: 6, name: "Kamal Hassan", bloodType: "A+", phone: "01467890123", lat: 23.8698, lng: 90.3855 }, // Uttara
  { id: 7, name: "Aisha Siddiqua", bloodType: "B-", phone: "01378901234", lat: 23.9755, lng: 90.4150 }, // Gazipur South
  { id: 8, name: "Imran Hossain", bloodType: "AB-", phone: "01289012345", lat: 23.9635, lng: 90.3675 }, // Boardbazar (IUT area)
  { id: 9, name: "Nasreen Akter", bloodType: "O+", phone: "01190123456", lat: 23.9895, lng: 90.4225 }, // Gazipur West
  { id: 10, name: "Rafiq Islam", bloodType: "B+", phone: "01001234567", lat: 23.8738, lng: 90.3835 }  // Uttara
]

const bloodTypes = [
  { value: 'ALL', label: 'All Blood Types' },
  { value: 'O+', label: 'O Positive (O+)' },
  { value: 'O-', label: 'O Negative (O-)' },
  { value: 'A+', label: 'A Positive (A+)' },
  { value: 'A-', label: 'A Negative (A-)' },
  { value: 'B+', label: 'B Positive (B+)' },
  { value: 'B-', label: 'B Negative (B-)' },
  { value: 'AB+', label: 'AB Positive (AB+)' },
  { value: 'AB-', label: 'AB Negative (AB-)' },
]

export default function DonorMap() {
  const [userLocation, setUserLocation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedBloodType, setSelectedBloodType] = useState('ALL')

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
          setLoading(false)
        },
        (error) => {
          setError("Could not get your location. Please enable location services.")
          setLoading(false)
          // Fallback to Gazipur location
          setUserLocation({ lat: 23.9985, lng: 90.4125 })
        }
      )
    } else {
      setError("Geolocation is not supported by your browser")
      setLoading(false)
      // Fallback to Gazipur location
      setUserLocation({ lat: 23.9985, lng: 90.4125 })
    }
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[80vh] text-red-600">
        {error}
      </div>
    )
  }

  if (!userLocation) return null

  const filteredDonors = selectedBloodType === 'ALL'
    ? mockDonors
    : mockDonors.filter(donor => donor.bloodType === selectedBloodType)

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <label className="font-medium ml-6 text-pink-600 text-base md:mr-4">Blood Type:</label>
        <div className="w-full max-w-xs">
          <Select value={selectedBloodType} onValueChange={setSelectedBloodType}>
            <SelectTrigger className="w-full bg-white border-pink-200 focus:ring-2 focus:ring-pink-400 text-pink-700 font-semibold shadow-sm hover:bg-pink-50 transition-colors">
              <SelectValue placeholder="Select blood type" />
            </SelectTrigger>
            <SelectContent className="bg-white shadow-lg border border-pink-100 rounded-lg min-w-[220px]">
              {bloodTypes.map(type => (
                <SelectItem
                  key={type.value}
                  value={type.value}
                  className="py-2.5 px-3 focus:bg-pink-50 hover:bg-pink-50/50 rounded-md cursor-pointer text-pink-700 font-medium"
                >
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Map userLocation={userLocation} donors={filteredDonors} />
    </div>
  )
} 