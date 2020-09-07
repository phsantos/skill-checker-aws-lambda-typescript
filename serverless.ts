import type { Serverless } from "serverless/aws";

const serverlessConfiguration: Serverless = {
  service: {
    name: "skillChecker-aws-lambda-typescript",
    // app and org for use with dashboard.serverless.com
    // app: your-app-name,
    // org: your-org-name,
  },
  frameworkVersion: ">=1.72.0",
  custom: {
    webpack: {
      webpackConfig: "./webpack.config.js",
      includeModules: true,
    },
  },
  // Add the serverless-webpack plugin
  plugins: ["serverless-webpack"],
  provider: {
    name: "aws",
    runtime: "nodejs12.x",
    region: "sa-east-1",
    memorySize: 256,
    apiGateway: {
      minimumCompressionSize: 256,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
    },
  },
  functions: {
    skillChecker: {
      handler: "handler.skillChecker",
      events: [
        {
          http: {
            method: "post",
            path: "skillChecker",
            cors: true,
          },
        },
      ],
    },
  },
};

module.exports = serverlessConfiguration;
