import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = await client.db("climatesafe_arduino");
  const collection = await db.collection("data_points");
  const data = await collection.find({}).toArray();

  let coSum = 0;
  let coCount = 0;
  let tempSum = 0;
  let tempCount = 0;
  let humiditySum = 0;
  let humidityCount = 0;

  data.forEach((item) => {
    if (item.co && !isNaN(item.co)) {
      coSum += parseFloat(item.co);
      coCount++;
    }
    if (item.temp && !isNaN(item.temp)) {
      tempSum += parseFloat(item.temp);
      tempCount++;
    }
    if (item.humidity && !isNaN(item.humidity)) {
      humiditySum += parseFloat(item.humidity);
      humidityCount++;
    }
  });

  let coAvg = coSum / coCount;
  let tempAvg = tempSum / tempCount;
  let humidityAvg = humiditySum / humidityCount;

  res.status(200).json({ data: { coAvg, tempAvg, humidityAvg } });
}
