#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { CaravelStack } from "../lib/caravel-stack";

const app = new cdk.App();

const teamName = app.node.tryGetContext("caravel.eks.team");
const envName = app.node.tryGetContext("caravel.eks.env");
const appName = app.node.tryGetContext("caravel.eks.name");
const stackId = `${teamName}-${envName}-${appName}`;

new CaravelStack(app, stackId, {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
