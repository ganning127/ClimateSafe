import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = await client.db("climatesafe_arduino");
  const collection = await db.collection("data_points");
  const data = await collection
    .find({})
    .sort({ created_at: -1 })
    .limit(2000)
    .toArray();

  const response = {
    summary: {
      numDataPoints: data.length,
      numDataPointsLast24Hours: data.filter((item) => {
        const now = new Date();
        const createdAt = new Date(item.created_at);
        return now - createdAt < 24 * 60 * 60 * 1000;
      }).length,
    },
    full_data: data.reverse(),
  };
  res.status(200).json({ data: response });
}
