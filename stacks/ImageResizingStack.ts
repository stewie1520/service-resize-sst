import { Api, StackContext, use } from "sst/constructs";
import { StorageStack } from "./StorageStack";

export function ImageResizingStack({ stack }: StackContext) {
  const { bucket, cloudFrontDomain } = use(StorageStack)

  const api = new Api(stack, "Api", {
    routes: {
      "POST /presigned": "packages/functions/src/create-presigned-url.main",
      "GET /{key+}": "packages/functions/src/get-resized-image.main",
    },
    defaults: {
      function: {
        bind: [bucket],
        environment: {
          CLOUDFRONT_DOMAIN: cloudFrontDomain,
        },
      },
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
