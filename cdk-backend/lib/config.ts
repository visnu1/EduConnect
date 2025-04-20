import { StackProps, aws_apigateway } from "aws-cdk-lib";
import { Cors } from 'aws-cdk-lib/aws-apigateway';
import * as dotenv from "dotenv";
dotenv.config();

type ConfigProps = {
    REGION: string;
    SQL_USERNAME: string;
    SQL_PSW: string;
    MONGODB_URL: string;
    ALLOW_ORIGINS: string;
};

export type CustomStackProps = StackProps & {
    config: Readonly<ConfigProps>;
};

// Config your env file to set your own values
export const getConfig = (): ConfigProps => ({
    REGION: process.env.REGION || "us-east-1",
    SQL_USERNAME: process.env.SQL_USERNAME || "admin",
    SQL_PSW: process.env.SQL_DB_PSW || "password@123",
    MONGODB_URL: process.env.MONGODB_URL || "",
    ALLOW_ORIGINS: process.env.ORIGINS || "*"
});

// Currently using it directly in the stack, becomes difficult for testing and writing mocks
export const defaultCorsPreflightOptions: aws_apigateway.CorsOptions = {
    allowOrigins: process.env.ORIGINS?.split(',') || Cors.ALL_ORIGINS,
    allowMethods: Cors.ALL_METHODS
}