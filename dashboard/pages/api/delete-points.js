import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = await client.db("climatesafe_arduino");
  const collection = await db.collection("data_points");
  const arr = await collection.find({}).toArray();

  for (let i = 0; i < arr.length; i++) {
    // parse data.temp as float and delete document if temp is above 49
    if (parseFloat(arr[i].temp) > 40) {
      await collection.deleteOne({ _id: arr[i]._id });
    }
  }

  const response = {
    resp: "Done",
  };
  res.status(200).json({ data: response });
}

async function deleteNonRecentListings(client, date) {}
