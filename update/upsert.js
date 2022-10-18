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

    try {
        // Connect to the MongoDB cluster
        await client.connect();

        // UPSERT
        // Check if a listing named Upserting is in the db
        await findListingByName(client, "Upserting rooms");
        // Upsert the Upserting listing
        await upsertListingByName(client, "Upserting rooms", { name: "Upserting rooms", bedrooms: 2, bathrooms: 1 });
        // Print the details of the Upserting listing
        await findListingByName(client, "Upserting rooms");
        // Upsert the Upserting listing
        await upsertListingByName(client, "Upserting rooms", { beds: 2 });
        // Print the details of the Upserting listing
        await findListingByName(client, "Upserting rooms");


    } finally {
        // Close the connection to the MongoDB cluster
        await client.close();
    }
}

main().catch(console.error);

// if there is no db to update, it creates a new one and update it
async function upsertListingByName(client, nameOfListing, updatedListing) {

    const result = await client.db("sample_airbnb").collection("listingsAndReviews").updateOne({ name: nameOfListing }, { $set: updatedListing }, { upsert: true });
    console.log(`${result.matchedCount} document(s) matched the query criteria.`);

    if (result.upsertedCount > 0) {
        console.log(`One document was inserted with the id ${result.upsertedId._id}`);
    } else {
        console.log(`${result.modifiedCount} document(s) was/were updated.`);
    }
}

async function findListingByName(client, nameOfListing) {
    // See https://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html#findOne for the findOne() docs
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").findOne({ name: nameOfListing });

    if (result) {
        console.log(`Found a listing in the db with the name '${nameOfListing}':`);
        console.log(result);
    } else {
        console.log(`No listings found with the name '${nameOfListing}'`);
    }
}
