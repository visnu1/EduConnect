import { DynamoDBClient } from "@aws-sdk/client-dynamodb"; // low level interactions
import { DynamoDBDocumentClient, QueryCommand, PutCommand } from "@aws-sdk/lib-dynamodb"; // high level interactions
import { v4 as uuidv4 } from "uuid";

// Create DynamoDB client
const client = new DynamoDBClient({ region: process.env.REGION || 'us-east-1' });
const documentClient = DynamoDBDocumentClient.from(client);

const allowedOrigins = process.env.ALLOW_ORIGINS?.split(',') || [];
const TABLE_NAME = process.env.TABLE_NAME || 'Orders';


// studentId-createdAt-index

export const handler = async (event) => {
    const origin = event.headers.origin;
    const httpMethod = event.httpMethod;
    const path = event.path;


    if (httpMethod == 'GET' && path == '/orders') {
        const studentId = event.queryStringParameters.studentId;
        const dateRange = event.queryStringParameters?.dateRange || "";
        try {
            if (!studentId) {
                return response(origin, 400, { message: "Missing studentId parameter" });
            }

            const params = {
                TableName: TABLE_NAME,
                IndexName: "studentId-createdAt-index",
                KeyConditionExpression: "studentId = :studentId",
                ExpressionAttributeValues: {
                    ":studentId": studentId
                }
            };

            const command = new QueryCommand(params);
            const { Items } = await documentClient.send(command);
            return response(origin, 200, { message: "Order queried successfully", results: Items });
        } catch (error) {
            console.error("Error: ", error);
            return response(origin, 500, { message: "Internal server error", error: error.message });
        }
    }

    if (httpMethod == 'POST' && path == '/orders') {
        try {
            const order = JSON.parse(event.body);
            order.orderId = order.orderId || uuidv4();
            order.createdAt = new Date().toISOString();

            console.log("Saving order:", order);

            const command = new PutCommand({
                TableName: TABLE_NAME,
                Item: order
            });
            await documentClient.send(command);
            return response(origin, 201, { message: "Order inserted successfully", order });
        } catch (error) {
            console.error("Error: ", error);
            return response(origin, 500, { message: "Internal server error", error: error.message });
        }
    }

    return response(origin, 404, { message: "Route or method not supported" });
};

function response(origin, statusCode, body) {
    return {
        statusCode,
        body: JSON.stringify(body),
        headers: {
            "Access-Control-Allow-Origin": allowedOrigins.includes(origin) ? origin : "",
            "Access-Control-Allow-Methods": "*",
            "Content-Type": "application/json"
        }
    };
}
