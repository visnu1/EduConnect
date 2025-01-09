const { MongoClient } = require('mongodb');

const url = 'mongodb+srv://visnu:Angryshark$0@cluster0.lpqugel.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(url);

let dbConnection = null;

async function connectToDatabase() {
    // console.log("dbConnection =>", dbConnection);
    if (dbConnection &&  dbConnection.serverConfig && dbConnection.serverConfig.isConnected()) {
        console.log('Already connected!');
        return dbConnection;
    } else {
        console.log('New connection');
        await client.connect();
        dbConnection = client.db('ratingsDB');
        return dbConnection;
    }
}

module.exports = connectToDatabase;
