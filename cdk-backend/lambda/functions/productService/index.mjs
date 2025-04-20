import { DynamoDBClient } from "@aws-sdk/client-dynamodb"; // low level interactions
import { DynamoDBDocumentClient, GetCommand, ScanCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb"; // high level interactions

// Create DynamoDB client
const client = new DynamoDBClient({ region: process.env.REGION || 'us-east-1' });
const documentClient = DynamoDBDocumentClient.from(client);

const allowedOrigins = process.env.ALLOW_ORIGINS?.split(',') || [];
const TABLE_NAME = process.env.TABLE_NAME || 'Products';


export const handler = async (event) => {
    const origin = event.headers.origin;
    const { httpMethod, path, queryStringParameters, body, pathParameters } = event;
    const productId = pathParameters?.id;

    try {
        switch (httpMethod) {
            case "GET":
                if (pathParameters && pathParameters.id) {
                    const command = new GetCommand({
                        TableName: TABLE_NAME,
                        Key: { itemId: pathParameters.id }
                    });
                    const { Item } = await documentClient.send(command);
                    return response(origin, 200, { message: "Product queried successfully", results: Item || {} });
                }
                const command = new ScanCommand({ TableName: TABLE_NAME });
                const { Items } = await documentClient.send(command);
                return response(origin, 200, { message: "Products queried successfully", results: Items });

            case "PUT":

                if (!productId) return response(origin, 400, { message: "Missing product ID" });

                const updatedFields = JSON.parse(body);
                if (!Object.keys(updatedFields).length)
                    return response(origin, 400, { message: "No fields to update" });

                // Updating the fields
                const updateExpressions = Object.keys(updatedFields).map((key) => `#${key} = :${key}`).join(", ");
                const expressionAttributeNames = Object.fromEntries(Object.keys(updatedFields).map((key) => [`#${key}`, key]));
                const expressionAttributeValues = Object.fromEntries(Object.entries(updatedFields).map(([key, value]) => [`:${key}`, value]));

                const updateResult = await documentClient.send(new UpdateCommand({
                    TableName: TABLE_NAME,
                    Key: { itemId: productId },
                    UpdateExpression: `SET ${updateExpressions}`,
                    ExpressionAttributeNames: expressionAttributeNames,
                    ExpressionAttributeValues: expressionAttributeValues,
                    ReturnValues: "ALL_NEW"
                }));
                return response(origin, 200, { message: "Product updated successfully", updatedProduct: updateResult.Attributes });

            case "DELETE":
                if (!productId) return response(origin, 400, { message: "Missing product ID" });
                await documentClient.send(new DeleteCommand({
                    TableName: TABLE_NAME,
                    Key: { itemId: productId }
                }));
                return response(origin, 200, { message: "Product deleted successfully" });

            default:
                return response(origin, 404, { message: "Route or method not supported" });
        }
    } catch (error) {
        console.error("Error: ", error);
        return response(origin, 500, { message: "Internal server error", error: error.message });
    }
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
