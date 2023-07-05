export class CloudFrontUtil {
  static async getUrl(s3Key: string) {
    return `https://${process.env.CLOUDFRONT_DOMAIN}/${s3Key}`
  }
}
