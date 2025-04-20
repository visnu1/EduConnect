import * as cdk from 'aws-cdk-lib';
import { Construct } from "constructs";
import * as rds from 'aws-cdk-lib/aws-rds';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as custom_resources from 'aws-cdk-lib/custom-resources';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { CustomStackProps, defaultCorsPreflightOptions } from '../config';

export class StudentCourseRegistrationAppStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: CustomStackProps) {
        super(scope, id, props);
        const { config } = props;

        const layerArn = cdk.Fn.importValue('NodeLambdaLayerArn');

        const vpc = new ec2.Vpc(this, 'RdsVpc', {
            vpcName: 'EduconnectRdsVpc',
            natGateways: 0,
            maxAzs: 2,
            subnetConfiguration: [
                {
                    name: 'rds-isolated-subnet',
                    subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
                }
            ]
        });

        const lambdaSecurityGroup = new ec2.SecurityGroup(this, 'LambdaSG', {
            vpc,
            description: 'Security group for Lambda',
            allowAllOutbound: true,
        });

        const dbSecurityGroup = new ec2.SecurityGroup(this, 'RDSDbSG', {
            vpc,
            description: 'Security group for RDS instance'
        });

        dbSecurityGroup.addIngressRule(lambdaSecurityGroup, ec2.Port.tcp(3306), 'Allow Lambda to connect to MySQL');

        const rdsInstance = new rds.DatabaseInstance(this, 'MysqlRdsInstance', {
            engine: rds.DatabaseInstanceEngine.mysql({ version: rds.MysqlEngineVersion.VER_8_0_40 }),
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
            credentials: rds.Credentials.fromPassword(config.SQL_USERNAME, cdk.SecretValue.unsafePlainText(config.SQL_PSW)),
            databaseName: 'educonnect',
            vpc,
            vpcSubnets: {
                subnetType: ec2.SubnetType.PRIVATE_ISOLATED
            },
            securityGroups: [dbSecurityGroup],
            publiclyAccessible: false,
            port: 3306,
            storageType: rds.StorageType.GP2,
            allocatedStorage: 10,
            maxAllocatedStorage: 20,
            deletionProtection: false,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            backupRetention: cdk.Duration.days(1),
            monitoringInterval: cdk.Duration.seconds(0),
            autoMinorVersionUpgrade: true
        });

        // Create Lambda Functions
        const courseRegLambda = new lambda.Function(this, 'CourseRegFn', {
            functionName: 'CourseRegistrationService',
            description: 'Students course registration service',
            runtime: lambda.Runtime.NODEJS_18_X,
            handler: 'index.handler',
            code: lambda.Code.fromAsset('lambda/functions/studentService'),
            timeout: cdk.Duration.seconds(30),
            layers: [
                lambda.LayerVersion.fromLayerVersionArn(this, 'CourseRegNodeLayer', layerArn)
            ],
            vpc: vpc,  // Same VPC as RDS
            vpcSubnets: {
                subnetType: ec2.SubnetType.PRIVATE_ISOLATED  // Same subnet type
            },
            securityGroups: [lambdaSecurityGroup],
            environment: {
                REGION: this.region,
                DB_NAME: "educonnect",
                RDS_HOSTNAME: rdsInstance.instanceEndpoint.hostname,
                RDS_PORT: rdsInstance.instanceEndpoint.port.toString(),
                RDS_USERNAME: config.SQL_USERNAME,
                RDS_PASSWORD: config.SQL_PSW,
            }
        })

        // Create API Gateway
        const courseRegApi = new apigateway.RestApi(this, 'CourseRegApi', {
            restApiName: 'Course Reg App',
            description: 'This API manages course Registrations for students',
        });
        courseRegApi.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);

        // APIs to manage all courses
        const coursesResource = courseRegApi.root.addResource('courses', { defaultCorsPreflightOptions });
        coursesResource.addMethod('GET', new apigateway.LambdaIntegration(courseRegLambda, { proxy: true }));
        coursesResource.addMethod('POST', new apigateway.LambdaIntegration(courseRegLambda, { proxy: true }));

        /**
         *   Manage single course through their ID - Not implemented
         */
        // const courseResource = coursesResource.addResource('{courseId}', { defaultCorsPreflightOptions });
        // courseResource.addMethod('GET', new apigateway.LambdaIntegration(courseRegLambda, { proxy: true }));
        // courseResource.addMethod('PUT', new apigateway.LambdaIntegration(courseRegLambda, { proxy: true }));
        // courseResource.addMethod('DELETE', new apigateway.LambdaIntegration(courseRegLambda, { proxy: true }));

        // seach through query parameters
        const searchResource = coursesResource.addResource('search', { defaultCorsPreflightOptions });
        searchResource.addMethod('GET', new apigateway.LambdaIntegration(courseRegLambda, { proxy: true }));


        const enrollmentResource = courseRegApi.root.addResource('enrollment', { defaultCorsPreflightOptions });
        enrollmentResource.addMethod('GET', new apigateway.LambdaIntegration(courseRegLambda, { proxy: true }));


        const majorCoursesResource = courseRegApi.root.addResource('major-courses', { defaultCorsPreflightOptions });
        majorCoursesResource.addMethod('GET', new apigateway.LambdaIntegration(courseRegLambda, { proxy: true }));

        const majorsResource = courseRegApi.root.addResource('majors', { defaultCorsPreflightOptions });
        majorsResource.addMethod('GET', new apigateway.LambdaIntegration(courseRegLambda, { proxy: true }));

        const professorsResource = courseRegApi.root.addResource('professors', { defaultCorsPreflightOptions });
        professorsResource.addMethod('GET', new apigateway.LambdaIntegration(courseRegLambda, { proxy: true }));

        const studentsResource = courseRegApi.root.addResource('students', { defaultCorsPreflightOptions });
        studentsResource.addMethod('GET', new apigateway.LambdaIntegration(courseRegLambda, { proxy: true }));

        // seach through query parameters
        const studentSearchResource = studentsResource.addResource('search', { defaultCorsPreflightOptions });
        studentSearchResource.addMethod('GET', new apigateway.LambdaIntegration(courseRegLambda, { proxy: true }));

        const seedDataLambda = new lambda.Function(this, 'CourseSeedDataLambda', {
            functionName: "CourseSeedData",
            description: "Lambda to seed initial data into RDS",
            runtime: lambda.Runtime.NODEJS_18_X,
            handler: 'index.handler',
            code: lambda.Code.fromAsset('lambda/data-seed/courses-registration'),
            layers: [lambda.LayerVersion.fromLayerVersionArn(this, 'SeedLambdaLayer', layerArn)],
            timeout: cdk.Duration.seconds(40),
            memorySize: 128,
            vpc,
            vpcSubnets: {
                subnetType: ec2.SubnetType.PRIVATE_ISOLATED
            },
            securityGroups: [lambdaSecurityGroup],
            environment: {
                REGION: this.region,
                DB_NAME: "educonnect",
                RDS_HOSTNAME: rdsInstance.instanceEndpoint.hostname,
                RDS_PORT: rdsInstance.instanceEndpoint.port.toString(),
                RDS_USERNAME: config.SQL_USERNAME,
                RDS_PASSWORD: config.SQL_PSW
            }
        });

        const seedDataProvider = new custom_resources.Provider(this, 'SeedCoursesDataProvider', {
            onEventHandler: seedDataLambda, // Lambda to handle create/update/delete events
        });

        new cdk.CustomResource(this, 'SeedCoursesDataResource', {
            serviceToken: seedDataProvider.serviceToken,
            resourceType: 'Custom::SeedCoursesData',
        });
    }
}