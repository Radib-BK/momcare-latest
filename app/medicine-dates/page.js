"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2 } from "lucide-react"
import Sidebar from "@/components/Sidebar"
import UploadBox from "@/components/UploadBox"
import { gsap } from "gsap"

// Dummy medicine data
const initialMedicines = [
  {
    id: 1,
    name: "Prenatal Multivitamin",
    expiryDate: "2025-12-31",
    notes: "Take one tablet daily with food",
  },
  {
    id: 2,
    name: "Folic Acid",
    expiryDate: "2025-06-15",
    notes: "Take one tablet daily in the morning",
  },
  {
    id: 3,
    name: "Iron Supplement",
    expiryDate: "2024-09-20",
    notes: "Take with orange juice for better absorption",
  },
]

export default function MedicineDates() {
  const [medicines, setMedicines] = useState(initialMedicines)
  const [newMedicine, setNewMedicine] = useState({
    name: "",
    expiryDate: "",
    notes: "",
  })
  const [isAdding, setIsAdding] = useState(false)

  useEffect(() => {
    // Animation for page elements
    gsap.fromTo(
      ".page-anim",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: "power2.out" },
    )
  }, [])

  const handleUpload = (file) => {
    // Simulate OCR extraction - just add a random medicine
    setTimeout(() => {
      const randomMedicine = {
        id: Date.now(),
        name: "Detected Medicine",
        expiryDate: "2025-03-15",
        notes: "Automatically detected from prescription",
      }

      setMedicines([...medicines, randomMedicine])
    }, 1000)
  }

  const handleAddMedicine = (e) => {
    e.preventDefault()
    if (!newMedicine.name || !newMedicine.expiryDate) return

    const medicine = {
      id: Date.now(),
      ...newMedicine,
    }

    setMedicines([...medicines, medicine])
    setNewMedicine({ name: "", expiryDate: "", notes: "" })
    setIsAdding(false)
  }

  const handleDeleteMedicine = (id) => {
    setMedicines(medicines.filter((medicine) => medicine.id !== id))
  }

  // Sort medicines by expiry date (closest first)
  const sortedMedicines = [...medicines].sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate))

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <Sidebar />

      <div className="flex-1 ml-[70px] p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-deep-pink mb-8 page-anim">Medicine Dates</h1>

          {/* Input and Upload Section */}
          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="page-anim">
              <h2 className="text-xl font-semibold mb-4">Add Medicine Manually</h2>
              {!isAdding ? (
                <button
                  onClick={() => setIsAdding(true)}
                  className="flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                >
                  <Plus size={18} className="mr-2" />
                  Add New Medicine
                </button>
              ) : (
                <form onSubmit={handleAddMedicine} className="bg-white p-4 rounded-lg shadow-md">
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Medicine Name</label>
                    <input
                      type="text"
                      value={newMedicine.name}
                      onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                    <input
                      type="date"
                      value={newMedicine.expiryDate}
                      onChange={(e) => setNewMedicine({ ...newMedicine, expiryDate: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                      value={newMedicine.notes}
                      onChange={(e) => setNewMedicine({ ...newMedicine, notes: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                      rows={2}
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setIsAdding(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors"
                    >
                      Save
                    </button>
                  </div>
                </form>
              )}
            </div>

            <div className="page-anim">
              <h2 className="text-xl font-semibold mb-4">Upload Prescription</h2>
              <UploadBox onUpload={handleUpload} label="Upload prescription to extract medicine info" />
            </div>
          </div>

          {/* Medicine Table */}
          <div className="page-anim">
            <h2 className="text-xl font-semibold mb-4">Your Medicines</h2>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Medicine Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expiry Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Notes
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedMedicines.map((medicine) => {
                    const expiryDate = new Date(medicine.expiryDate)
                    const today = new Date()
                    const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24))
                    const isExpired = daysUntilExpiry < 0
                    const isExpiringSoon = daysUntilExpiry >= 0 && daysUntilExpiry <= 30

                    return (
                      <tr key={medicine.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{medicine.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div
                            className={`text-sm ${
                              isExpired
                                ? "text-red-600 font-medium"
                                : isExpiringSoon
                                  ? "text-amber-600 font-medium"
                                  : "text-gray-500"
                            }`}
                          >
                            {new Date(medicine.expiryDate).toLocaleDateString()}
                            {isExpired && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                Expired
                              </span>
                            )}
                            {isExpiringSoon && !isExpired && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                                Expiring soon
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500">{medicine.notes}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleDeleteMedicine(medicine.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>

              {medicines.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No medicines added yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
