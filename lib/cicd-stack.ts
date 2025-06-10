import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines'


export class CicdStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new CodePipeline(this, "cidepipelineid", {
        pipelineName: "cidepipelineid",
        synth: new ShellStep('Synth', {
            input: CodePipelineSource.gitHub('prakashpatil1430/cdk-project', 'stage'),
            commands:[
                'npm ci',
                'npx cdk synth'
            ]}
        )
    });



   
  }
}
