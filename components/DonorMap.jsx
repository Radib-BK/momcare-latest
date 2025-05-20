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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_BACKEND_API}/api`

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
  const [donors, setDonors] = useState([])

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          setUserLocation(location)
          fetchDonors(location, selectedBloodType)
          setLoading(false)
        },
        (error) => {
          setError("Could not get your location. Please enable location services.")
          setLoading(false)
          // Fallback to Gazipur location
          const location = { lat: 23.9985, lng: 90.4125 }
          setUserLocation(location)
          fetchDonors(location, selectedBloodType)
        }
      )
    } else {
      setError("Geolocation is not supported by your browser")
      setLoading(false)
      // Fallback to Gazipur location
      const location = { lat: 23.9985, lng: 90.4125 }
      setUserLocation(location)
      fetchDonors(location, selectedBloodType)
    }
  }, [])

  const fetchDonors = async (location, bloodType) => {
    try {
      const params = new URLSearchParams({
        latitude: location.lat,
        longitude: location.lng,
        radiusKm: 20,
        limit: 50
      })
      
      if (bloodType !== 'ALL') {
        params.append('bloodType', bloodType)
      }

      const response = await fetch(`${API_BASE_URL}/donors/nearby?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch donors')
      }
      
      const data = await response.json()
      setDonors(data.map(donor => ({
        id: donor.id,
        name: donor.name,
        bloodType: donor.bloodType,
        phone: donor.phone,
        lat: donor.latitude,
        lng: donor.longitude
      })))
    } catch (error) {
      console.error('Error fetching donors:', error)
      setError('Failed to fetch donors. Please try again later.')
    }
  }

  useEffect(() => {
    if (userLocation) {
      fetchDonors(userLocation, selectedBloodType)
    }
  }, [selectedBloodType])

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
      <Map userLocation={userLocation} donors={donors} />
    </div>
  )
} 