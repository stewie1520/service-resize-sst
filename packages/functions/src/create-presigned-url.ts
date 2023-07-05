import { z } from "zod";

import { jsonHandler } from "@service-resize-sst/core/handler"
import { cleanAndGenerateRandomPath, S3Utils } from "@service-resize-sst/core/utils"

const MAX_FILE_SIZE = 5 * 1024 * 1024

/**
 * This function is responsible for creating a presigned URL that can be used to upload a file to S3.
 */
export const main = jsonHandler(async (event) => {
  const { filename, size, contentType } = ValidationSchema.parse(
    JSON.parse(event.body || "")
  )

  const safeFilename = cleanAndGenerateRandomPath(filename)

  const presignedUrl = await S3Utils.createPresignedUrl({
    key: safeFilename,
    contentType,
    size,
  })

  return presignedUrl
})

const ValidationSchema = z.object({
  filename: z.string().min(1).max(255),
  size: z.number().min(0).max(MAX_FILE_SIZE),
  contentType: z.enum(["image/png", "image/jpeg", "image/jpg"]),
})