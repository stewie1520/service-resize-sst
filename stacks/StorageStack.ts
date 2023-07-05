import { Bucket, StackContext } from "sst/constructs";
import * as cdk from "aws-cdk-lib";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as cloudfrontOrigins from "aws-cdk-lib/aws-cloudfront-origins";

export function StorageStack({ stack }: StackContext) {
  const bucket = new Bucket(stack, "papaya-bucket", {
    cdk: {
      bucket: {
        autoDeleteObjects: true,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      },
    },
  });

  const distribution = new cloudfront.Distribution(stack, "papaya-distribution", {
    defaultBehavior: {
      origin: new cloudfrontOrigins.S3Origin(bucket.cdk.bucket),
    },
  })

  const cloudFrontDomain = distribution.domainName

  stack.addOutputs({
    cloudFrontDomain,
  });

  return {
    bucket,
    cloudFrontDomain, 
  }
}