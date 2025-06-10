import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { readFileSync } from 'fs';

interface ComputeStackProps extends cdk.StackProps {
  vpc: ec2.Vpc;
  securityGroup: ec2.SecurityGroup;
}

export class ComputeStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ComputeStackProps) {
    super(scope, id, props);

    const { vpc, securityGroup } = props;

    const rootVolume: ec2.BlockDevice = {
      deviceName: '/dev/xvda',
      volume: ec2.BlockDeviceVolume.ebs(10),
    };

    const keyPairName = 'webapp-key-pair'; 

    const instance = new ec2.Instance(this, 'WebServerInstance', {
      vpc,
      securityGroup,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      machineImage: ec2.MachineImage.latestAmazonLinux2(),
      blockDevices: [rootVolume],
      keyName: keyPairName,
      availabilityZone: vpc.availabilityZones[4],
    });

    // Load user data script from file
    const userDataScript = readFileSync('./lib/user-data.sh', 'utf8');
    instance.addUserData(userDataScript);

    new cdk.CfnOutput(this, 'InstancePublicIp', {
      value: instance.instancePublicIp,
    });
  }
}
