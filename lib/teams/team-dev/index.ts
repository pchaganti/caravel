import { ArnPrincipal } from "aws-cdk-lib/aws-iam";

import { ApplicationTeam } from "@aws-quickstart/eks-blueprints";
import { Construct } from "constructs";

export class TeamDev extends ApplicationTeam {
  constructor(scope: Construct) {
    super({
      name: "development",
      users: [
        new ArnPrincipal(
          `arn:aws:iam::${
            process.env.CDK_DEFAULT_ACCOUNT
          }:user/${scope.node.tryGetContext(
            "caravel.eks.teams.dev.users"
          )}`
        ),
      ],
      teamManifestDir: "./lib/teams/team-dev/",
    });
  }
}
