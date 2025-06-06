"use client"

import { useState, useEffect, useRef } from "react"
import { Search } from "lucide-react"
import Sidebar from "@/components/Sidebar"
import UploadBox from "@/components/UploadBox"
import { gsap } from "gsap"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react" // Add this import

export default function MedicineStore() {
  const [searchTerm, setSearchTerm] = useState("")
  const [medicines, setMedicines] = useState([]) // for all medicines
  const [filteredMedicines, setFilteredMedicines] = useState([]) // for search results
  const [initialLoading, setInitialLoading] = useState(true)
  const [imageSearchLoading, setImageSearchLoading] = useState(false)
  const [error, setError] = useState(null)
  const pageRef = useRef(null)

  // Add new useEffect for initial data fetching
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API?.trim() 
        const response = await fetch(`${backendUrl}/api/products`, {
          credentials: 'omit',
          headers: {
            'Accept': 'application/json',
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch medicines')
        }

        const data = await response.json()
        setMedicines(data)
        setFilteredMedicines(data) // Show all medicines initially
      } catch (err) {
        console.error("Fetch error:", err)
        setError(err.message || "Failed to load medicines")
      } finally {
        setInitialLoading(false)
      }
    }

    fetchMedicines()
  }, [])

  // Modify search effect to filter from all medicines
  useEffect(() => {
    if (searchTerm) {
      const filtered = medicines.filter(medicine => 
        medicine.medicineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        medicine.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredMedicines(filtered)
    } else {
      setFilteredMedicines(medicines) // Show all when search is empty
    }
  }, [searchTerm, medicines])

  useEffect(() => {
    // Animation for page elements
    gsap.fromTo(
      ".page-anim",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: "power2.out" },
    )
  }, [])

  const handleUpload = async (file) => {
    if (!file) {
      // When image is deselected, show all products
      setFilteredMedicines(medicines)
      setInitialLoading(false)
      return
    }

    setImageSearchLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("top_k", "5")

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API?.trim() || "http://localhost:8081"
      const response = await fetch(`${backendUrl}/api/image-search`, {
        method: "POST",
        body: formData,
        credentials: 'omit',
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
      if (data.matches && Array.isArray(data.matches)) {
        const mapped = data.matches.map((match) => ({
          id: match.metadata?.id || match.id,
          medicineName: match.metadata?.medicine_name || "Unknown",
          description: match.metadata?.description || "",
          pricePerUnit: match.metadata?.price_per_unit || 0,
          imageUrl: match.metadata?.image_url || "/placeholder.svg?height=200&width=200",
        }))
        setFilteredMedicines(mapped)
      } else {
        setFilteredMedicines(medicines) // Show all medicines if no matches
      }
    } catch (err) {
      console.error("Upload error:", err)
      setError(err.message || "Image search failed")
      setFilteredMedicines(medicines) // Show all medicines on error
    } finally {
      setImageSearchLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <Sidebar />
      <div className="flex-1 ml-[70px] p-6 relative">
        {/* Show loading overlay only during image search */}
        {imageSearchLoading && (
          <div className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center">
            <div className="bg-white px-12 py-8 rounded-xl shadow-lg">
              <Loader2 className="h-12 w-12 animate-spin text-pink-500 mx-auto mb-3" />
              <p className="text-xl font-medium text-gray-800">Searching by image...</p>
            </div>
          </div>
        )}

        <div className="max-w-6xl mx-auto">
          {/* Show initial loading state here if needed */}
          {initialLoading ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-pink-500 mx-auto" />
            </div>
          ) : (
            <>
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
                {error && (
                  <div className="text-center py-8">
                    <p className="text-red-500">{error}</p>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMedicines.map((medicine) => (
                    <Card key={medicine.id} className="overflow-hidden">
                      <img
                        src={medicine.imageUrl || "/placeholder.svg"}
                        alt={medicine.medicineName}
                        className="w-full h-48 object-cover"
                      />
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{medicine.medicineName}</CardTitle>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-gray-600 text-sm">{medicine.description}</p>
                      </CardContent>
                      <CardFooter className="flex justify-between items-center">
                        <span className="text-pink-600 font-bold">
                          ${(medicine.pricePerUnit || 0).toFixed(2)}
                        </span>
                        <Button size="sm" className="bg-pink-500 hover:bg-pink-700 rounded-full py-2">
                          Add to Cart
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
                {filteredMedicines.length === 0 && !initialLoading && !error && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No medicines found matching</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
