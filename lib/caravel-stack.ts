import * as eks from "aws-cdk-lib/aws-eks";
import { Construct } from "constructs";
import * as blueprints from "@aws-quickstart/eks-blueprints";
import * as team from "./teams";
import { Stack, StackProps } from "aws-cdk-lib";

const addOns: Array<blueprints.ClusterAddOn> = [];

export class CaravelStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    blueprints.HelmAddOn.validateHelmVersions = this.node.tryGetContext(
      "caravel.eks.default.validate.helm.versions"
    );

    enableClusterAddons(this);
    const devTeam = new team.TeamDev(scope, this.account);
    const platformTeam = new team.TeamPlatform(scope, this.account);

    const fargateProfiles: Map<string, eks.FargateProfileOptions> = new Map([
      ["ion", { selectors: [{ namespace: "ion" }] }],
    ]);

    const fargateClusterProvider = new blueprints.FargateClusterProvider({
      fargateProfiles,
    });

    const stack = blueprints.EksBlueprint.builder()
      .account(this.account)
      .clusterProvider(fargateClusterProvider)
      .region(props?.env?.region)
      .version(this.node.tryGetContext("caravel.eks.version"))
      .addOns(...addOns)
      .teams(devTeam, platformTeam)
      .useDefaultSecretEncryption(true)
      .build(scope, `${id}-stk`);
  }
}

function enableClusterAddons(scope: Construct) {
  if (scope.node.tryGetContext("caravel.eks.addons")["vpc-cni"]["enabled"]) {
    addOns.push(new blueprints.addons.VpcCniAddOn());
  }
  if (
    scope.node.tryGetContext("caravel.eks.addons")[
      "aws-load-balancer-controller"
    ]["enabled"]
  ) {
    addOns.push(new blueprints.addons.AwsLoadBalancerControllerAddOn());
  }

  if (scope.node.tryGetContext("caravel.eks.addons")["nginx"]["enabled"]) {
    addOns.push(new blueprints.addons.NginxAddOn());
  }

  if (
    scope.node.tryGetContext("caravel.eks.addons")["metrics-server"]["enabled"]
  ) {
    addOns.push(new blueprints.addons.MetricsServerAddOn());
  }
  if (scope.node.tryGetContext("caravel.eks.addons")["argo-cd"]["enabled"]) {
    addOns.push(new blueprints.addons.ArgoCDAddOn());
  }
}
