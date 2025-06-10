import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines'
import { pipelineStage } from './pipelineStage';


export class CicdStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, "cidepipelineid", {
        pipelineName: "cidepipelineid",
        synth: new ShellStep('Synth', {
            input: CodePipelineSource.gitHub('prakashpatil1430/cdk-project', 'stage'),
            commands:[
                'npm ci',
                'npx cdk synth'
            ]}
        )
    });

    const teststage = pipeline.addStage(new pipelineStage(this, 'NewPipelineteststage', {
        stageName: "test"
    }))



   
  }
}
