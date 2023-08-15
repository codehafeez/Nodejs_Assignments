const { MongoClient } = require('mongodb');
const url = 'mongodb://127.0.0.1:27017';
const dbName = 'hafeez_db';
let db;

async function connectToDatabase() {
  try {
    const client = await MongoClient.connect(url, {
      useUnifiedTopology: true,
    });
    db = client.db(dbName);
    console.log('Connected to MongoDB successfully!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

function getDatabase() {
  return db;
}

module.exports = { connectToDatabase, getDatabase };
