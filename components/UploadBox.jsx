"use client"

import { useState, useRef } from "react"
import { Upload, X, Check } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function UploadBox({ onUpload, label = "Upload Image" }) {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState("")
  const fileInputRef = useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file) => {
    setFile(file)

    // Create preview
    const reader = new FileReader()
    reader.onload = () => {
      setPreview(reader.result)
    }
    reader.readAsDataURL(file)

    // Call the onUpload callback if provided
    if (onUpload) {
      onUpload(file)
    }
  }

  const clearFile = () => {
    setFile(null)
    setPreview("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {!file ? (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragging ? "border-pink-500 bg-pink-50" : "border-gray-300 hover:border-pink-400"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm font-medium text-gray-900">{label}</p>
          <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
          <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileInput} />
        </div>
      ) : (
        <Card className="overflow-hidden">
          <div className="relative">
            <img src={preview || "/placeholder.svg"} alt="Preview" className="w-full h-48 object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <Button
                onClick={clearFile}
                variant="destructive"
                size="icon"
                className="rounded-full"
                aria-label="Remove file"
              >
                <X size={20} />
              </Button>
            </div>
          </div>
          <CardContent className="p-3 bg-gray-50 flex items-center">
            <Check size={16} className="text-green-500 mr-2" />
            <span className="text-sm font-medium truncate flex-1">{file.name}</span>
            <span className="text-xs text-gray-500">{(file.size / 1024).toFixed(0)} KB</span>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
