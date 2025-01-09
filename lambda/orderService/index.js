const AWS = require('aws-sdk');
AWS.config.update({ region: "us-west-1" });

const documentClient = new AWS.DynamoDB.DocumentClient();
const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*",
      "Content-Type": "application/json"
};

// studentId-createdAt-index

exports.handler = async (event) => {
    const httpMethod = event.httpMethod;
    const path = event.path;


    if (httpMethod == 'GET' && path == '/orders') {
        console.log(`TESTING=> 'POST' /orders`);
        const studentId = event.queryStringParameters.studentId;
        const dateRange = event.queryStringParameters?.dateRange || "";
        try {
            const params = {
                TableName: 'Orders',
                IndexName: 'studentId-createdAt-index',
                KeyConditionExpression: 'studentId = :studentId',
                ExpressionAttributeValues: {
                    ':studentId': studentId
                },
            };
            const results = await documentClient.query(params).promise(); // get matching documents
            // const results = await documentClient.getItem(params).promise(); //get a single document
            return { body: JSON.stringify({ message: 'Order queried successfully', results }), statusCode: 201, headers };
        } catch (error) {
            console.error('Get error:', error);
            return {
                statusCode: 500,
                body: JSON.stringify({ message: 'Error quering orders from DynamoDB' }),
                headers
            };
        }
    }

    if (httpMethod == 'POST' && path == '/orders') {
        console.log(`TESTING=> 'POST' /orders`);
        try {
            const order = JSON.parse(event.body);
            console.log("order =>", order);
            await documentClient.put({
                TableName: 'Orders',
                Item: order
            }).promise();
            return { body: JSON.stringify({ message: 'Order inserted successfully' }), statusCode: 201, headers };
        } catch (error) {
            console.error('Insert error:', error);
            return {
                statusCode: 500,
                body: JSON.stringify({ message: 'Error inserting order into DynamoDB' }),
                headers
            };
        }
    }

    // Default response for unsupported routes or methods
    return { body: JSON.stringify({ message: "Route or method not supported" }), statusCode: 404, headers };
};