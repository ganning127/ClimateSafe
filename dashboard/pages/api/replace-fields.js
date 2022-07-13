// Creates/Updates a new property in each document in MongoDB
import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = await client.db("climatesafe_arduino");
  const collection = await db.collection("data_points");

  const resp = await collection.updateMany(
    {},
    { $set: { hardware_id: "demo-board" } }
  );
  res.status(200).json({ resp });
}
