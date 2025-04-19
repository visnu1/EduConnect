import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, BatchWriteCommand } from "@aws-sdk/lib-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { readFileSync } from "fs";
import * as https from "https";
import * as url from "url";

const client = new DynamoDBClient({ region: process.env.REGION || "us-east-1" });
const documentClient = DynamoDBDocumentClient.from(client);

export const handler = async (event, context) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  // Handle CloudFormation Custom Resource events
  if (['Delete', 'Update'].includes(event.RequestType)) {
    await sendCloudFormationResponse(event, context, "SUCCESS");
    return;
  }

  const tableName = process.env.PRODUCTS_TABLE;
  if (!tableName) {
    console.error("PRODUCTS_TABLE environment variable is missing.");
    await sendCloudFormationResponse(event, "FAILED", "Server error: Table name not set.");
    return;
  }

  try {
    // Read the seed data from the JSON file
    const filePath = "data.json";
    const rawData = readFileSync(filePath, "utf-8").split('\n');
    const products = rawData.map(item => {
      try {
        return unmarshall(JSON.parse(item)['Item']);
      } catch (error) {
        console.error(`Error parsing JSON item: ${item}`, error);
        return null; // Return null for invalid JSON
      }
    }).filter(item => item !== null);

    // Assign random expiry date if applicable
    products.forEach((product) => {
      if ("expiry" in product) {
        product.expiry = new Date(randomDate()).toISOString();
      }
    });

    console.log("Seeding products:", products);

    // Split data into chunks of 25 (DynamoDB BatchWrite limit)
    const chunkedProducts = chunkArray(products, 25);

    for (const chunk of chunkedProducts) {
      const putRequests = chunk.map((product) => ({
        PutRequest: { Item: product },
      }));

      const command = new BatchWriteCommand({
        RequestItems: {
          [tableName]: putRequests,
        },
      });

      await documentClient.send(command);
    }

    // Success response to Custom Resource
    await sendCloudFormationResponse(event, context, "SUCCESS", null, {
      message: `Successfully inserted ${products.length} items into ${tableName}`
    });
  } catch (error) {
    console.error("Error inserting seed data:", error);
    await sendCloudFormationResponse(event, context, "FAILED", `Failed to insert seed data: ${error.message}`);
  }
};

const sendCloudFormationResponse = async (event, context, status, reason, data = {}) => {
  return new Promise((resolve, reject) => {
    const responseBody = JSON.stringify({
      Status: status,
      Reason: reason || 'Details on CloudWatch Log Stream: ' + context.logStreamName,
      PhysicalResourceId: event.PhysicalResourceId || event.LogicalResourceId,
      StackId: event.StackId,
      RequestId: event.RequestId,
      LogicalResourceId: event.LogicalResourceId,
      NoEcho: false,
      Data: data
    });

    console.log('Response body:', responseBody);

    if (!event.ResponseURL) {
      console.log('Local test.');
      resolve();
      return;
    }

    const parsedUrl = url.parse(event.ResponseURL);
    const options = {
      hostname: parsedUrl.hostname,
      port: 443,
      path: parsedUrl.path,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': responseBody.length
      }
    };

    const request = https.request(options, (response) => {
      console.log(`Status code: ${response.statusCode}`);
      console.log(`Status message: ${response.statusMessage}`);
      resolve();
    });

    request.on('error', (error) => {
      console.log('sendResponse error:', error);
      reject(error);
    });

    request.write(responseBody);
    request.end();
  });
};

// Utility fn to chunk array into smaller parts
const chunkArray = (array, chunkSize) => {
  const result = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
};

// Generating a random date
const randomDate = () => {
  const year = new Date().getFullYear() + Math.floor(Math.random() * 3);
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0");
  const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, "0");
  return `${year}-${month}-${day}T00:00:00Z`;
};