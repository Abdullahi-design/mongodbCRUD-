const { MongoClient } = require('mongodb');
require('dotenv').config();

async function main() {

    const uri = process.env.MONGODB_URL;

    /**
     * The Mongo Client you will use to interact with your database
     * See https://mongodb.github.io/node-mongodb-native/3.6/api/MongoClient.html for more details
     * In case: '[MONGODB DRIVER] Warning: Current Server Discovery and Monitoring engine is deprecated...'
     * pass option { useUnifiedTopology: true } to the MongoClient constructor.
     * const client =  new MongoClient(uri, {useUnifiedTopology: true})
     */
    const client = new MongoClient(uri);

    try{
        // Connect to the MongoDB cluster
        await client.connect();

        // Create 2 new listings
        await createMultipleListings(client, [
            {
                name: "First test for multiple rooms",
                summary: "Modern home with infinite testing",
                property_type: "House",
                bedrooms: 5,
                bathrooms: 4.5,
                beds: 5
            },
            {
                name: "Second test for multiple rooms",
                property_type: "Apartment",
                bedrooms: 1,
                bathroom: 1
            },
        ])

    } finally{
        // Close the connection to the MongoDB cluster
        await client.close();
    }
}
main().catch(console.error);

async function createMultipleListings(client, newListings) {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").insertMany(newListings);

    console.log(`${result.insertedCount} new listing(s) created with the following id(s):`);
    console.log(result.insertedIds);
}