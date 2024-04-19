import * as digitalocean from "@pulumi/digitalocean";
import * as pulumi from "@pulumi/pulumi";
import * as docker from "@pulumi/docker";

const websiteImage = new docker.Image("website", {
  build: {
    context: "/Users/taradruffel/.workspace/HomePage/.",
    dockerfile: "/Users/taradruffel/.workspace/HomePage/Dockerfile",
    platform: "linux/amd64",
  },
  imageName: pulumi.interpolate`registry.digitalocean.com/tarareg/website`,
  skipPush: false,
});

// Create a DigitalOcean App that uses an image from the DigitalOcean Container Registry
const app = new digitalocean.App("my-app", {
  spec: {
    name: "my-app",
    region: "fra1", // specify the region for the app
    services: [
      {
        name: "my-service",
        image: {
          // Replace with your registry name, repository, and image tag
           repository: "website",
            registryType: "DOCR", // or use "PRIVATE" for DigitalOcean Container Registry
          deployOnPushes: [
            {
              enabled: true,
            },
          ],
        },
        httpPort: 8080, // the port that your app listens on
        // You can specify other properties like environment variables, instance size, etc.
      },
    ],
    // Define other components like databases, workers, or static sites if needed
  },
}, {dependsOn: websiteImage});

// Export the live URL of the app
export const liveUrl = app.liveUrl;
