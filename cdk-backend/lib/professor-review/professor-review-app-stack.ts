import * as cdk from 'aws-cdk-lib';
import { Construct } from "constructs";
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { CustomStackProps, defaultCorsPreflightOptions } from '../config';

export class ProfessorReviewAppStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: CustomStackProps) {
        super(scope, id, props);

        const { config } = props;

        const layerArn = cdk.Fn.importValue('NodeLambdaLayerArn');

        // Create Lambda Functions
        const profReviewLambda = new lambda.Function(this, 'ProfReviewFn', {
            functionName: 'ProfReviewService',
            description: 'Professor review service for managing ratings and reviews',
            runtime: lambda.Runtime.NODEJS_18_X,
            handler: 'index.handler',
            code: lambda.Code.fromAsset('lambda/functions/ratingService'),
            layers: [
                lambda.LayerVersion.fromLayerVersionArn(this, 'RatingsNodeLayer', layerArn)
            ],
            environment: {
                REGION: this.region,
                MONGODB_URL: config.MONGODB_URL,
                ALLOW_ORIGINS: config.ALLOW_ORIGINS
            }
        })

        // Create API Gateway
        const profReviewApi = new apigateway.RestApi(this, 'ProfReviewApi', {
            restApiName: 'Professor Review App',
            description: 'This API manages ratings and reviews for professors.',
        });

        profReviewApi.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);

        // APIs Managing questions
        const questionsResource = profReviewApi.root.addResource('questions', { defaultCorsPreflightOptions });
        questionsResource.addMethod('GET', new apigateway.LambdaIntegration(profReviewLambda, { proxy: true }));

        // APIs Managing reviews
        const reviewResource = profReviewApi.root.addResource('review', {
            // Required for pre-flight
            defaultCorsPreflightOptions
        });
        reviewResource.addMethod('POST', new apigateway.LambdaIntegration(profReviewLambda, { proxy: true }));
        reviewResource.addMethod('GET', new apigateway.LambdaIntegration(profReviewLambda, { proxy: true }));
    }
}
