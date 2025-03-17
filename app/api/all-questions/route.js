import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;
const collectionName = "quizzes";

export async function GET() {
  let client;
  try {
    client = new MongoClient(uri);
    await client.connect();

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const allRules = await collection.find({}).toArray();

    return new Response(JSON.stringify(allRules), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
        "SW-Cache-TTL": "86400", // Custom header for service worker
      },
    });
  } catch (error) {
    console.error("Error fetching all rules:", error);
    return new Response("Internal Server Error", { status: 500 });
  } finally {
    if (client) {
      await client.close();
    }
  }
}
