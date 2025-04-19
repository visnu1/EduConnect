import mysql2 from 'mysql2/promise';
import { readFileSync, existsSync } from "fs";

const PHYSICAL_RESOURCE_ID = "CourseSeedDataResource-1744319593038"

let connection = null;

export const handler = async (event, context) => {

    if (['Update', 'Delete'].includes(event.RequestType))
        return buildResponse(`${event.RequestType} Complete!`);

    if (event.RequestType === 'Create') {
        try {
            await createConnection();
            const filePath = "seed.sql";
            if (!existsSync(filePath)) {
                console.error(`File not found at path: ${filePath}`);
                throw new Error(`❌ File not found at path: ${filePath}`)
            }

            const sqlQuery = readFileSync(filePath, "utf-8");
            const [results, fields] = await connection.query(sqlQuery);

            console.log(results);

            return buildResponse(`Successfully created and inserted tables and data into ${process.env.DB_NAME}`);

        } catch (error) {
            console.error("Error during Create request processing:", error);
            throw error;
        }
    }
    console.warn(`Unhandled RequestType: ${event.RequestType}`);
    return buildResponse(`Unsupported RequestType: ${event.RequestType}`, 'FAILED');
};


async function createConnection() {
    if (!connection) {
        try {
            connection = await mysql2.createConnection({
                host: process.env.RDS_HOSTNAME,
                user: process.env.RDS_USERNAME,
                password: process.env.RDS_PASSWORD,
                port: parseInt(process.env.RDS_PORT || "3306", 10),
                database: process.env.DB_NAME,
                ssl: 'Amazon RDS',
                multipleStatements: true
            });
            console.log("DB connection established!");
        } catch (error) {
            console.error("Failed establishing a connection to the database:", error);
            throw new Error(`Failed establishing DB connection: ${error.message}`);
        }
    }
}

const buildResponse = (Message = 'Completed', Status = 'SUCCESS') => ({
    PhysicalResourceId: PHYSICAL_RESOURCE_ID,
    Data: { Status, Message }
});