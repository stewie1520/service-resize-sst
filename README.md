# 🏞️ SERVICE-RESIZE-SST
> A service to resize image on the fly, support caching and cloudfront, built with [sst.dev](https://sst.dev)
---
### Getting started

#### Requirements
- An AWS account with the AWS CLI configured locally

#### Script
```sh
npm run dev
```
The first time the SST command is run, you'll be prompted to enter a default stage name to use. The stage name will be stored locally in a .sst/ directory; it's automatically ignored from Git.

After a few minutes, you should see the output like this:

```
✔  Deployed:
   StorageStack
   cloudFrontDomain: <YOUR_DISTRIBUTION_DOMAIN>
   ImageResizingStack
   ApiEndpoint: https://<YOUR-API>.amazonaws.com
```

#### Handlers

This repo includes 2 handlers, the goal of this assignment is implemented in the second handler

##### Create presigned url to upload image

```sh
curl --location 'https://<YOUR-API>.amazonaws.com/presigned' \
--header 'Content-Type: application/json' \
--data-raw '{
    "filename": "astronaut-space-digital-art-4k-wallpaper-uhdpaper.com-700@1@k.jpg",
    "size": 1873046,
    "contentType": "image/jpg"
}'
```

Upload that image to the presigned url returned from the previous command

```sh
curl --location '<url>' \
--form 'Content-Type="image/jpg"' \
--form 'key="4893b24189e1093f/astronautspacedigitalart4kwallpaperuhdpaper.com7001k.jpg"' \
--form 'bucket="<bucket>"' \
--form 'X-Amz-Algorithm="AWS4-HMAC-SHA256"' \
--form 'X-Amz-Credential="<credentials>"' \
--form 'X-Amz-Date="20230705T192311Z"' \
--form 'X-Amz-Security-Token="<token>"' \
--form 'Policy="<policy>"' \
--form 'X-Amz-Signature="<signature>"' \
--form 'file=@"/path/to/file/astronaut-space-digital-art-4k-wallpaper-uhdpaper.com-700@1@k.jpg"'
```


##### Get resized image

After upload image successfully, just visit the url, for e.g:


```
https://<YOUR-API>.amazonaws.com/4893b24189e1093f/astronautspacedigitalart4kwallpaperuhdpaper.com7001k.jpg?width=100&height=100
```