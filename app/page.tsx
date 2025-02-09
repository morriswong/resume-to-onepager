"use client"

import { useState } from "react"
import { ResumeUploader } from "@/components/resume-uploader"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent } from "@/components/ui/card"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface AnalysisData {
  onepager: string
}

export default function HomePage() {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null)

  const handleAnalysisComplete = (data: AnalysisData) => {
    console.log("Analysis data received:", data)
    setAnalysisData(data)
  }

  const formatContent = (content: string) => {
    let elements: JSX.Element[] = []
    let currentList: JSX.Element[] = []
    let inList = false

    const lines = content.split('\n').map(line => line.trim()).filter(Boolean)

    lines.forEach((line, i) => {
      // Main section headers
      if (['What I Love and Hate Doing', 'Must-Haves', 'Must-Nots', 'Key Strengths', 'Career Goals', 'Market Fit'].includes(line)) {
        if (inList) {
          elements.push(<ul key={`list-${i}`} className="mb-4">{currentList}</ul>)
          currentList = []
          inList = false
        }
        elements.push(
          <h2 key={i} className="text-2xl font-bold mt-8 mb-4">
            {line}
          </h2>
        )
        return
      }

      // Subsection headers (Love: and Hate:)
      if (line.endsWith(':')) {
        if (inList) {
          elements.push(<ul key={`list-${i}`} className="mb-4">{currentList}</ul>)
          currentList = []
          inList = false
        }
        elements.push(
          <h3 key={i} className="font-semibold mt-4 mb-2">
            {line}
          </h3>
        )
        return
      }

      // List items
      if (line.startsWith('- ')) {
        inList = true
        currentList.push(
          <li key={i} className="ml-6 list-disc">
            {line.slice(2)}
          </li>
        )
        return
      }

      // Regular text (Market Fit section)
      if (!line.startsWith('- ')) {
        if (inList) {
          elements.push(<ul key={`list-${i}`} className="mb-4">{currentList}</ul>)
          currentList = []
          inList = false
        }
        elements.push(<p key={i} className="mt-2">{line}</p>)
      }
    })

    if (inList && currentList.length > 0) {
      elements.push(<ul key="final-list" className="mb-4">{currentList}</ul>)
    }

    return elements
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">CareerFit</h1>
        <p className="text-muted-foreground mb-8">
          Find your <span className="font-semibold">Candidate Market Fit</span> from your resume in{" "}
          <span className="font-semibold">one click!</span>
        </p>

        <ResumeUploader onAnalysisComplete={handleAnalysisComplete} />

        {analysisData?.onepager && (
          <Card className="mt-8">
            <CardContent className="pt-6">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                className="prose dark:prose-invert max-w-none"
              >
                {analysisData.onepager}
              </ReactMarkdown>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  )
} 