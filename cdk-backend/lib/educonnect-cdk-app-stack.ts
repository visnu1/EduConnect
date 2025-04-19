import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';


export class EduconnectCdkAppStack extends cdk.Stack {
  public readonly dependancyLayer: lambda.LayerVersion;
  
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Define shared Lambda layer
    this.dependancyLayer = new lambda.LayerVersion(this, 'NodeModules', {
      layerVersionName: 'node-modules-layer',
      code: lambda.Code.fromAsset('lambda/common-layers'),
      description: 'Node modules layer for Lambda functions',
      compatibleRuntimes: [lambda.Runtime.NODEJS_18_X],
      compatibleArchitectures: [lambda.Architecture.X86_64, lambda.Architecture.ARM_64],
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Export the ARN of the Lambda layer
    new cdk.CfnOutput(this, 'NodeLambdaLayerArn', {
      value: this.dependancyLayer.layerVersionArn,
      description: 'The ARN of the shared Node Modules Lambda Layer',
      exportName: 'NodeLambdaLayerArn', // Export, could be any name
    });
  }
}



// https://shawntorsitano.com/blog/cdk-lambda-layers/
// https://juinquok.medium.com/introduction-to-using-custom-resources-in-aws-cdk-automating-your-infrastructure-a56e2f8ce412