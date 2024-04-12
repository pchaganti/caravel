import { ArnPrincipal } from "aws-cdk-lib/aws-iam";

import { PlatformTeam } from "@aws-quickstart/eks-blueprints";
import { Construct } from "constructs";

export class TeamPlatform extends PlatformTeam {
  constructor(scope: Construct) {
    super({
      name: "platform",
      users: [
        new ArnPrincipal(
          `arn:aws:iam::${
            process.env.CDK_DEFAULT_ACCOUNT
          }:user/${scope.node.tryGetContext(
            "caravel.eks.teams.platform.users"
          )}`
        ),
      ],
      teamManifestDir: "./lib/teams/team-platform/",
    });
  }
}
