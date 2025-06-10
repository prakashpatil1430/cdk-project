#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { NetworkStack } from '../lib/network-stack';
import { ComputeStack } from '../lib/compute-stack';
import { StorageStack } from '../lib/storage-stack';
import { CicdStack } from '../lib/cicd-stack'

const app = new cdk.App();

const networkStack = new NetworkStack(app, 'NetworkStack');

new ComputeStack(app, 'ComputeStack', {
  vpc: networkStack.vpc,
  securityGroup: networkStack.webappSG,
});

new StorageStack(app, 'StorageStack');


new CicdStack(app, 'CicdStack');

app.synth();