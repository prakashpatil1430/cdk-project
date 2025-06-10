import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { readFileSync } from 'fs';


class L3Bucket extends Construct {
  constructor(scope: Construct, id: string, expiry: number){
    super(scope, id);
    
   new Bucket(this, "L3Bucket", {
      bucketName: 'webapp-bucket-11111',
      lifecycleRules: [{
        expiration: cdk.Duration.days(expiry)
      }]
    })
  }
}

export class MyVpcCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create a VPC with 4 public subnets
    const vpc = new ec2.Vpc(this, 'MyVpc', {
      cidr: "10.0.0.0/16",
      maxAzs: 4,
      subnetConfiguration: [
        {
          subnetType: ec2.SubnetType.PUBLIC,
          name: 'PublicSubnet1',
          cidrMask: 22,
        },
        {
          subnetType: ec2.SubnetType.PUBLIC,
          name: 'PublicSubnet2',
          cidrMask: 22,
        },
        {
          subnetType: ec2.SubnetType.PUBLIC,
          name: 'PublicSubnet3',
          cidrMask: 22,
        },
        {
          subnetType: ec2.SubnetType.PUBLIC,
          name: 'PublicSubnet4',
          cidrMask: 22,
        }
      ],
    });

    // create security group(allow port 80, 22)
    const webappSG = new ec2.SecurityGroup(this, 'webappSG', {
      vpc,
      securityGroupName: 'WebappserverSG',
      allowAllOutbound: true, // Allow all outbound traffic
      description: 'Security group for web server',
    });

    // allowing port 22 and ssh
    webappSG.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), 'Allow SSH access from anywhere');
    webappSG.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(20), 'Allow SSH access from anywhere');


    // adding root volume 10 gb
    const rootVolume: ec2.BlockDevice = {
      deviceName: '/dev/xvda',
      volume: ec2.BlockDeviceVolume.ebs(10),
    };

    // creating key pair
    // Define the Key Pair name
    const keyPairName = 'webapp-key-pair'; 


    // Create an EC2 instance in the defined VPC
    const webAppEC2 = new ec2.Instance(this, 'WebServerInstance', {
      instanceName: 'WebServer',
      blockDevices: [rootVolume],
      vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      machineImage: ec2.MachineImage.latestAmazonLinux2(),
      keyName: keyPairName,
      availabilityZone: vpc.availabilityZones[4],
      securityGroup: webappSG,
    });

    // Load the contents of the user-data script
    const userDataScript = readFileSync('./lib/user-data.sh', 'utf-8')

    webAppEC2.addUserData(userDataScript);


    new cdk.CfnOutput(this, 'VpcId', {
      value: vpc.vpcId,
    });

    // instance public ip
    new cdk.CfnOutput(this, 'InstancePublicIp', { value: webAppEC2.instancePublicIp });


    // creating a bucket
    new L3Bucket(this, 'MyL3Bucket', 2);
  }
}