import { redirectHandler } from "@service-resize-sst/core/handler";
import { S3Utils, makeFilenameWithSize,  CloudFrontUtil } from "@service-resize-sst/core/utils";
import { z } from "zod";
import sharp, { FormatEnum } from "sharp";

export const main = redirectHandler(async (event) => {
  const { width, height } = QueryValidationSchema.parse(event.queryStringParameters)

  const key = KeyValidationSchema.parse(event.pathParameters?.key)
  const keyWithSize = makeFilenameWithSize({ filename: key, width, height })

  const resizedFileMetadata = await S3Utils.getMetadata(keyWithSize)
  if (resizedFileMetadata) {
    return CloudFrontUtil.getUrl(keyWithSize)
  }

  const originFileObject = await S3Utils.getObject(key)
  let body = originFileObject.Body as any
  if (!body) {
    throw new Error('File not found')
  }

  const format = (originFileObject.ContentType?.split('/')[1] || 'png') as keyof FormatEnum

  const resizedBuffer = await sharp(body)
    .resize(width, height)
    .toFormat(format)
    .toBuffer()

  await S3Utils.putObject({
    key: keyWithSize,
    body: resizedBuffer,
    contentType: originFileObject.ContentType,
  })

  return CloudFrontUtil.getUrl(keyWithSize)
})

const QueryValidationSchema = z.object({
  width: z.preprocess(
    (w) => parseInt(z.string().parse(w), 10),
    z.number().positive().min(1)),
  height: z.preprocess(
      (h) => parseInt(z.string().parse(h), 10),
      z.number().positive().min(1)),
})

const KeyValidationSchema = z.string().min(1).max(255)