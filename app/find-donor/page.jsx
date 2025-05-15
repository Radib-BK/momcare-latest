'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Loader2 } from 'lucide-react'

// Dynamic import of map components to avoid SSR issues
const MapWithNoSSR = dynamic(
  () => import('@/components/DonorMap'),
  {
    loading: () => (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader2 className="h-8 w-8 animate-spin text-pink-600" />
      </div>
    ),
    ssr: false
  }
)

export default function FindDonorPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Blood Donors</h1>
        <p className="text-gray-600">
          Find blood donors near your location. Click on a marker to see donor details.
        </p>
      </div>
      
      <div className="rounded-xl overflow-hidden shadow-lg border border-pink-100">
        <MapWithNoSSR />
      </div>
    </div>
  )
} 