"use client"

import { useState, useEffect, useRef } from "react"
import { Search } from "lucide-react"
import Sidebar from "@/components/Sidebar"
import UploadBox from "@/components/UploadBox"
import { gsap } from "gsap"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function MedicineStore() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredMedicines, setFilteredMedicines] = useState([]) // start empty
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const pageRef = useRef(null)

  useEffect(() => {
    // Remove filtering logic based on dummy data
    // If you want to support text search on fetched results, filter filteredMedicines here
    // Otherwise, do nothing
  }, [searchTerm])

  useEffect(() => {
    // Animation for page elements
    gsap.fromTo(
      ".page-anim",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: "power2.out" },
    )
  }, [])

  const handleUpload = async (file) => {
    setLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("top_k", "5")

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API?.trim() || "http://localhost:8081"
      const response = await fetch(`${backendUrl}/api/image-search`, {
        method: "POST",
        body: formData,
        credentials: 'omit',  // Explicitly omit credentials
        headers: {
          'Accept': 'application/json',
        }
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error("Error response:", errorText)
        throw new Error(errorText || "Image search failed")
      }
      
      const data = await response.json()
      // Map backend response to medicine card format
      if (data.matches && Array.isArray(data.matches)) {
        const mapped = data.matches.map((match) => ({
          id: match.metadata?.id || match.id,
          name: match.metadata?.medicine_name || "Unknown",
          usage: match.metadata?.description || "",
          price: match.metadata?.price_per_unit || 0,
          image: match.metadata?.image_url || "/placeholder.svg?height=200&width=200",
        }))
        setFilteredMedicines(mapped)
        setSearchTerm("") // clear search term to show only image results
      } else {
        setFilteredMedicines([])
      }
    } catch (err) {
      console.error("Upload error:", err)
      setError(err.message || "Image search failed")
      setFilteredMedicines([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <Sidebar />

      <div className="flex-1 ml-[70px] p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-deep-pink mb-8 page-anim">Medicine Store</h1>

          {/* Search and Upload Section */}
          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="page-anim">
              <h2 className="text-xl font-semibold mb-4">Search Medicines</h2>
              <div className="relative">
                <Input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or usage..."
                  className="pl-10"
                />
                <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              </div>
            </div>

            <div className="page-anim">
              <h2 className="text-xl font-semibold mb-4">Upload Image</h2>
              <UploadBox onUpload={handleUpload} label="Upload image for medicine search" />
            </div>
          </div>

          {/* Medicine Cards */}
          <div className="page-anim">
            <h2 className="text-xl font-semibold mb-4">Available Medicines</h2>
            {loading && (
              <div className="text-center py-8">
                <p className="text-gray-500">Searching by image...</p>
              </div>
            )}
            {error && (
              <div className="text-center py-8">
                <p className="text-red-500">{error}</p>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMedicines.map((medicine) => (
                <Card key={medicine.id} className="overflow-hidden">
                  <img
                    src={medicine.image || "/placeholder.svg"}
                    alt={medicine.name}
                    className="w-full h-48 object-cover"
                  />
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{medicine.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-gray-600 text-sm">{medicine.usage}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <span className="text-pink-600 font-bold">${medicine.price.toFixed(2)}</span>
                    <Button size="sm" className="bg-pink-500 hover:bg-pink-700 rounded-full py-2">
                      Add to Cart
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            {filteredMedicines.length === 0 && !loading && !error && (
              <div className="text-center py-8">
                <p className="text-gray-500">No medicines found matching "{searchTerm}"</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
