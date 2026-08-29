import { v2 as cloudinary } from 'cloudinary'

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET
  )
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

export async function uploadImageBuffer(
  buffer: Buffer,
  folder: string,
  options?: { publicId?: string; overwrite?: boolean }
): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, public_id: options?.publicId, overwrite: options?.overwrite ?? true },
      (error, result) => {
        if (error || !result) return reject(error ?? new Error('Cloudinary upload returned no result.'))
        resolve(result.secure_url)
      }
    )
    stream.end(buffer)
  })
}
