import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as blueprints from "@aws-quickstart/eks-blueprints";

blueprints.HelmAddOn.validateHelmVersions = true;

const addOns: Array<blueprints.ClusterAddOn> = [];

export class CaravelStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const stack = blueprints.EksBlueprint.builder()
      .account(props?.env?.account)
      .region(props?.env?.region)
      .version(this.node.tryGetContext("caravel.eks.version"))
      .addOns(...addOns)
      .useDefaultSecretEncryption(true)
      .build(scope, `${id}-stack`);
  }
}
