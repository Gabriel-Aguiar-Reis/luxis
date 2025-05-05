import { BadRequestException, Injectable } from '@nestjs/common'
import { AppConfigService } from '@/shared/config/app-config.service'
import { v2 as cloudinary } from 'cloudinary'
import { Readable } from 'stream'

@Injectable()
export class CloudinaryService {
  constructor(private configService: AppConfigService) {
    cloudinary.config({
      cloud_name: this.configService.getCloudinaryCloudName(),
      api_key: this.configService.getCloudinaryApiKey(),
      api_secret: this.configService.getCloudinaryApiSecret()
    })
  }

  async uploadImage(
    file: Express.Multer.File,
    folder: string = 'products-models-images'
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          transformation: [
            { width: 500, height: 500, crop: 'fill' },
            { quality: 'auto:good' },
            { fetch_format: 'auto' },
            { compression: 'auto' },
            { strip: true }
          ]
        },
        (error, result) => {
          if (error) {
            reject(error)
          } else if (result?.secure_url) {
            resolve(result.secure_url)
          } else {
            reject(new BadRequestException('Failed to upload image'))
          }
        }
      )

      const stream = Readable.from(file.buffer)
      stream.pipe(uploadStream)
    })
  }

  async deleteImage(publicId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          reject(error)
        } else {
          resolve()
        }
      })
    })
  }
}
