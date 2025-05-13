"use client"

import { useState, useEffect } from "react"
import Sidebar from "@/components/Sidebar"
import UploadBox from "@/components/UploadBox"
import { gsap } from "gsap"

export default function SkinDiseaseClassification() {
  const [result, setResult] = useState(null)
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
    setResult(null)

    // Simulate analysis with a delay
    setTimeout(() => {
      const possibleResults = [
        { condition: "Eczema", confidence: 95 },
        { condition: "Contact Dermatitis", confidence: 87 },
        { condition: "Psoriasis", confidence: 92 },
        { condition: "Rosacea", confidence: 89 },
        { condition: "Melasma", confidence: 91 },
      ]

      const randomResult = possibleResults[Math.floor(Math.random() * possibleResults.length)]
      setResult(randomResult)
      setIsAnalyzing(false)

      // Animate the result appearance
      gsap.fromTo(".result-anim", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" })
    }, 2000)
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <Sidebar />

      <div className="flex-1 ml-[70px] p-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-deep-pink mb-8 page-anim">Skin Disease Classification</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Upload Section */}
            <div className="page-anim">
              <h2 className="text-xl font-semibold mb-4">Upload Skin Image</h2>
              <p className="text-gray-600 mb-4">Upload a clear image of the affected skin area for analysis.</p>
              <UploadBox onUpload={handleUpload} label="Upload skin image for analysis" />
            </div>

            {/* Results Section */}
            <div className="page-anim">
              <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>

              {isAnalyzing ? (
                <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
                  <div className="w-16 h-16 border-4 border-pink-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-600">Analyzing image...</p>
                </div>
              ) : result ? (
                <div className="bg-white rounded-lg shadow-md p-6 result-anim">
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Detected Condition</h3>
                    <p className="text-2xl font-bold text-pink-600">{result.condition}</p>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Confidence</h3>
                    <div className="relative pt-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xl font-semibold inline-block text-pink-600">{result.confidence}%</span>
                        </div>
                      </div>
                      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-pink-200">
                        <div
                          style={{ width: `${result.confidence}%` }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-pink-600"
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Recommendations</h3>
                    <ul className="list-disc pl-5 text-gray-600 space-y-1">
                      <li>Consult with a dermatologist for proper diagnosis</li>
                      <li>Avoid scratching the affected area</li>
                      <li>Keep the skin moisturized</li>
                      <li>Avoid potential irritants and allergens</li>
                    </ul>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500 italic">
                      Note: This is a preliminary analysis and should not replace professional medical advice.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 text-center">
                  <p className="text-gray-500">Upload an image to see analysis results</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
