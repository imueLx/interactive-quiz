import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;
const collectionName = "quizresults";

export async function GET(req) {
  let client;
  try {
    client = new MongoClient(uri);
    await client.connect();

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name");
    const grade = searchParams.get("grade");
    const age = searchParams.get("age");
    const ruleId = searchParams.get("ruleId");

    let query = {};
    if (name) query.name = name;
    if (grade) query.grade = parseInt(grade);
    if (age) query.age = age;
    if (ruleId) query.ruleId = ruleId;

    const results = await collection.find(query).toArray();

    const processedResults = results.map((entry) => {
      const correctCount = entry.results.filter((q) => q.isCorrect).length;
      const incorrectCount = entry.results.length - correctCount;

      return {
        _id: entry._id,
        name: entry.name,
        age: entry.age,
        grade: entry.grade,
        ruleId: entry.ruleId,
        score: entry.score,
        correct: correctCount,
        incorrect: incorrectCount,
        accuracy:
          ((correctCount / entry.results.length) * 100).toFixed(2) + "%",
        results: entry.results.map((q) => ({
          question: q.question,
          selectedAnswer: q.selectedAnswer,
          isCorrect: q.isCorrect,
          correctAnswer: q.correctAnswer,
        })),
        createdAt: entry.createdAt,
      };
    });

    return new Response(JSON.stringify(processedResults), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
      },
    });
  } catch (error) {
    console.error("Error fetching detailed results:", error);
    return new Response("Internal Server Error", { status: 500 });
  } finally {
    if (client) {
      await client.close();
    }
  }
}
