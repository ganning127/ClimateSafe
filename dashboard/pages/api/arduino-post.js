import clientPromise from "../../lib/mongodb";
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

const BOARD_MAPPER = {
  "demo-board": "9195279302",
};

const SAFE = 1;
const MED_HARM = 2;
const DANGEROUS = 3;

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
  const air_pollution = req.query.air_pollution || null;
  const lpg = req.query.lpg || null;

  let {
    tempAlertStatus,
    humidityAlertStatus,
    coAlertStatus,
    combustGasAlertStatus,
    gasSmokeAlertStatus,
    lpgAlertStatus,
    airPollutionAlertStatus,
  } = await checkAndSendAlert({
    hardware_id,
    temp,
    humidity,
    co,
    combust_gas,
    gas_smoke,
    air_pollution,
    lpg,
  });

  const data = {
    created_at: new Date(),
    tempAlertStatus,
    humidityAlertStatus,
    coAlertStatus,
    combustGasAlertStatus,
    gasSmokeAlertStatus,
    lpgAlertStatus,
    airPollutionAlertStatus,
    hardware_id,
    temp,
    humidity,
    co,
    combust_gas,
    gas_smoke,
    air_pollution,
    lpg,
  };

  const resp = await collection.insertOne(data);

  res.status(200).json({ resp });
}

async function checkAndSendAlert(data) {
  let {
    hardware_id,
    temp,
    humidity,
    co,
    combust_gas,
    gas_smoke,
    air_pollution,
    lpg,
  } = data;

  let tempAlertStatus = await checkForTemp(temp, hardware_id);
  let humidityAlertStatus = await checkForHumidity(humidity, hardware_id);
  let coAlertStatus = await checkForCO(co, hardware_id);
  let combustGasAlertStatus = await checkForCombustGas(
    combust_gas,
    hardware_id
  );
  let gasSmokeAlertStatus = await checkForGasSmoke(gas_smoke, hardware_id);
  let lpgAlertStatus = await checkForLPG(lpg, hardware_id);
  let airPollutionAlertStatus = await checkForAirPollution(
    air_pollution,
    hardware_id
  );

  return {
    tempAlertStatus,
    humidityAlertStatus,
    coAlertStatus,
    combustGasAlertStatus,
    gasSmokeAlertStatus,
    lpgAlertStatus,
    airPollutionAlertStatus,
  };
}

async function checkForAirPollution(air_pollution, hardware_id) {
  return SAFE;
}

async function checkForTemp(temp, hardware_id) {
  console.log("ID: ", hardware_id);
  if (isNaN(temp) || temp == null) {
    return SAFE;
  }

  temp = parseFloat(temp);
  let fTemp = (temp * 9) / 5 + 32;

  if ((fTemp > 13 && fTemp < 31) || (fTemp >= 90 && fTemp < 105)) {
    await sendText(
      BOARD_MAPPER[hardware_id],
      "Slightly Harmful (temperature): " + fTemp + "F"
    );
    return MED_HARM;
  } else if (fTemp <= 13 || fTemp >= 105) {
    await sendText(
      BOARD_MAPPER[hardware_id],
      "DANGEROUS (temperature): " + fTemp + "F"
    );
    return DANGEROUS;
  }

  return SAFE;
}

async function checkForHumidity(humidity, hardware_id) {
  if (isNaN(humidity) || humidity == null) {
    return SAFE;
  }

  humidity = parseFloat(humidity);

  if (humidity > 70) {
    await sendText(
      BOARD_MAPPER[hardware_id],
      "Caution (humidity): Humidity is at " + humidity + "%"
    );
    return MED_HARM;
  } else if (humidity >= 100) {
    await sendText(
      BOARD_MAPPER[hardware_id],
      "ALERT (humidity): Humidity is very high, at " + humidity + "%"
    );
    return DANGEROUS;
  }

  return SAFE;
}

async function checkForCO(co, hardware_id) {
  if (isNaN(co) || co == null) {
    return SAFE;
  }

  co = parseFloat(co);

  if (co > 51 && co < 100) {
    await sendText(
      BOARD_MAPPER[hardware_id],
      "Slightly Harmful (CO): " + co + "ppm"
    );
    return MED_HARM;
  }
  if (co >= 100) {
    await sendText(BOARD_MAPPER[hardware_id], "DANGEROUS (CO): " + co + "ppm");
    return DANGEROUS;
  }

  return SAFE;
}

async function checkForCombustGas(combust_gas, hardware_id) {
  if (isNaN(combust_gas) || combust_gas == null) {
    return SAFE;
  }

  combust_gas = parseFloat(combust_gas);

  if (combust_gas > 1000 && combust_gas < 5000) {
    await sendText(
      BOARD_MAPPER[hardware_id],
      "Slightly Harmful (Methane): " + combust_gas + "ppm"
    );
    return MED_HARM;
  }
  if (combust_gas >= 5001) {
    await sendText(
      BOARD_MAPPER[hardware_id],
      "DANGEROUS (Methane): " + combust_gas + "ppm"
    );
    return DANGEROUS;
  }

  return SAFE;
}

async function checkForGasSmoke(gas_smoke, hardware_id) {
  if (isNaN(gas_smoke) || gas_smoke == null) {
    return SAFE;
  }

  gas_smoke = parseFloat(gas_smoke);

  if (gas_smoke > 51 && gas_smoke < 100) {
    await sendText(
      BOARD_MAPPER[hardware_id],
      "Slightly Harmful (Gas Smoke): " + gas_smoke + "ppm"
    );
    return MED_HARM;
  } else if (gas_smoke >= 100) {
    await sendText(
      BOARD_MAPPER[hardware_id],
      "DANGEROUS (Gas Smoke): " + gas_smoke + "ppm"
    );
    return DANGEROUS;
  }

  return SAFE;
}

async function checkForLPG(lpg, hardware_id) {
  if (isNaN(lpg) || lpg == null) {
    return SAFE;
  }

  lpg = parseFloat(lpg);

  if (lpg > 2000) {
    await sendText(BOARD_MAPPER[hardware_id], "Harmful (LPG): " + lpg + "ppm");
    return MED_HARM;
  }
}

async function sendText(number, msg) {
  console.log("sending text...");
  const sendNumber = "+1" + number;
  console.log(sendNumber);
  await client.messages.create({
    body: msg,
    from: "+12565379261",
    to: sendNumber,
  });
}
