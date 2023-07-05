import { redirectHandler } from "@service-resize-sst/core/handler";
import { CloudFrontUtil, S3Utils, makeFilenameWithSize } from "@service-resize-sst/core/utils";
import sharp, { FormatEnum } from "sharp";
import { z } from "zod";

/**
 * This function is responsible for resizing an image and redirecting to the resized image.
 * It won't resize the image if it has already been resized.
 */
export const main = redirectHandler(async (event) => {
  const { width, height } = QueryValidationSchema.parse(event.queryStringParameters)

  const key = KeyValidationSchema.parse(event.pathParameters?.key)
  const keyWithSize = makeFilenameWithSize({ filename: key, width, height })

  const resizedFileMetadata = await S3Utils.getMetadata(keyWithSize)
  if (resizedFileMetadata) {
    return CloudFrontUtil.getUrl(keyWithSize)
  }

  const originFileObject = await S3Utils.getObject(key)

  const format = (originFileObject.ContentType?.split("/")[1] || "png") as keyof FormatEnum

  const resizedBuffer = await sharp(originFileObject.Body as Buffer)
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