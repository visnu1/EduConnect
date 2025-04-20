import * as cdk from 'aws-cdk-lib';
import { Construct } from "constructs";
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { CustomStackProps, defaultCorsPreflightOptions } from '../config';


export class StudentPantryAppStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: CustomStackProps) {
        super(scope, id, props);
        const { config } = props;

        const layerArn = cdk.Fn.importValue('NodeLambdaLayerArn');

        // Create DynamoDB Table
        const productsTable = new dynamodb.Table(this, 'ProductsTable', {
            partitionKey: { name: 'itemId', type: dynamodb.AttributeType.STRING },
            tableName: 'Products',
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            removalPolicy: cdk.RemovalPolicy.DESTROY,  // 'SNAPSHOT' - Create a backup before destroying
        });

        const ordersTable = new dynamodb.Table(this, 'OrdersTable', {
            partitionKey: { name: 'orderId', type: dynamodb.AttributeType.STRING },
            tableName: 'Orders',
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
        });

        // Add Global Secondary Indexes
        productsTable.addGlobalSecondaryIndex({
            indexName: 'category-index',
            partitionKey: { name: 'category', type: dynamodb.AttributeType.STRING },
            projectionType: dynamodb.ProjectionType.ALL
        });

        ordersTable.addGlobalSecondaryIndex({
            indexName: 'studentId-createdAt-index',
            partitionKey: { name: 'studentId', type: dynamodb.AttributeType.STRING },
            sortKey: { name: 'createdAt', type: dynamodb.AttributeType.STRING },
            projectionType: dynamodb.ProjectionType.ALL
        });


        // Create Lambda Functions
        const productsLambda = new lambda.Function(this, 'ProductsFn', {
            functionName: 'productService',
            description: 'Products service for pantry app',
            runtime: lambda.Runtime.NODEJS_18_X,
            handler: 'index.handler',
            code: lambda.Code.fromAsset('lambda/functions/productService'),
            layers: [
                lambda.LayerVersion.fromLayerVersionArn(this, 'ProductsNodeLayer', layerArn)
            ],
            environment: {
                TABLE_NAME: 'Products',
                REGION: this.region,
                ALLOW_ORIGINS: config.ALLOW_ORIGINS
            }
        })

        const ordersLambda = new lambda.Function(this, 'OrdersFn', {
            functionName: 'orderService',
            description: 'Products service for pantry app',
            runtime: lambda.Runtime.NODEJS_18_X,
            handler: 'index.handler',
            code: lambda.Code.fromAsset('lambda/functions/orderService'),
            layers: [
                lambda.LayerVersion.fromLayerVersionArn(this, 'OrdersNodeLayer', layerArn)
            ],
            environment: {
                TABLE_NAME: 'Orders',
                REGION: this.region,
                ALLOW_ORIGINS: config.ALLOW_ORIGINS
            }
        })

        productsTable.grantReadWriteData(productsLambda);
        ordersTable.grantReadWriteData(ordersLambda);

        // Create API Gateway
        const pantryApi = new apigateway.RestApi(this, 'PantryApi', {
            restApiName: 'Pantry App',
            description: 'This API manages pantry products and operations',

        });
        pantryApi.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);

        const productsResource = pantryApi.root.addResource('products', { defaultCorsPreflightOptions });
        productsResource.addMethod('GET', new apigateway.LambdaIntegration(productsLambda, { proxy: true }));

        // manage single product through their ID
        const productResource = productsResource.addResource('{productId}', { defaultCorsPreflightOptions });
        productResource.addMethod('GET', new apigateway.LambdaIntegration(productsLambda, { proxy: true }));
        productResource.addMethod('PUT', new apigateway.LambdaIntegration(productsLambda, { proxy: true }));
        productResource.addMethod('DELETE', new apigateway.LambdaIntegration(productsLambda, { proxy: true }));


        // Not defined default cors preflightOptions
        const ordersResource = pantryApi.root.addResource('orders', { defaultCorsPreflightOptions });

        ordersResource.addMethod('GET', new apigateway.LambdaIntegration(ordersLambda, { proxy: true }));
        ordersResource.addMethod('POST', new apigateway.LambdaIntegration(ordersLambda, { proxy: true }));


        // Load initial data into DynamoDB
        const seedProductsLambda = new lambda.Function(this, 'SeedProductsLambda', {
            timeout: cdk.Duration.seconds(30),
            runtime: lambda.Runtime.NODEJS_18_X,
            handler: 'index.handler',
            code: lambda.Code.fromAsset('lambda/data-seed/pantry'),
            environment: {
                PRODUCTS_TABLE: productsTable.tableName,
            },
        });

        productsTable.grantWriteData(seedProductsLambda);


        // Custom Resource to trigger seeding function only once
        new cdk.CustomResource(this, 'SeedProductsDataResource', {
            serviceToken: seedProductsLambda.functionArn,
            serviceTimeout: cdk.Duration.seconds(300)
        });
    }
}
