import { SSTConfig } from "sst";
import { ImageResizingStack } from "./stacks/ImageResizingStack";
import { StorageStack } from "./stacks/StorageStack";

export default {
  config() {
    return {
      name: "service-resize-sst",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(StorageStack).stack(ImageResizingStack);
  },
} satisfies SSTConfig;
