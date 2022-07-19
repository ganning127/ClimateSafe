import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = await client.db("climatesafe_arduino");
  const collection = await db.collection("data_points");
  const arr = await collection.find({}).toArray();
  let deleteNum = 0;
  for (let i = 0; i < arr.length; i++) {
    // parse data.temp as float and delete document if temp is above 49
    if (new Date(arr[i].created_at) < new Date("2022-07-13")) {
      console.log("deleting");
      await collection.deleteOne({ _id: arr[i]._id });
      deleteNum++;
    }
  }

  const response = {
    deleteNum,
  };
  res.status(200).json({ data: response });
}

async function deleteNonRecentListings(client, date) {}
