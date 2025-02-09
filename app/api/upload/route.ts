import { NextResponse } from 'next/server'
import { Buffer } from 'buffer'
// Import the specific file to avoid test files
import pdfParse from 'pdf-parse/lib/pdf-parse.js'

const TOGETHER_API_URL = 'https://api.together.xyz/v1/chat/completions'
const MAX_TEXT_LENGTH = 12000 // About 3000 tokens, leaving room for the prompt

export async function POST(request: Request) {
  console.log("API route hit")
  
  try {
    const formData = await request.formData()
    console.log("FormData received")
    
    const file = formData.get('file') as File
    console.log("File received:", file?.name)
    
    if (!file) {
      console.log("No file uploaded")
      return NextResponse.json(
        { message: "No file uploaded" },
        { status: 400 }
      )
    }

    try {
      // Convert File to Buffer
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      
      // Parse PDF with specific options to avoid test files
      const pdfData = await pdfParse(buffer, {
        version: 'default',
        max: 0,
        throwOnDataLength: false
      })
      
      const extractedText = pdfData.text
      console.log("Extracted PDF text:", extractedText)
      
      // Generate the one-pager using Together.ai
      console.log("Generating one-pager...")
      const onepager = await generateOnepager(extractedText)
      console.log("Generated onepager:", onepager)

      return NextResponse.json({
        success: true,
        onepager,
        truncated: extractedText.length > MAX_TEXT_LENGTH
      })
    } catch (error: any) {
      console.error("Error:", error)
      return NextResponse.json(
        { 
          message: "Error processing file", 
          error: error.message 
        },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error("Error:", error)
    return NextResponse.json(
      { message: "Error processing file" },
      { status: 500 }
    )
  }
}

async function generateOnepager(resumeText: string) {
  const prompt = `Extract and list the most important keywords and information from this resume. 
  Focus on technical skills, experience, and achievements. Be specific and concise.

  Resume: ${resumeText}`

  try {
    const response = await fetch(TOGETHER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000,
        temperature: 0.7,
        top_p: 0.7,
        top_k: 50,
        repetition_penalty: 1,
        stop: ["<|eot_id|>", "<|eom_id|>"]
      })
    })

    if (!response.ok) {
      throw new Error('API request failed')
    }

    const data = await response.json()
    return data.choices[0].message.content.trim()
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
} 