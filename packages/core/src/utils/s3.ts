import S3Client from "aws-sdk/clients/s3";
import { Bucket } from "sst/node/bucket";

const EXPIRE_SECONDS = 15 * 60
const METADATA_SIZE = 2 * 1024 * 1024

const s3 = new S3Client({})

export class S3Utils {
  static createPresignedUrl = (params: { key: string, contentType: string, size: number }) => {
    return new Promise((resolve, reject) => {
      s3.createPresignedPost({
        Bucket: Bucket["papaya-bucket"].bucketName,
        Expires: EXPIRE_SECONDS,
        Fields: {
          key: params.key,
        },
        Conditions: [
          ["starts-with", "$Content-Type", params.contentType],
          ["content-length-range", 0, params.size + METADATA_SIZE] // 2mb for metadata
        ]
      }, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

  static getMetadata = (key: string): Promise<S3Client.HeadObjectOutput | null> => {
    return new Promise((resolve, reject) => {
      s3.headObject({
        Bucket: Bucket["papaya-bucket"].bucketName,
        Key: key,
      }, (err, data) => {
        if (err) {
          resolve(null)
        } else {
          resolve(data)
        }
      })
    })
  }

  static async getObject(key: string) {
    const object = await s3.getObject({
      Bucket: Bucket["papaya-bucket"].bucketName,
      Key: key,
    }).promise()

    if (!object.Body) {
      throw new Error("Object not found")
    }

    return object
  }

  static async putObject(params: { key: string, body: Buffer, contentType?: string }) {
    return s3.putObject({
      Bucket: Bucket["papaya-bucket"].bucketName,
      Key: params.key,
      Body: params.body,
      ContentType: params.contentType,
    }).promise()
  }
}