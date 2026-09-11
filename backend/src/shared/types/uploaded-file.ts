export interface UploadedFile {
  fieldname?: string
  originalname?: string
  encoding?: string
  mimetype?: string
  buffer?: Buffer
  size?: number
  destination?: string
  filename?: string
  path?: string
  stream?: NodeJS.ReadableStream
}
