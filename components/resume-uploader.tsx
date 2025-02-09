"use client"

import { useState } from "react"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

interface ResumeUploaderProps {
  onAnalysisComplete: (data: { onepager: string }) => void
}

export function ResumeUploader({ onAnalysisComplete }: ResumeUploaderProps) {
  const { toast } = useToast()
  const [isDragging, setIsDragging] = useState(false)
  const [fileName, setFileName] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleFileUpload = async (file: File) => {
    setFileName(file.name)
    setIsUploading(true)
    setProgress(0)

    const formData = new FormData()
    formData.append("file", file)

    try {
      const progressInterval = setInterval(() => {
        setProgress((prev) => (prev >= 90 ? 90 : prev + 10))
      }, 500)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const data = await response.json()
      if (!data.onepager) {
        throw new Error("No analysis data received")
      }

      toast({
        title: "Success",
        description: "Resume analyzed successfully!",
      })

      onAnalysisComplete(data)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error 
          ? error.message 
          : "Failed to analyze resume. Please try again.",
      })
    } finally {
      setIsUploading(false)
      setProgress(0)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-4">
            <div className={`border-2 border-dashed rounded-lg p-8 text-center ${
              isDragging ? "border-primary bg-accent" : "border-border"
            }`}>
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground mb-2">
                Select your resume to analyze
              </p>
              <input
                type="file"
                accept=".pdf"
                className="hidden"
                id="resume-upload"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFileUpload(file)
                }}
              />
              <label 
                htmlFor="resume-upload"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 cursor-pointer"
              >
                Choose PDF File
              </label>
              {fileName && (
                <p className="mt-2 text-sm text-primary">Selected: {fileName}</p>
              )}
            </div>

            {isUploading && (
              <Progress value={progress} className="h-2" />
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 