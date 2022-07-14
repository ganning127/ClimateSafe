import Head from "next/head";
import clientPromise from "../lib/mongodb";
import { useRouter } from "next/router";
// TODO: Add a latest reading thing that takes the last document in mongodb
import {
  Container,
  SimpleGrid,
  Text,
  Img,
  Box,
  Heading,
} from "@chakra-ui/react";
import { SmSep } from "../components/Separators/SmSep";
import { IconCard } from "../components/Cards/IconCard";
import { HeadingWithDesc } from "../components/Headings/HeadingWithDesc";
import { SideBar } from "../components/SideBar";
import { MetricCard } from "../components/Cards/MetricCard";
import { BiLineChart, BiGasPump } from "react-icons/bi";
import { FaLeaf } from "react-icons/fa";
import { useEffect, useState } from "react";
import { AiOutlineCloud, AiOutlineFire } from "react-icons/ai";
import { FaTemperatureHigh } from "react-icons/fa";
import { WiSmoke, WiHumidity } from "react-icons/wi";
import { BsAlarm } from "react-icons/bs";
import Chart from "chart.js/auto"; // needed for "no tree shaking"
import { Line } from "react-chartjs-2";

export default function Dashboard({ success, data }) {
  const router = useRouter();

  const [lastRefresh, setLastRefresh] = useState("");

  let {
    coAvg,
    tempAvg,
    humidityAvg,
    gasSmokeAvg,
    combustGasAvg,
    lpgAvg,
    earliest,
    numAlerts,
  } = dataAnalysis(data);

  const tempLineChart = lineChartProcessData(data, "temp", "lightred");

  tempLineChart.datasets[0].data.forEach((element, index) => {
    tempLineChart.datasets[0].data[index] = convertCToF(element);
  });

  const humidityLineChart = lineChartProcessData(
    data,
    "humidity",
    "lightgreen"
  );
  const coLineChart = lineChartProcessData(data, "co", "orange");
  const gasSmokeLineChart = lineChartProcessData(data, "gas_smoke", "purple");
  const combustGasLineChart = lineChartProcessData(data, "combust_gas", "red");
  const lpgLineChart = lineChartProcessData(data, "lpg", "blue");

  const latestDataPoint = data[data.length - 1];

  useEffect(() => {
    setLastRefresh(new Date().toLocaleString());

    setInterval(() => {
      router.replace(router.asPath); // refresh every 5 minutes
      setLastRefresh(new Date().toLocaleString());
    }, 300000);
  }, []);

  return (
    <>
      <Head>
        <title>Dashboard | ClimateSafe</title>
      </Head>

      <SideBar active="dashboard">
        <HeadingWithDesc
          align="left"
          smaller={true}
          desc={`Last refreshed at ${lastRefresh}`}
        >
          Climate
          <Text as="span" color="darkgreen">
            Safe
          </Text>{" "}
          Dashboard | Live Data
        </HeadingWithDesc>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
          <MetricCard
            desc="CO"
            num={parseFloat(latestDataPoint.co).toFixed(2) + " ppm"}
            color={latestDataPoint.coAlertStatus > 1 ? "red.300" : "green.300"}
            icon={AiOutlineCloud}
          />

          <MetricCard
            desc=" temperature"
            num={
              convertCToF(parseFloat(latestDataPoint.temp)).toFixed(2) + " F"
            }
            color={
              latestDataPoint.tempAlertStatus > 1 ? "red.300" : "green.300"
            }
            icon={FaTemperatureHigh}
          />
          <MetricCard
            desc=" smoke in air"
            num={parseFloat(latestDataPoint.gas_smoke).toFixed(2) + " ppm"}
            color={
              latestDataPoint.gasSmokeAlertStatus > 1 ? "red.300" : "green.300"
            }
            icon={WiSmoke}
          />

          <MetricCard
            desc=" combustible gas"
            num={parseFloat(latestDataPoint.combust_gas).toFixed(2) + " ppm"}
            color={
              latestDataPoint.combustGasAlertStatus > 1
                ? "red.300"
                : "green.300"
            }
            icon={AiOutlineFire}
          />
          <MetricCard
            desc=" LPG"
            num={parseFloat(latestDataPoint.lpg).toFixed(2) + " ppm"}
            color={latestDataPoint.lpgAlertStatus > 1 ? "red.300" : "green.300"}
            icon={BiGasPump}
          />

          <MetricCard
            desc=" humidity level"
            num={parseFloat(latestDataPoint.humidity).toFixed(2) + " %"}
            color={
              latestDataPoint.humidityAlertStatus > 1 ? "red.300" : "green.300"
            }
            icon={WiHumidity}
          />
        </SimpleGrid>

        <SmSep line={true} />

        <HeadingWithDesc align="left" smaller={true}>
          Metrics
        </HeadingWithDesc>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
          <MetricCard
            desc="you started using ClimateSafe"
            num={new Date(earliest).toLocaleDateString()}
            color="purple.300"
            icon={FaLeaf}
          />
          <MetricCard
            desc="total data points"
            num={data.length}
            color="teal.300"
            icon={BiLineChart}
          />
          <MetricCard
            desc="average CO level"
            num={coAvg.toFixed(2) + " ppm"}
            color="orange.300"
            icon={AiOutlineCloud}
          />
          <MetricCard
            desc="average temperature"
            num={convertCToF(tempAvg).toFixed(2) + " F"}
            color="red.300"
            icon={FaTemperatureHigh}
          />
          <MetricCard
            desc="average smoke in air"
            num={gasSmokeAvg.toFixed(2) + " ppm"}
            color="blue.300"
            icon={WiSmoke}
          />

          <MetricCard
            desc="average combustible gas"
            num={combustGasAvg.toFixed(2) + " ppm"}
            color="cyan.300"
            icon={AiOutlineFire}
          />
          <MetricCard
            desc="average LPG"
            num={lpgAvg.toFixed(2) + " ppm"}
            color="yellow.300"
            icon={BiGasPump}
          />

          <MetricCard
            desc="average humidity level"
            num={humidityAvg.toFixed(2) + " %"}
            color="green.300"
            icon={WiHumidity}
          />
          <MetricCard
            desc="total alerts"
            num={numAlerts}
            color="gray.400"
            icon={BsAlarm}
          />
        </SimpleGrid>

        <SmSep line={true} />

        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
          <Box>
            <Line data={tempLineChart} />
          </Box>
          <Box>
            <Line data={humidityLineChart} />
          </Box>
          <Box>
            <Line data={coLineChart} />
          </Box>
          <Box>
            <Line data={gasSmokeLineChart} />
          </Box>
          <Box>
            <Line data={combustGasLineChart} />
          </Box>
          <Box>
            <Line data={lpgLineChart} />
          </Box>
        </SimpleGrid>
      </SideBar>
    </>
  );
}

