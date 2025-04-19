import { MongoClient } from 'mongodb';

const url = process.env.MONGODB_URL;
const client = new MongoClient(url);

let dbConnection = null;

async function connectToDatabase() {
    // console.log("dbConnection =>", dbConnection);
    if (dbConnection && dbConnection.serverConfig && dbConnection.serverConfig.isConnected()) {
        console.log('Already connected!');
        return dbConnection;
    } else {
        console.log('Established a new connection');
        await client.connect();
        dbConnection = client.db('ratingsDB');
        return dbConnection;
    }
}

export default connectToDatabase;
