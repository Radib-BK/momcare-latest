"use client"

import { useState, useRef, useEffect } from "react"
import { gsap } from "gsap"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, Camera, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import Sidebar from "@/components/Sidebar"
import { Playfair_Display } from "next/font/google"

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  display: 'swap',
})

export default function CalorieEstimatorPage() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)
  const pageRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".animate-in",
        { 
          y: 50, 
          opacity: 0,
          scale: 0.95
        },
        { 
          y: 0, 
          opacity: 1, 
          scale: 1,
          stagger: 0.1, 
          duration: 0.8, 
          ease: "back.out(1.7)" 
        }
      )
    }, pageRef)

    return () => ctx.revert()
  }, [])

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedFile(file)
        setError(null)
        setResult(null)
        
        // Create preview
        const reader = new FileReader()
        reader.onload = (e) => {
          setImagePreview(e.target.result)
        }
        reader.readAsDataURL(file)
      } else {
        setError("Please select a valid image file (JPG, PNG, etc.)")
      }
    }
  }

  const handleDragOver = (event) => {
    event.preventDefault()
  }

  const handleDrop = (event) => {
    event.preventDefault()
    const files = event.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (file.type.startsWith('image/')) {
        setSelectedFile(file)
        setError(null)
        setResult(null)
        
        const reader = new FileReader()
        reader.onload = (e) => {
          setImagePreview(e.target.result)
        }
        reader.readAsDataURL(file)
      } else {
        setError("Please select a valid image file (JPG, PNG, etc.)")
      }
    }
  }

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError("Please select an image first")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const response = await fetch(`http://localhost:8081/api/calorie-estimate`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to analyze image')
      }

      const data = await response.json()
      setResult(data)
      
      // Animate result appearance
      gsap.fromTo(
        ".result-animate",
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
      )
    } catch (err) {
      setError(err.message || 'An error occurred while analyzing the image')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setSelectedFile(null)
    setImagePreview(null)
    setResult(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 bg-gradient-to-b from-pink-50 to-white py-16 md:py-24 pl-[70px]" ref={pageRef}>
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12 animate-in">
            <h1 className={`text-4xl md:text-5xl font-bold text-deep-pink mb-6 ${playfair.className}`}>
              Calorie Estimator
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Upload an image of your food to estimate calories per 100 grams using AI-powered food recognition.
            </p>
          </div>

          {/* Upload Section */}
          <Card className="animate-in mb-8 rounded-2xl border-2 hover:border-pink-100 transition-all duration-300">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl text-gray-800">Upload Food Image</CardTitle>
              <CardDescription>
                Take a photo or upload an image of your food for instant calorie analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div
                className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-pink-300 transition-colors cursor-pointer"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*"
                  className="hidden"
                />
                
                {imagePreview ? (
                  <div className="space-y-4">
                    <img
                      src={imagePreview}
                      alt="Selected food"
                      className="max-w-full max-h-64 mx-auto rounded-lg shadow-md"
                    />
                    <p className="text-sm text-gray-600">
                      {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="mx-auto w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center">
                      <Upload className="w-8 h-8 text-pink-600" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-700 mb-2">
                        Drop your food image here or click to browse
                      </p>
                      <p className="text-sm text-gray-500">
                        Supports JPG, PNG, and other common image formats
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-6 justify-center items-center">
                <Button
                  onClick={handleSubmit}
                  disabled={!selectedFile || isLoading}
                  className="w-auto px-8 bg-pink-600 hover:bg-pink-700 text-white rounded-xl py-3 text-lg font-medium transition-all duration-200 hover:shadow-lg hover:shadow-pink-200"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Camera className="w-5 h-5 mr-2" />
                      Analyze
                    </>
                  )}
                </Button>
                
                {(selectedFile || result) && (
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="border-pink-200 hover:bg-pink-50 text-gray-700 rounded-xl py-3 text-lg font-medium"
                  >
                    Reset
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Error Display */}
          {error && (
            <Card className="animate-in mb-8 border-red-200 bg-red-50 rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 text-red-700">
                  <AlertCircle className="w-6 h-6" />
                  <p className="font-medium">{error}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results Section */}
          {result && (
            <Card className="result-animate border-green-200 bg-green-50 rounded-2xl">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl text-green-800">Analysis Complete!</CardTitle>
                <CardDescription className="text-green-700">
                  Here's what we found about your food
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Detected Food
                      </h3>
                      <p className="text-2xl font-bold text-gray-900">{result.food}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Calories per 100g
                      </h3>
                      <p className="text-3xl font-bold text-pink-600">{result.calories_per_100g}</p>
                      <p className="text-sm text-gray-500">kcal</p>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Confidence
                      </h3>
                      <p className="text-2xl font-bold text-gray-900">
                        {Math.round(result.confidence * 100)}%
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 text-center">
                      <strong>Note:</strong> This is an estimate based on AI food recognition. 
                      Actual calorie content may vary depending on preparation method, ingredients, and portion size.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* How it works section */}
          <Card className="animate-in mt-8 rounded-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-xl text-gray-800">How It Works</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-pink-600 font-bold text-lg">1</span>
                  </div>
                  <h3 className="font-medium text-gray-900">Upload Image</h3>
                  <p className="text-sm text-gray-600">Take a photo or upload an image of your food</p>
                </div>
                
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-pink-600 font-bold text-lg">2</span>
                  </div>
                  <h3 className="font-medium text-gray-900">AI Analysis</h3>
                  <p className="text-sm text-gray-600">Our AI identifies the food using advanced image recognition</p>
                </div>
                
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-pink-600 font-bold text-lg">3</span>
                  </div>
                  <h3 className="font-medium text-gray-900">Get Results</h3>
                  <p className="text-sm text-gray-600">Receive calorie estimates and nutritional insights</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 