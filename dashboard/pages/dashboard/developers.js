import Head from "next/head";

import {
  Container,
  Box,
  Heading,
  Text,
  Button,
  SimpleGrid,
  Link,
  Img,
  UnorderedList,
  ListItem,
  Code,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { NavBar } from "../../components/NavBar";
import { SideBar } from "../../components/SideBar";
export default function Developers() {
  return (
    <>
      <Head>
        <title>Developers | ClimateSafe</title>
      </Head>
      <Box minH="100vh">
        <SideBar p={4} mt={20}>
          <Img src="/logo.png" h="24" mx="auto" />
          <Box>
            <Heading
              fontWeight="black"
              textAlign="center"
              color="text"
              fontSize={{ base: "3xl", sm: "4xl", md: "6xl" }}
            >
              Climate
              <Text as="span" color="darkgreen">
                Safe
              </Text>{" "}
              <Text
                as={"span"}
                bgGradient="linear(to-l, darkgreen, darkblue)"
                bgClip="text"
              >
                Developers.{" "}
              </Text>
            </Heading>
          </Box>

          <Box mt={8} textAlign="center" maxW="700px" mx="auto">
            <Heading
              fontSize={{ base: "xl", md: "2xl" }}
              color="text"
              fontWeight="black"
            >
              Our does our API work?
            </Heading>
            <Text color="text" fontWeight={400}>
              Using our API is easy. Using any language, make an HTTP request to
              our server at any of the endpoints below and receive your response
              in <Code>JSON</Code> format! In order for us to continue providing
              this service, please do not make spam or unnecessarily large
              numbers of requests to any API endpoint.
            </Text>
          </Box>

          <Box mt={24}>
            <SimpleGrid
              columns={{ base: 1, lg: 2 }}
              spacing={8}
              alignItems="center"
            >
              <Box>
                <Heading
                  fontSize={{ base: "xl", md: "2xl" }}
                  color="lightblue"
                  fontWeight="black"
                >
                  Get All Data Points
                </Heading>
                <Text color="text" fontWeight={400}>
                  Retrive all raw, unprocessed data points from our database. No
                  parameters required :)
                </Text>
                <Text color="text" fontWeight={400}></Text>
                <Code colorScheme="green" fontSize="2xl" mt={4}>
                  GET
                </Code>
                <Code colorScheme="green" fontSize="2xl" mt={4} ml={4}>
                  /api/get-all-data
                </Code>
              </Box>
              <Box>
                <Tabs variant="soft-rounded" colorScheme="green">
                  <TabList>
                    <Tab>API Call (Node.js)</Tab>
                    <Tab>Response</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel>
                      <Code
                        whiteSpace={"pre"}
                        d="block"
                        overflow="scroll"
                        height="300px"
                        width="600px"
                      >{`
const resp = await fetch("/api/get-all-data");
const data = await resp.json();
                      `}</Code>
                    </TabPanel>
                    <TabPanel>
                      <Code
                        whiteSpace={"pre"}
                        d="block"
                        overflow="scroll"
                        height="300px"
                        width="600px"
                      >
                        {`
{
  "data": {
  "summary": {
    "numDataPoints": 961,
    "numDataPointsLast24Hours": 906
  },
  "full_data": [
    {
        "_id": "62cc793d8c34511237db59d9",
        "created_at": "2022-07-11T19:25:49.776Z",
        "temp": null,
        "humidity": null,
        "co": null,
        "combust_gas": null,
        "gas_smoke": null,
        "phot_sensitive": null,
        "air_pollution": null,
        "alert": false,
        "hardware_id": "demo-board",
        "lpg": null,
        "alertSent": false
    },
    {
        "_id": "62cc79df283305f3431720af",
        "created_at": "2022-07-11T19:28:31.471Z",
        "temp": null,
        "humidity": null,
        "co": null,
        "combust_gas": null,
        "gas_smoke": null,
        "photo_sensitive": null,
        "air_pollution": null,
        "alert": false,
        "hardware_id": "demo-board",
        "lpg": null,
        "alertSent": false
    },
    {
        "_id": "62cc7aa0283305f3431720b0",
        "created_at": "2022-07-11T19:31:44.010Z",
        "temp": "26",
        "humidity": "40",
        "co": "8",
        "combust_gas": "smoke",
        "gas_smoke": "40",
        "photo_sensitive": null,
        "air_pollution": "50",
        "alert": "true",
        "hardware_id": "demo-board",
        "lpg": null,
        "alertSent": false
    },
    {
        "_id": "62cc7aba283305f3431720b1",
        "created_at": "2022-07-11T19:32:10.478Z",
        "temp": "26",
        "humidity": "40",
        "co": "8",
        "combust_gas": "smoke",
        "gas_smoke": "40",
        "photo_sensitive": null,
        "air_pollution": "50",
        "alert": "true",
        "hardware_id": "demo-board",
        "lpg": null,
        "alertSent": false
    },
    {
        "_id": "62cc7ad4283305f3431720b2",
        "created_at": "2022-07-11T19:32:36.001Z",
        "temp": "26",
        "humidity": "40",
        "co": "8",
        "combust_gas": "smoke",
        "gas_smoke": "40",
        "photo_sensitive": "true",
        "air_pollution": "50",
        "alert": "true",
        "hardware_id": "demo-board",
        "lpg": null,
        "alertSent": false
    }
  ]
}`}
                      </Code>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Box>
            </SimpleGrid>
          </Box>

          <Box mt={24}>
            <SimpleGrid
              columns={{ base: 1, lg: 2 }}
              spacing={8}
              alignItems="center"
            >
              <Box>
                <Heading
                  fontSize={{ base: "xl", md: "2xl" }}
                  color="lightblue"
                  fontWeight="black"
                >
                  Get Average of All Data Points
                </Heading>
                <Text color="text" fontWeight={400}>
                  Retrive a summary of the averages of all data points
                </Text>
                <Text color="text" fontWeight={400}></Text>
                <Code colorScheme="green" fontSize="2xl" mt={4}>
                  GET
                </Code>
                <Code colorScheme="green" fontSize="2xl" mt={4} ml={4}>
                  /api/averages
                </Code>
              </Box>
              <Box>
                <Tabs variant="soft-rounded" colorScheme="green">
                  <TabList>
                    <Tab>API Call (Node.js)</Tab>
                    <Tab>Response</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel>
                      <Code
                        whiteSpace={"pre"}
                        d="block"
                        overflow="scroll"
                        height="300px"
                        width="600px"
                      >{`
const resp = await fetch("/api/averages");
const data = await resp.json();
                      `}</Code>
                    </TabPanel>
                    <TabPanel>
                      <Code
                        whiteSpace={"pre"}
                        d="block"
                        overflow="scroll"
                        height="300px"
                        width="600px"
                      >
                        {`
{
  "data": {
      "coAvg": 8.33795870833334,
      "tempAvg": 24.321410586062402,
      "humidityAvg": 50.83711167086482
  }
}`}
                      </Code>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Box>
            </SimpleGrid>
          </Box>
        </SideBar>
      </Box>
    </>
  );
}
