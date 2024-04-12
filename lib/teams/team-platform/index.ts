import { ArnPrincipal } from "aws-cdk-lib/aws-iam";

import { PlatformTeam } from "@aws-quickstart/eks-blueprints";
import { Construct } from "constructs";

export class TeamPlatform extends PlatformTeam {
  constructor(scope: Construct, accountID?: string) {
    super({
      name: "platform",
      users: [
        new ArnPrincipal(
          `arn:aws:iam::${accountID}:user/${scope.node.tryGetContext(
            "caravel.eks.teams.platform.users"
          )}`
        ),
      ],
      teamManifestDir: "./lib/teams/team-platform/",
    });
  }
}
