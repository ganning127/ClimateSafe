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
import { AiOutlineCloudDownload } from "react-icons/ai";
import { FaTemperatureHigh } from "react-icons/fa";
import { WiSmoke, WiHumidity } from "react-icons/wi";
import { BsAlarm } from "react-icons/bs";
import Chart from "chart.js/auto"; // needed for "no tree shaking"
import { Line } from "react-chartjs-2";
import * as jsonexport from "jsonexport/dist";

export default function Dashboard({ success, data }) {
  const [dayLimit, setDayLimit] = useState("");
  const exportToCSV = () => {
    console.log("exporting...");
    jsonexport(dataBeforeHourLimit, function (err, csv) {
      if (err) return console.error(err);
      const csvFile = new Blob([csv], { type: "text/csv" });
      let downloadLink = document.createElement("a");
      downloadLink.download = "ganning_raw_data.csv";
      downloadLink.href = window.URL.createObjectURL(csvFile);
      downloadLink.style.display = "none";

      document.body.appendChild(downloadLink);
      downloadLink.click();
    });
  };

  // keep data that were created before the hourLimit
  let dateLimit =
    dayLimit == ""
      ? new Date("January 1, 1970")
      : new Date() - dayLimit * 24 * 60 * 60 * 1000;

  console.log(dateLimit);
  const dataBeforeHourLimit = data.filter((d) => {
    return new Date(d.created_at) > dateLimit;
  });

  return (
    <>
      <Head>
        <title>Raw Data | ClimateSafe</title>
      </Head>

      <SideBar active="raw data">
        <HStack>
          <FormControl>
            <Select
              placeholder="All Time"
              d="inline"
              onChange={(e) => setDayLimit(e.target.value)}
            >
              <option value={2}>2 Day Ago Limit</option>
            </Select>
          </FormControl>

          <Button
            onClick={exportToCSV}
            bg="darkgreen"
            w="400px"
            color="white"
            _hover={{
              bg: "green.400",
            }}
          >
            Export to CSV
            <Icon fontSize="2xl" ml={2} as={AiOutlineCloudDownload} />
          </Button>
        </HStack>
        <TableContainer>
          <Table variant="simple">
            <TableCaption>Raw Data from MongoDB</TableCaption>
            <Thead>
              <Tr>
                {Object.keys(data[0]).map((key, index) => {
                  if (key !== "_id") {
                    return <Th key={index}>{key}</Th>;
                  }
                })}
              </Tr>
            </Thead>
            <Tbody>
              {dataBeforeHourLimit.map((item, index) => {
                return (
                  <Tr key={index}>
                    {Object.keys(item).map((key, index) => {
                      if (key == "created_at") {
                        return (
                          <Td key={index}>
                            {new Date(item[key]).toLocaleString()}
                          </Td>
                        );
                      }
                      if (key !== "_id") {
                        return <Td key={index}>{item[key] || "null"}</Td>;
                      }
                    })}
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
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
