import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Bucket } from 'aws-cdk-lib/aws-s3';

export class StorageStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new Bucket(this, 'MyS3Bucket', {
      bucketName: 'webapp-bucket-22222222',
      lifecycleRules: [{
        expiration: cdk.Duration.days(2),
      }],
    });
  }
}
