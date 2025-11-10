import { apiFetch } from '@/lib/api-client'
import { apiPaths } from '@/lib/api-paths'
import { useState } from 'react'
// https://res.cloudinary.com/debjroorl/image/upload/v1754365472/product-models/lh4yefatenbb9rfr6lq5.jpg
export type CloudinarySignature = {
  timestamp: number
  folder: string
  signature: string
  expiresAt: number
}

export type CloudinaryUploadResponse = {
  api_key: string
  asset_folder: string
  asset_id: string
  bytes: number
  created_at: string
  display_name: string
  etag: string
  format: string
  height: number
  original_extension: string
  original_filename: string
  placeholder: boolean
  public_id: string
  resource_type: string
  secure_url: string
  signature: string
  tags: string[]
  type: string
  url: string
  version: number
  version_id: string
  width: number
}

export async function fetchCloudinarySignature(): Promise<CloudinarySignature> {
  return await apiFetch<CloudinarySignature>(
    apiPaths.productModels.cloudinarySignature,
    {},
    true,
    'GET'
  )
}

export async function uploadImageToCloudinary(
  file: File,
  signature: CloudinarySignature
): Promise<CloudinaryUploadResponse> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '')
  formData.append('timestamp', signature.timestamp.toString())
  formData.append('signature', signature.signature)
  formData.append('folder', signature.folder)

  return await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData
    }
  ).then((response) => {
    if (!response.ok) {
      throw new Error('Failed to upload image')
    }
    return response.json() as Promise<CloudinaryUploadResponse>
  })
}

export function useCloudinaryUpload() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [url, setUrl] = useState<string | null>(null)

  const upload = async (file: File) => {
    setLoading(true)
    setError(null)
    setUrl(null)
    try {
      const signature = await fetchCloudinarySignature()
      const image = await uploadImageToCloudinary(file, signature)
      setUrl(image.secure_url)
      return image.secure_url
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer upload')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { upload, loading, error, url }
}
