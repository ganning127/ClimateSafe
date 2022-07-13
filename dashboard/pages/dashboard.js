import Head from "next/head";
import clientPromise from "../lib/mongodb";
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
import { BiLineChart } from "react-icons/bi";
import { FaLeaf } from "react-icons/fa";
import { useEffect, useState } from "react";
import { AiOutlineCloud } from "react-icons/ai";
import { FaTemperatureHigh } from "react-icons/fa";
import { WiSmoke, WiHumidity } from "react-icons/wi";

export default function Dashboard({ success, data }) {
  const [lastRefresh, setLastRefresh] = useState("");

  let { coAvg, tempAvg, humidityAvg, earliest } = dataAnalysis(data);
  useEffect(() => {
    setLastRefresh(new Date().toLocaleTimeString());
  }, []);

  return (
    <>
      <Head>
        <title>Dashboard | ClimateSafe</title>
      </Head>

      <SideBar>
        <HeadingWithDesc
          align="left"
          smaller={true}
          desc={`Last refreshed at ${lastRefresh}`}
        >
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
            num={tempAvg.toFixed(2) + " C"}
            color="red.300"
            icon={FaTemperatureHigh}
          />
          <MetricCard
            desc="average humidity level"
            num={coAvg.toFixed(2) + " %"}
            color="green.300"
            icon={WiHumidity}
          />
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

  let coSum = 0;
  let coCount = 0;
  let tempSum = 0;
  let tempCount = 0;
  let humiditySum = 0;
  let humidityCount = 0;

  data.forEach((item) => {
    if (item.co && !isNaN(item.co)) {
      console.log(item.co);
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
  console.log("Average CO Levels", coAvg);
  console.log("Average Temperature", tempAvg);
  console.log("Average Humidity", humidityAvg);

  return {
    coAvg,
    tempAvg,
    humidityAvg,
    earliest,
  };
};