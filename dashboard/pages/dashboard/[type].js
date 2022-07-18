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
  Flex,
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
import { AiOutlineFire } from "react-icons/ai";
import { FaTemperatureHigh } from "react-icons/fa";
import { WiSmoke, WiHumidity } from "react-icons/wi";
import { BiGasPump } from "react-icons/bi";
import Chart from "chart.js/auto"; // needed for "no tree shaking"
import { Line } from "react-chartjs-2";
import * as jsonexport from "jsonexport/dist";
import { useRouter } from "next/router";
import { AiOutlineCloud } from "react-icons/ai";
import { GrCircleInformation } from "react-icons/gr";

const TYPE_TO_NAME = {
  co: "Carbon Monoxide",
  combust_gas: "Combustible Gas",
  gas_smoke: "Gas Smoke",
  humidity: "Humidity",
  temp: "Temperature",
  lpg: "LPG",
};

const TYPE_TO_UNITS = {
  co: "ppm",
  combust_gas: "ppm",
  gas_smoke: "ppm",
  humidity: "%",
  temp: "°C",
  lpg: "ppm",
};

const ITEMS_TO_HREF = {
  co: "https://www.health.state.mn.us/communities/environment/air/toxins/index.html",
  combust_gas: "https://www.figaro.co.jp/en/knowledge/inflammablegas.html",
  gas_smoke:
    "https://health.ny.gov/environmental/outdoors/air/smoke_from_fire.htm",
  humidity: "https://www.airthings.com/what-is-humidity",
  temp: "https://learn.eartheasy.com/guides/natural-home-cooling/",
  lpg: "https://en.wikipedia.org/wiki/Liquefied_petroleum_gas",
};
export default function Type({ latest, data }) {
  const router = useRouter();
  const { type } = router.query;

  const [graphData, setGraphData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const resp = await fetch("/api/get-all-data");
      const data = await resp.json();
      let useData = data.data.full_data;
      setGraphData(useData);
    }

    fetchData();
  });

  const totalGraphData = lineChartProcessData(graphData, type, "green");

  // keep only data points for the last 24 hours
  const last24Hours = graphData.filter((item) => {
    return (
      new Date(item.created_at).getTime() > new Date() - 24 * 60 * 60 * 1000
    );
  });
  const Hours24GraphData = lineChartProcessData(last24Hours, type, "orange");

  useEffect(() => {}, []);
  return (
    <>
      <Head>
        <title>{TYPE_TO_NAME[type]} Data | ClimateSafe</title>
      </Head>

      <SideBar active={TYPE_TO_NAME[type].toLowerCase()}>
        <Flex alignItems="center">
          <HeadingWithDesc align="left" smaller={true}>
            Climate
            <Text as="span" color="darkgreen">
              Safe
            </Text>{" "}
            {TYPE_TO_NAME[type]}
          </HeadingWithDesc>

          <Box as="a" href={ITEMS_TO_HREF[type]}>
            <Icon
              as={GrCircleInformation}
              fontSize="2xl"
              alignSelf="center"
              ml={2}
            />
          </Box>
        </Flex>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
          <MetricCard
            desc={`High ${type}`}
            num={
              parseFloat(data.highValue).toFixed(2) + " " + TYPE_TO_UNITS[type]
            }
            // color={latestDataPoint.coAlertStatus > 1 ? "red.300" : "green.300"}
            color="green.300"
            icon={AiOutlineCloud}
          />
          <MetricCard
            desc={`Low ${type}`}
            num={
              parseFloat(data.lowValue).toFixed(2) + " " + TYPE_TO_UNITS[type]
            }
            // color={latestDataPoint.coAlertStatus > 1 ? "red.300" : "green.300"}
            color="green.300"
            icon={AiOutlineCloud}
          />
          <MetricCard
            desc={`Median ${type}`}
            num={
              parseFloat(data.medianValue).toFixed(2) +
              " " +
              TYPE_TO_UNITS[type]
            }
            // color={latestDataPoint.coAlertStatus > 1 ? "red.300" : "green.300"}
            color="green.300"
            icon={AiOutlineCloud}
          />
          <MetricCard
            desc={`Average ${type}`}
            num={
              parseFloat(data.avgValue).toFixed(2) + " " + TYPE_TO_UNITS[type]
            }
            // color={latestDataPoint.coAlertStatus > 1 ? "red.300" : "green.300"}
            color="green.300"
            icon={AiOutlineCloud}
          />
          <MetricCard
            desc={`Number Alerts ${type}`}
            num={parseFloat(data.numTypeAlerts) + " " + TYPE_TO_UNITS[type]}
            // color={latestDataPoint.coAlertStatus > 1 ? "red.300" : "green.300"}
            color="red.300"
            icon={AiOutlineCloud}
          />
        </SimpleGrid>
        <SmSep line={true} />
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
          <Box>
            <Text mt={3} fontSize="xl">
              {TYPE_TO_NAME[type]} vs. Time
            </Text>

            <Line data={totalGraphData} />
          </Box>
          <Box>
            <Text mt={3} fontSize="xl">
              {TYPE_TO_NAME[type]} vs. Last 24 Hours
            </Text>

            <Line data={Hours24GraphData} />
          </Box>
        </SimpleGrid>
      </SideBar>
    </>
  );
}

export async function getServerSideProps(context) {
  try {
    const TYPE = context.params.type;
    const TYPES_TO_ALERT = {
      co: "coAlertStatus",
      combust_gas: "combustGasAlertStatus",
      gas_smoke: "gasSmokeAlertStatus",
      humidity: "humidityAlertStatus",
      temp: "tempAlertStatus",
      lpg: "lpgAlertStatus",
    };
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

    // get data from database about carbon monoxide
    const allData = await collection.find({}).toArray();

    let numTypeAlerts = 0;
    let typeValuesArray = [];

    allData.forEach((item) => {
      if (item[TYPES_TO_ALERT[TYPE]] > 1) {
        numTypeAlerts++;
      }
      if (item[TYPE] && !isNaN(item[TYPE])) {
        typeValuesArray.push(parseFloat(item[TYPE]));
      }
    });

    const medianValue = median(typeValuesArray);
    const highValue = Math.max(...typeValuesArray);
    const lowValue = Math.min(...typeValuesArray);
    const avgValue = Math.round(
      typeValuesArray.reduce((a, b) => a + b, 0) / typeValuesArray.length
    );

    const data = JSON.parse(
      JSON.stringify({
        medianValue,
        highValue,
        lowValue,
        avgValue,
        numTypeAlerts,
      })
    );

    return {
      props: {
        success: true,
        data,
      },
    };
  } catch (e) {
    console.error(e);
    return {
      props: { success: false },
    };
  }
}

const convertCToF = (c) => {
  return (c * 9) / 5 + 32;
};

const median = (arr) => {
  return arr.slice().sort((a, b) => a - b)[Math.floor(arr.length / 2)];
};

const lineChartProcessData = (data, label, color, grouping) => {
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
