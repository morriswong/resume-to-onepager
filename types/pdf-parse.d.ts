declare module 'pdf-parse/lib/pdf-parse.js' {
  interface PDFParseOptions {
    version?: string
    max?: number
    throwOnDataLength?: boolean
  }

  interface PDFParseResult {
    text: string
    numpages: number
    info: any
    metadata: any
    version: string
  }

  function pdfParse(dataBuffer: Buffer, options?: PDFParseOptions): Promise<PDFParseResult>
  export default pdfParse
} 