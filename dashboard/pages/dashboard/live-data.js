import Head from "next/head";
import clientPromise from "../../lib/mongodb";
import {
  Container,
  SimpleGrid,
  Text,
  Img,
  Box,
  Heading,
  Table,
  Thead,
  Badge,
  Tbody,
  Tfoot,
  Select,
  Tr,
  Th,
  HStack,
  Icon,
  Button,
  Td,
  FormControl,
  FormLabel,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";
import { SmSep } from "../../components/Separators/SmSep";
import { HeadingWithDesc } from "../../components/Headings/HeadingWithDesc";
import { SideBar } from "../../components/SideBar";
import { MetricCard } from "../../components/Cards/MetricCard";
import { BiLineChart } from "react-icons/bi";
import { FaLeaf } from "react-icons/fa";
import { useEffect, useState } from "react";
import { AiOutlineCloud, AiOutlineFire } from "react-icons/ai";
import { FaTemperatureHigh } from "react-icons/fa";
import { WiSmoke, WiHumidity } from "react-icons/wi";
import { BiGasPump } from "react-icons/bi";
import Chart from "chart.js/auto"; // needed for "no tree shaking"
import { Line } from "react-chartjs-2";
import * as jsonexport from "jsonexport/dist";
import { useRouter } from "next/router";

export default function LiveData({ latest, success }) {
  const router = useRouter();
  const [live, setLive] = useState(false);
  const [lastRefresh, setLastRefresh] = useState("");
  const latestDataPoint = latest[0];

  // check if the latest element was created more than 5 minutes ago
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  console.log(fiveMinutesAgo);
  const isFiveMinutesAgo =
    new Date(latestDataPoint.created_at) > fiveMinutesAgo; // true if the latest element was created less than 5 minutes ago

  useEffect(() => {
    setLastRefresh(new Date(latestDataPoint.created_at).toLocaleString());
    if (isFiveMinutesAgo) {
      setInterval(() => {
        router.replace(router.asPath); // refresh every 5 minutes
        setLastRefresh(new Date());
      }, 1000);
    }
  }, []);
  return (
    <>
      <Head>
        <title>Raw Data | ClimateSafe</title>
      </Head>

      <SideBar active="live data">
        {!isFiveMinutesAgo && (
          <>
            <Badge colorScheme="red">Warning:</Badge>
            <Text color="text" d="inline">
              Hmm, it looks like you aren't connected to a live data source!
              Please connect to a live data source to see live data.
            </Text>
          </>
        )}

        {isFiveMinutesAgo && (
          <>
            <Badge colorScheme="green">Connected to Live Data Source</Badge>

            <Text
              fontWeight="normal"
              color="text"
              fontSize={{ base: "md", lg: "lg" }}
              my="3"
            >
              Last updated at {lastRefresh.toLocaleString()}
            </Text>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} mt={3}>
              <MetricCard
                desc="CO"
                num={parseFloat(latestDataPoint.co).toFixed(2) + " ppm"}
                color={
                  latestDataPoint.coAlertStatus > 1 ? "red.300" : "green.300"
                }
                icon={AiOutlineCloud}
              />

              <MetricCard
                desc=" temperature"
                num={
                  convertCToF(parseFloat(latestDataPoint.temp)).toFixed(2) +
                  " F"
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
                  latestDataPoint.gasSmokeAlertStatus > 1
                    ? "red.300"
                    : "green.300"
                }
                icon={WiSmoke}
              />

              <MetricCard
                desc=" combustible gas"
                num={
                  parseFloat(latestDataPoint.combust_gas).toFixed(2) + " ppm"
                }
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
                color={
                  latestDataPoint.lpgAlertStatus > 1 ? "red.300" : "green.300"
                }
                icon={BiGasPump}
              />

              <MetricCard
                desc=" humidity level"
                num={parseFloat(latestDataPoint.humidity).toFixed(2) + " %"}
                color={
                  latestDataPoint.humidityAlertStatus > 1
                    ? "red.300"
                    : "green.300"
                }
                icon={WiHumidity}
              />
            </SimpleGrid>
          </>
        )}
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

    // get the latest document from the collection
    const latest = await collection.find({}).sort({ created_at: -1 }).limit(1);
    const latestData = JSON.parse(JSON.stringify(await latest.toArray()));

    return {
      props: { success: true, latest: latestData },
    };
  } catch (e) {
    console.error(e);
    return {
      props: { success: false, latest: null },
    };
  }
}

const convertCToF = (c) => {
  return (c * 9) / 5 + 32;
};

const median = (arr) => {
  return arr.slice().sort((a, b) => a - b)[Math.floor(arr.length / 2)];
};