export async function getServerSideProps(context) {
  try {
    const client = await clientPromise;
    // `await clientPromise` will use the default database passed in the MONGODB_URI
    // However you can use another database (e.g. myDatabase) by replacing the `await clientPromise` with the following code:
    //
    // `const client = await clientPromise`
    // `const db = client.db("myDatabase")`
    //
    // Then you can execute queries against your database like so:
    // db.find({}) or any of the MongoDB Node Driver commands

    const db = await client.db("climatesafe_arduino");
    const collection = await db.collection("data_points");

    const tempData = await collection.find({}).toArray();

    const data = JSON.parse(JSON.stringify(tempData));

    return {
      props: { success: true, data: data },
    };
  } catch (e) {
    console.error(e);
    return {
      props: { success: false, data: null },
    };
  }
}

const dataAnalysis = (data) => {
  const earliest = data.map((item) => item.created_at).sort((a, b) => a - b)[0];

  // let coSum = 0;
  // let coCount = 0;
  // let tempSum = 0;
  // let tempCount = 0;
  // let humiditySum = 0;
  // let humidityCount = 0;
  // let gasSmokeSum = 0;
  // let gasSmokeCount = 0;
  // let combustGasSum = 0;
  // let combustGasCount = 0;
  // let lpgSum = 0;
  // let lpgCount = 0;

  // data.forEach((item) => {
  //   if (item.co && !isNaN(item.co)) {
  //     coSum += parseFloat(item.co);
  //     coCount++;
  //   }
  //   if (item.temp && !isNaN(item.temp)) {
  //     tempSum += parseFloat(item.temp);
  //     tempCount++;
  //   }
  //   if (item.humidity && !isNaN(item.humidity)) {
  //     humiditySum += parseFloat(item.humidity);
  //     humidityCount++;
  //   }
  //   if (item.gas_smoke && !isNaN(item.gas_smoke)) {
  //     gasSmokeSum += parseFloat(item.gas_smoke);
  //     gasSmokeCount++;
  //   }
  //   if (item.combust_gas && !isNaN(item.combust_gas)) {
  //     combustGasSum += parseFloat(item.combust_gas);
  //     combustGasCount++;
  //   }
  //   if (item.lpg && !isNaN(item.lpg)) {
  //     lpgSum += parseFloat(item.lpg);
  //     lpgCount++;
  //   }
  // });

  // let coAvg = coSum / coCount;
  // let tempAvg = tempSum / tempCount;
  // let humidityAvg = humiditySum / humidityCount;
  // let gasSmokeAvg = gasSmokeSum / gasSmokeCount;
  // let combustGasAvg = combustGasSum / combustGasCount;
  // let lpgAvg = lpgSum / lpgCount;

  let coLst = [];
  let tempLst = [];
  let humidityLst = [];

  let gasSmokeLst = [];
  let combustGasLst = [];
  let lpgLst = [];

  data.forEach((item) => {
    if (item.co && !isNaN(item.co)) {
      coLst.push(parseFloat(item.co));
    }

    if (item.temp && !isNaN(item.temp)) {
      tempLst.push(parseFloat(item.temp));
    }
    if (item.humidity && !isNaN(item.humidity)) {
      humidityLst.push(parseFloat(item.humidity));
    }
    if (item.gas_smoke && !isNaN(item.gas_smoke)) {
      gasSmokeLst.push(parseFloat(item.gas_smoke));
    }
    if (item.combust_gas && !isNaN(item.combust_gas)) {
      combustGasLst.push(parseFloat(item.combust_gas));
    }
    if (item.lpg && !isNaN(item.lpg)) {
      lpgLst.push(parseFloat(item.lpg));
    }
  });

  let coMedian = median(coLst);
  let tempMedian = median(tempLst);
  let humidityMedian = median(humidityLst);
  let gasSmokeMedian = median(gasSmokeLst);
  let combustGasMedian = median(combustGasLst);

  let lpgMedian = median(lpgLst);

  var alertArray = data.filter(function (el) {
    return (
      el.tempAlertStatus > 1 ||
      el.humidityAlertStatus > 1 ||
      el.coAlertStatus > 1 ||
      el.combustGasAlertStatus > 1 ||
      el.gasSmokeAlertStatus > 1 ||
      el.lpgAlertStatus > 1 ||
      el.airPollutionAlertStatus > 1
    );
  });

  return {
    coAvg: coMedian,
    tempAvg: tempMedian,
    humidityAvg: humidityMedian,
    gasSmokeAvg: gasSmokeMedian,
    combustGasAvg: combustGasMedian,
    lpgAvg: lpgMedian,
    earliest: earliest,

    numAlerts: alertArray.length,
  };
};

const lineChartProcessData = (data, label, color) => {
  console.log(data);
  // remove all data points where label is null or not a number
  data = data.filter((item) => {
    return item[label] && !isNaN(item[label]);
  });

  let dataUse = {
    labels: data.map((item) => {
      return new Date(item.created_at).toLocaleString();
    }),
    datasets: [
      {
        label: label,
        fill: false,
        data: data.map((item) => {
          return item[label];
        }),
        tension: 0.1,
        borderColor: color,
      },
    ],
  };

  return dataUse;
};

const convertCToF = (c) => {
  return (c * 9) / 5 + 32;
};

const median = (arr) => {
  return arr.slice().sort((a, b) => a - b)[Math.floor(arr.length / 2)];
};
