"use client"

import { useState, useEffect, useRef } from "react"
import { Search } from "lucide-react"
import Sidebar from "@/components/Sidebar"
import UploadBox from "@/components/UploadBox"
import { gsap } from "gsap"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// Dummy medicine data
const medicines = [
  {
    id: 1,
    name: "Prenatal Multivitamin",
    usage: "Daily supplement for pregnant women",
    price: 24.99,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 2,
    name: "Folic Acid",
    usage: "Prevents neural tube defects",
    price: 12.5,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 3,
    name: "Iron Supplement",
    usage: "Prevents anemia during pregnancy",
    price: 15.75,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 4,
    name: "Calcium Citrate",
    usage: "Supports bone health for mother and baby",
    price: 18.99,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 5,
    name: "Omega-3 DHA",
    usage: "Supports baby brain development",
    price: 29.95,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 6,
    name: "Vitamin D3",
    usage: "Supports immune function and bone health",
    price: 14.5,
    image: "/placeholder.svg?height=200&width=200",
  },
]

export default function MedicineStore() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredMedicines, setFilteredMedicines] = useState(medicines)
  const pageRef = useRef(null)

  useEffect(() => {
    // Filter medicines based on search term
    const results = medicines.filter(
      (medicine) =>
        medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        medicine.usage.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredMedicines(results)
  }, [searchTerm])

  useEffect(() => {
    // Animation for page elements
    gsap.fromTo(
      ".page-anim",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: "power2.out" },
    )
  }, [])

  const handleUpload = (file) => {
    // Simulate OCR search - just set a random medicine name as search term
    const randomIndex = Math.floor(Math.random() * medicines.length)
    setTimeout(() => {
      setSearchTerm(medicines[randomIndex].name)
    }, 1000)
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
              <h2 className="text-xl font-semibold mb-4">Upload Prescription</h2>
              <UploadBox onUpload={handleUpload} label="Upload prescription for OCR search" />
            </div>
          </div>

          {/* Medicine Cards */}
          <div className="page-anim">
            <h2 className="text-xl font-semibold mb-4">Available Medicines</h2>
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

            {filteredMedicines.length === 0 && (
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
