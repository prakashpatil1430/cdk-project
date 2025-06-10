import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export class NetworkStack extends cdk.Stack {
  public readonly vpc: ec2.Vpc;
  public readonly webappSG: ec2.SecurityGroup;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create VPC with 4 public subnets
    this.vpc = new ec2.Vpc(this, 'MyVpc', {
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

    // Create security group in this VPC
    this.webappSG = new ec2.SecurityGroup(this, 'webappSG', {
      vpc: this.vpc,
      securityGroupName: 'WebappserverSG',
      allowAllOutbound: true,
      description: 'Security group for web server',
    });

    this.webappSG.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), 'Allow SSH access from anywhere');
    this.webappSG.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80), 'Allow HTTP access from anywhere');

    // Export VPC ID and SG ID as CloudFormation outputs for use in other stacks if needed
    new cdk.CfnOutput(this, 'VpcId', { value: this.vpc.vpcId });
    new cdk.CfnOutput(this, 'WebappSGId', { value: this.webappSG.securityGroupId });
  }
}
