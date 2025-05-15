'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Function to calculate distance between two points using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in kilometers
  return distance.toFixed(1); // Return with 1 decimal place
}

function Map({ userLocation, donors }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Load Leaflet icons
      delete L.Icon.Default.prototype._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: '/marker-icon-2x.png',
        iconUrl: '/marker-icon.png',
        shadowUrl: '/marker-shadow.png',
      })

      // Initialize map if it hasn't been initialized
      if (!mapInstanceRef.current && mapRef.current) {
        mapInstanceRef.current = L.map(mapRef.current, {
          center: [userLocation.lat, userLocation.lng],
          zoom: 13,
          zoomControl: true,
          scrollWheelZoom: true
        })

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19
        }).addTo(mapInstanceRef.current)

        // Add user marker with custom popup
        L.marker([userLocation.lat, userLocation.lng])
          .bindPopup(`
            <div class="bg-white p-3 rounded-lg shadow-sm">
              <div class="flex items-center justify-center">
                <div class="bg-blue-100 rounded-full p-2 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
              <p class="text-center font-medium text-gray-800">Your Location</p>
            </div>
          `)
          .addTo(mapInstanceRef.current)

        // Add donor markers with enhanced popups
        donors.forEach(donor => {
          const distance = calculateDistance(
            userLocation.lat, 
            userLocation.lng, 
            donor.lat, 
            donor.lng
          );
          
          L.marker([donor.lat, donor.lng])
            .bindPopup(`
              <div class="bg-white p-4 rounded-lg shadow-sm min-w-[200px]">
                <div class="text-center mb-3">
                  <div class="inline-flex items-center justify-center bg-red-100 rounded-full p-2 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 class="font-semibold text-lg text-gray-900">${donor.name}</h3>
                </div>
                
                <div class="space-y-2">
                  <div class="flex items-center justify-between bg-red-50 px-3 py-2 rounded-md">
                    <span class="text-sm font-medium text-gray-600">Blood Type</span>
                    <span class="text-sm font-bold text-red-600">${donor.bloodType}</span>
                  </div>
                  
                  <div class="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md">
                    <span class="text-sm font-medium text-gray-600">Contact</span>
                    <span class="text-sm font-medium text-gray-800">${donor.phone}</span>
                  </div>

                  <div class="flex items-center justify-between bg-blue-50 px-3 py-2 rounded-md">
                    <span class="text-sm font-medium text-gray-600">Distance</span>
                    <span class="text-sm font-medium text-blue-600">${distance} km</span>
                  </div>
                </div>
              </div>
            `, {
              maxWidth: 300,
              className: 'custom-popup'
            })
            .addTo(mapInstanceRef.current)
        })
      }
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [userLocation, donors])

  return (
    <div 
      ref={mapRef} 
      className="h-[80vh] w-full z-0 relative" 
      style={{ background: '#f8f9fa' }}
    />
  )
}

export default Map 