import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as blueprints from "@aws-quickstart/eks-blueprints";
import * as team from "./teams";

const addOns: Array<blueprints.ClusterAddOn> = [];

export class CaravelStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    blueprints.HelmAddOn.validateHelmVersions = this.node.tryGetContext(
      "caravel.eks.default.validate.helm.versions"
    );

    enableClusterAddons(this);
    const devTeam = new team.TeamDev(scope);

    const stack = blueprints.EksBlueprint.builder()
      .account(props?.env?.account)
      .region(props?.env?.region)
      .version(this.node.tryGetContext("caravel.eks.version"))
      .addOns(...addOns)
      .teams(devTeam)
      .useDefaultSecretEncryption(true)
      .build(scope, `${id}-stack`);
  }
}

function enableClusterAddons(scope: Construct) {
  if (scope.node.tryGetContext("caravel.eks.addons")["argo-cd"]["enabled"]) {
    addOns.push(new blueprints.addons.ArgoCDAddOn());
  }

  if (
    scope.node.tryGetContext("caravel.eks.addons")["metrics-server"]["enabled"]
  ) {
    addOns.push(new blueprints.addons.MetricsServerAddOn());
  }

  if (scope.node.tryGetContext("caravel.eks.addons")["core-dns"]["enabled"]) {
    addOns.push(new blueprints.addons.CoreDnsAddOn());
  }

  if (scope.node.tryGetContext("caravel.eks.addons")["kube-proxy"]["enabled"]) {
    addOns.push(new blueprints.addons.KubeProxyAddOn());
  }

  if (scope.node.tryGetContext("caravel.eks.addons")["vpc-cni"]["enabled"]) {
    addOns.push(new blueprints.addons.VpcCniAddOn());
  }
}
