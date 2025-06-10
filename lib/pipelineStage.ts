import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Stage, StageProps} from 'aws-cdk-lib';
import { LambdaStack } from "../lib/LambdaStack"



export class pipelineStage extends Stage{
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    new LambdaStack(this, "LambdaStack", {
        stageName: props?.stageName
    })

    
  }
}