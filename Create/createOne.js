const { MongoClient } = require('mongodb');
require('dotenv').config();

async function main () {

    const uri = process.env.MONGODB_URL;

    /**
     * The Mongo Client you will use to interact with your database
     * See https://mongodb.github.io/node-mongodb-native/3.6/api/MongoClient.html for more details
     * In case: '[MONGODB DRIVER] Warning: Current Server Discovery and Monitoring engine is deprecated...'
     * pass option { useUnifiedTopology: true } to the MongoClient constructor.
     * const client =  new MongoClient(uri, {useUnifiedTopology: true})
     */
    const client = new MongoClient(uri)

    try{
        // Connect to the MongoDB cluster
        await client.connect()

        // Create a single new listing
        await createListing(client, {
            name: "Testing rooms",
            summary: "A testing room in mongodb",
            bedrooms: 2,
            bathrooms: 2
        })
    } finally{
        // Close the connection to the MongoDB cluster
        await client.close()
    }
}
main().catch(console.error);

async function createListing(client, newListing) {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").insertOne(newListing)
    console.log(`New listing created with the following id: ${result.insertedId}`);
}