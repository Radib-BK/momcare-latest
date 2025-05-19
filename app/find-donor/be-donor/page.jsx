"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

const donorBloodTypes = [
  { value: 'O+', label: 'O Positive (O+)' },
  { value: 'O-', label: 'O Negative (O-)' },
  { value: 'A+', label: 'A Positive (A+)' },
  { value: 'A-', label: 'A Negative (A-)' },
  { value: 'B+', label: 'B Positive (B+)' },
  { value: 'B-', label: 'B Negative (B-)' },
  { value: 'AB+', label: 'AB Positive (AB+)' },
  { value: 'AB-', label: 'AB Negative (AB-)' },
]

export default function BeDonorPage() {
  const [form, setForm] = useState({
    name: '',
    bloodType: '',
    phone: '',
    lat: '',
    lng: ''
  })
  const [loading, setLoading] = useState(false)
  const [locError, setLocError] = useState('')
  const [anim, setAnim] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setAnim(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setForm(f => ({ ...f, lat: pos.coords.latitude, lng: pos.coords.longitude })),
        () => setLocError('Could not get your location. Please enable location services.')
      )
    } else {
      setLocError('Geolocation is not supported by your browser')
    }
  }, [])

  async function checkPhoneExists(phone) {
    try {
      const response = await fetch(`${API_BASE_URL}/donors/check-phone/${phone}`)
      if (!response.ok) {
        throw new Error('Failed to check phone number')
      }
      const data = await response.json()
      return data.exists
    } catch (error) {
      console.error('Error checking phone:', error)
      return false
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    
    if (!form.lat || !form.lng) {
      toast.error('Location is required. Please enable location services.')
      return
    }

    try {
      setLoading(true)
      
      // Check if phone already exists
      const phoneExists = await checkPhoneExists(form.phone)
      if (phoneExists) {
        toast.error('This phone number is already registered as a donor')
        return
      }

      // Register donor
      const response = await fetch(`${API_BASE_URL}/donors/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          bloodType: form.bloodType,
          latitude: form.lat,
          longitude: form.lng
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to register as donor')
      }

      toast.success('Successfully registered as a donor!')
      router.push('/find-donor')
    } catch (error) {
      toast.error(error.message || 'Failed to register as donor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-rose-100 to-white relative overflow-hidden">
      {/* Animated SVG blood drops background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg width="100%" height="100%" viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full animate-pulse-slow">
          <ellipse cx="200" cy="200" rx="120" ry="60" fill="#fbb6ce" fillOpacity="0.25">
            <animate attributeName="cy" values="200;300;200" dur="6s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="1240" cy="700" rx="140" ry="70" fill="#f43f5e" fillOpacity="0.18">
            <animate attributeName="cy" values="700;600;700" dur="7s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="800" cy="400" rx="90" ry="45" fill="#ec4899" fillOpacity="0.13">
            <animate attributeName="cy" values="400;500;400" dur="8s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="400" cy="800" rx="100" ry="50" fill="#f43f5e" fillOpacity="0.10">
            <animate attributeName="cy" values="800;700;800" dur="9s" repeatCount="indefinite" />
          </ellipse>
        </svg>
      </div>
      <div className={`w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 relative z-10 ${anim ? 'animate-in fade-in-0 zoom-in-95' : ''}`}> 
        <div className="flex items-center gap-3 mb-6">
          <span className="inline-block"><svg width="36" height="36" fill="none" viewBox="0 0 24 24"><path fill="#EC4899" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg></span>
          <h1 className="text-3xl font-bold text-pink-600">Become a Donor</h1>
        </div>
        <p className="text-gray-500 mb-6">Fill up the form to register as a blood donor. Your location will be auto-detected.</p>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="donor-name">Name</Label>
            <Input id="donor-name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Rahima Begum" required />
          </div>
          <div>
            <Label htmlFor="donor-bloodType">Blood Type</Label>
            <Select value={form.bloodType} onValueChange={val => setForm(f => ({ ...f, bloodType: val }))} required>
              <SelectTrigger className="w-full bg-white border-pink-200 focus:ring-2 focus:ring-pink-400 text-pink-700 font-semibold shadow-sm hover:bg-pink-50 transition-colors">
                <SelectValue placeholder="Select blood type" />
              </SelectTrigger>
              <SelectContent className="bg-white shadow-lg border border-pink-100 rounded-lg min-w-[220px]">
                {donorBloodTypes.map(type => (
                  <SelectItem key={type.value} value={type.value} className="py-2.5 px-3 focus:bg-pink-50 hover:bg-pink-50/50 rounded-md cursor-pointer text-pink-700 font-medium">{type.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="donor-phone">Phone</Label>
            <Input id="donor-phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="e.g. 01712345678" required pattern="[0-9]{11}" title="Please enter a valid 11-digit phone number" />
          </div>
          {locError && <div className="text-xs text-red-500">{locError}</div>}
          <Button type="submit" className="bg-pink-600 hover:bg-pink-700 text-white font-semibold w-full rounded-full py-2 text-base max-w-xs mx-auto block" disabled={loading}>
            {loading ? 'Registering...' : 'Register as Donor'}
          </Button>
        </form>
      </div>
    </div>
  )
} 