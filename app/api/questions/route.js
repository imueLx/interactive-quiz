import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI; // Use environment variable for URI
const dbName = process.env.MONGODB_DB; // Use environment variable for DB name
const collectionName = "quizzes";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const ruleNumber = parseInt(searchParams.get("ruleNumber"));

  if (!ruleNumber) {
    return new Response("Rule number is required", { status: 400 });
  }

  let client;
  try {
    client = new MongoClient(uri);
    await client.connect();

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const rule = await collection.findOne({ ruleNumber: ruleNumber });

    if (!rule) {
      return new Response("Rule not found", { status: 404 });
    }

    return new Response(
      JSON.stringify({
        title: rule.title,
        description: rule.description,
        questions: rule.questions,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching rule:", error);
    return new Response("Internal Server Error", { status: 500 });
  } finally {
    if (client) {
      await client.close();
    }
  }
}
