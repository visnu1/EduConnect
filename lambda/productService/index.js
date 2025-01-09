const AWS = require('aws-sdk');
AWS.config.update({ region: "us-west-1" });

const documentClient = new AWS.DynamoDB.DocumentClient();
const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*",
    "Content-Type": "application/json"
};

exports.handler = async (event) => {
    const httpMethod = event.httpMethod;
    const path = event.path;

    if (httpMethod == 'GET' && path == '/products') {
        console.log(`TESTING=> 'GET' /products`);
        try {
            const results = await documentClient.scan({
                TableName: 'Products',
            }).promise();
            return { body: JSON.stringify({ results }), statusCode: 200, headers };
        } catch (error) {
            console.error('Query error:', error);
            return {
                statusCode: 500,
                body: JSON.stringify({ message: 'Error querying the DynamoDB table' }),
                headers
            };
        }
    }

    // Default response for unsupported routes or methods
    return { body: JSON.stringify({ message: "Route or method not supported" }), statusCode: 404, headers };
};
