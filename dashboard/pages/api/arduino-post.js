import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = await client.db("climatesafe_arduino");
  const collection = await db.collection("data_points");

  const hardware_id = req.query.hardware_id || "demo-board";
  const temp = req.query.temp || null;
  const humidity = req.query.humidity || null;
  const co = req.query.co || null;
  const combust_gas = req.query.combust_gas || null;
  const gas_smoke = req.query.gas_smoke || null;
  const photo_sensitive = req.query.photo_sensitive || null;
  const air_pollution = req.query.air_pollution || null;
  const alert = req.query.alert || false;

  const data = {
    created_at: new Date(),
    hardware_id,
    temp,
    humidity,
    co,
    combust_gas,
    gas_smoke,
    photo_sensitive,
    air_pollution,
    alert,
  };

  const resp = await collection.insertOne(data);
  res.status(200).json({ resp });
}
