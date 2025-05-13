"use client"

import { useState, useEffect } from "react"
import { FileText, AlertCircle } from "lucide-react"
import Sidebar from "@/components/Sidebar"
import UploadBox from "@/components/UploadBox"
import { gsap } from "gsap"

export default function PrescriptionAnalyzer() {
  const [extractedData, setExtractedData] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    // Animation for page elements
    gsap.fromTo(
      ".page-anim",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: "power2.out" },
    )
  }, [])

  const handleUpload = (file) => {
    setIsAnalyzing(true)
    setExtractedData(null)

    // Simulate prescription analysis with a delay
    setTimeout(() => {
      const mockPrescriptionData = {
        doctor: "Dr. Sarah Johnson",
        patient: "Jane Smith",
        date: "2025-05-10",
        medications: [
          {
            name: "Prenatal Multivitamin",
            dosage: "1 tablet",
            frequency: "Once daily",
            duration: "Throughout pregnancy",
            notes: "Take with food",
          },
          {
            name: "Folic Acid",
            dosage: "400mcg",
            frequency: "Once daily",
            duration: "12 weeks",
            notes: "Take in the morning",
          },
          {
            name: "Iron Supplement",
            dosage: "27mg",
            frequency: "Once daily",
            duration: "As directed",
            notes: "May cause constipation",
          },
        ],
        instructions: "Stay hydrated. Get adequate rest. Schedule follow-up in 4 weeks.",
      }

      setExtractedData(mockPrescriptionData)
      setIsAnalyzing(false)

      // Animate the result appearance
      gsap.fromTo(
        ".result-anim",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.5, ease: "power2.out" },
      )
    }, 2000)
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <Sidebar />

      <div className="flex-1 ml-[70px] p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-deep-pink mb-8 page-anim">Prescription Analyzer</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <div className="page-anim">
              <h2 className="text-xl font-semibold mb-4">Upload Prescription</h2>
              <p className="text-gray-600 mb-4">
                Upload a clear image of your prescription to extract and analyze the information.
              </p>
              <UploadBox onUpload={handleUpload} label="Upload prescription image" />

              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex">
                  <AlertCircle className="text-blue-500 mr-2 flex-shrink-0" size={20} />
                  <p className="text-sm text-blue-700">
                    For best results, ensure the prescription is well-lit and the text is clearly visible.
                  </p>
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="page-anim">
              <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>

              {isAnalyzing ? (
                <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
                  <div className="w-16 h-16 border-4 border-pink-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-600">Analyzing prescription...</p>
                </div>
              ) : extractedData ? (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="mb-6 result-anim">
                    <div className="flex items-center mb-4">
                      <FileText className="text-pink-600 mr-2" size={24} />
                      <h3 className="text-lg font-semibold">Prescription Details</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Doctor</p>
                        <p className="font-medium">{extractedData.doctor}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Patient</p>
                        <p className="font-medium">{extractedData.patient}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Date</p>
                        <p className="font-medium">{new Date(extractedData.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6 result-anim">
                    <h3 className="text-lg font-semibold mb-4">Medications</h3>
                    {extractedData.medications.map((med, index) => (
                      <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h4 className="font-medium text-pink-600">{med.name}</h4>
                        <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                          <div>
                            <span className="text-gray-500">Dosage:</span> {med.dosage}
                          </div>
                          <div>
                            <span className="text-gray-500">Frequency:</span> {med.frequency}
                          </div>
                          <div>
                            <span className="text-gray-500">Duration:</span> {med.duration}
                          </div>
                          <div>
                            <span className="text-gray-500">Notes:</span> {med.notes}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="result-anim">
                    <h3 className="text-lg font-semibold mb-2">Additional Instructions</h3>
                    <p className="text-gray-700 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      {extractedData.instructions}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-200 result-anim">
                    <p className="text-sm text-gray-500 italic">
                      Note: Always consult with your healthcare provider to confirm the accuracy of this analysis.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 text-center h-full flex flex-col justify-center">
                  <FileText className="mx-auto text-gray-400 mb-4" size={48} />
                  <p className="text-gray-500">Upload a prescription to see the extracted information</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
