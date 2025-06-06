"use client"

import { useState, useEffect, useRef } from "react"
import { FileText, AlertCircle, RotateCcw, Copy } from "lucide-react"
import Sidebar from "@/components/Sidebar"
import UploadBox from "@/components/UploadBox"
import { gsap } from "gsap"
import Cropper from "react-easy-crop"
import getCroppedImg from "./utils/cropImage" // We'll define this helper below

export default function PrescriptionAnalyzer() {
  const [extractedData, setExtractedData] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [rotation, setRotation] = useState(0)
  const [cropped, setCropped] = useState(false)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const imageRef = useRef(null)
  const [copied, setCopied] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedText, setEditedText] = useState("")

  useEffect(() => {
    gsap.fromTo(
      ".page-anim",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: "power2.out" },
    )
  }, [])

  // Handle crop complete from Cropper
  const onCropComplete = (_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }

  // Handle image cropping (with react-easy-crop)
  const handleCrop = async () => {
    if (!selectedImage || !croppedAreaPixels) return
    const croppedFile = await getCroppedImg(
      URL.createObjectURL(selectedImage),
      croppedAreaPixels
    )
    setSelectedImage(croppedFile)
    setCropped(true)
  }

  // Handle image rotation
  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360)
  }

  // Handle file upload from UploadBox
  const handleUploadBox = (file) => {
    setSelectedImage(file)
    setRotation(0)
    setCropped(false)
    setExtractedData(null)
  }

  // Handle actual upload to backend
  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    setExtractedData(null)
    try {
      const formData = new FormData()
      formData.append("files", selectedImage, selectedImage.name)
      formData.append("query", "What is in the image. Give extracted texts. Don't add any extra word. If not a paper, say 'Please provide a prescription'. Just give output. /OCR.")
      formData.append("context", "")

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API?.trim() 
      const res = await fetch(`${backendUrl}/api/nlp/prescription_analyze`, {
        method: "POST",
        body: formData,
      })

      if (!res.ok) throw new Error("Failed to analyze prescription")
      const data = await res.json()

      setExtractedData(data.answer || "")
    } catch (e) {
      setExtractedData("")
    } finally {
      setIsAnalyzing(false)
      gsap.fromTo(
        ".result-anim",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.5, ease: "power2.out" },
      )
    }
  }

  // Copy analyzed output
  const handleCopy = () => {
    const textToCopy = isEditing ? editedText : extractedData
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }
  }

  // Save edited text
  const handleSave = () => {
    setExtractedData(editedText)
    setIsEditing(false)
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
              <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex">
                  <AlertCircle className="text-blue-500 mr-2 flex-shrink-0" size={20} />
                  <p className="text-sm text-blue-700">
                    For best results, ensure the prescription is well-lit and the text is clearly visible.
                  </p>
                </div>
              </div>
              <UploadBox onUpload={handleUploadBox} label="Upload prescription image" />

              {selectedImage && (
                <div className="mt-4">
                  <div className="relative w-[300px] h-[300px] mx-auto mb-2 bg-gray-100 rounded">
                    <Cropper
                      image={URL.createObjectURL(selectedImage)}
                      crop={crop}
                      zoom={zoom}
                      aspect={1}
                      onCropChange={setCrop}
                      onZoomChange={setZoom}
                      onCropComplete={onCropComplete}
                      rotation={rotation}
                    />
                  </div>
                  <div className="flex gap-2 mb-2">
                    <button
                      className="flex items-center px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 text-sm"
                      onClick={handleRotate}
                      type="button"
                    >
                      <RotateCcw className="mr-1" size={16} /> Rotate
                    </button>
                    <button
                      className="flex items-center px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 text-sm"
                      onClick={handleCrop}
                      type="button"
                    >
                      ✂️ Crop
                    </button>
                    <input
                      type="range"
                      min={1}
                      max={3}
                      step={0.1}
                      value={zoom}
                      onChange={e => setZoom(Number(e.target.value))}
                      className="ml-2"
                      style={{ width: 100 }}
                    />
                  </div>
                  <button
                    className="mt-2 px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700"
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    type="button"
                  >
                    Analyze Prescription
                  </button>
                </div>
              )}

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
                  <div className="result-anim">
                    <div className="flex items-center mb-4">
                      <FileText className="text-pink-600 mr-2" size={24} />
                      <h3 className="text-lg font-semibold">Extracted Text</h3>
                      <button
                        className="ml-auto flex items-center px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 text-sm mr-2"
                        onClick={handleCopy}
                        type="button"
                      >
                        <Copy className="mr-1" size={16} />
                        {copied ? "Copied!" : "Copy"}
                      </button>
                      {isEditing ? (
                        <>
                          <button
                            className="flex items-center px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 text-sm mr-2"
                            onClick={() => setIsEditing(false)}
                            type="button"
                          >
                            Cancel
                          </button>
                          <button
                            className="flex items-center px-2 py-1 bg-pink-600 text-white rounded hover:bg-pink-700 text-sm"
                            onClick={handleSave}
                            type="button"
                          >
                            Save
                          </button>
                        </>
                      ) : (
                        <button
                          className="flex items-center px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 text-sm"
                          onClick={() => {
                            setIsEditing(true)
                            setEditedText(extractedData)
                          }}
                          type="button"
                        >
                          Edit
                        </button>
                      )}
                    </div>
                    {isEditing ? (
                      <textarea
                        className="w-full min-h-[180px] text-gray-700 p-3 bg-gray-50 rounded-lg border border-gray-200 whitespace-pre-wrap"
                        value={editedText}
                        onChange={e => setEditedText(e.target.value)}
                      />
                    ) : (
                      <pre className="text-gray-700 p-3 bg-gray-50 rounded-lg border border-gray-200 whitespace-pre-wrap">
                        {extractedData}
                      </pre>
                    )}
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
