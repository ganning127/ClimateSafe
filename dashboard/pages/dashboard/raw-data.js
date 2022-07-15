import Head from "next/head";
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
  Spinner,
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
import { SideBar } from "../../components/SideBar";
import { useEffect, useState } from "react";
import { AiOutlineCloudDownload } from "react-icons/ai";
import * as jsonexport from "jsonexport/dist";

export default function Dashboard({ success }) {
  const [dayLimit, setDayLimit] = useState("");
  const [data, setData] = useState([]);
  const [loaded, setLoaded] = useState(false);
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

  useEffect(() => {
    async function fetchData() {
      const resp = await fetch("/api/get-all-data");
      const data = await resp.json();
      let useData = data.data.full_data;
      setData(useData);
    }

    fetchData().then(() => {
      setLoaded(true);
    });
  }, []);

  // keep data that were created before the hourLimit
  let dateLimit =
    dayLimit == ""
      ? new Date("January 1, 1970")
      : new Date() - dayLimit * 24 * 60 * 60 * 1000;

  const dataBeforeHourLimit = data.filter((d) => {
    return new Date(d.created_at) > dateLimit;
  });

  return (
    <>
      <Head>
        <title>Raw Data | ClimateSafe</title>
      </Head>

      <SideBar active="raw data">
        {!loaded && (
          <>
            <Spinner />
            <Text>Fetching data...</Text>
          </>
        )}
        {loaded && (
          <>
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
                  {dataBeforeHourLimit
                    .reverse()
                    .slice(0, 1000)
                    .map((item, index) => {
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
            </TableContainer>{" "}
          </>
        )}
      </SideBar>
    </>
  );
}
