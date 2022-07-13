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
import { Footer } from "../components/Footer";
import { Landing } from "../components/Landing";
import { NavBar } from "../components/NavBar";
import { MedSep } from "../components/Separators/MedSep";
import { SmSep } from "../components/Separators/SmSep";
import { IconCard } from "../components/Cards/IconCard";
import { HeadingWithDesc } from "../components/Headings/HeadingWithDesc";
import { AiOutlineCloud } from "react-icons/ai";
import { FaTemperatureHigh } from "react-icons/fa";
import { WiSmoke, WiHumidity } from "react-icons/wi";
import { MdOutlineMasks } from "react-icons/md";
import { BiGasPump } from "react-icons/bi";
import { BsLightbulb } from "react-icons/bs";

const detects = [
  {
    icon: AiOutlineCloud,
    title: "Carbon Monoxide",
    desc: "Carbon Monoxide is an invisible and odorless gas deadly in high concentrations.",
    color: "orange.300",
  },
  {
    icon: FaTemperatureHigh,
    title: "Temperature",
    desc: "High temperatures can lead to heat stoke, skin damage, and other health problems.",
    color: "red.300",
  },
  {
    icon: WiSmoke,
    title: "Gas Smoke",
    desc: "Carbon Dioxide and soot have been known to cause harmful effects on the environment and humans.",
    color: "yellow.300",
  },
  {
    icon: MdOutlineMasks,
    title: "Air Pollution",
    desc: "7 million people die yearly from air pollution (WHO). We're detection airborne particles.",
    color: "blue.300",
  },
  {
    icon: WiHumidity,
    title: "Humidity",
    desc: "While debated, levels of high humidity can make heat stroke much more likely.",
    color: "green.300",
  },
  {
    icon: BiGasPump,
    title: "Combustable Gas",
    desc: "Being in exposure to combustible gases can burn in the presence of oxygen.",
    color: "purple.300",
  },
  {
    icon: BsLightbulb,
    title: "Photosensitive Light",
    desc: "Photosensitivity is heightened skin sensitivity or an unusual reaction when your skin is exposed to UV radiation from sunlight or a tanning bed.",
    color: "teal.300",
  },
];

export default function Home({ isConnected }) {
  return (
    <>
      <Head>
        <title>ClimateSafe | Detecting Air Pollution</title>
      </Head>
      <NavBar />

      <Container maxW="container.xl" p={4}>
        <Landing />

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
          {detects.map((detect, index) => (
            <IconCard
              key={index}
              icon={detect.icon}
              title={detect.title}
              desc={detect.desc}
              color={detect.color}
            />
          ))}
        </SimpleGrid>

        <MedSep line={true} />

        <SimpleGrid
          columns={{ base: 1, md: 2 }}
          alignItems="center"
          spacing={40}
        >
          <Box>
            <Heading
              as="h1"
              fontSize={"4xl"}
              color="text"
              textAlign={{ base: "center", md: "left" }}
              mb="4"
              fontWeight="extrabold"
            >
              ESP32. Code. Magic.
            </Heading>
            <Text mt={3} textAlign={{ base: "center", md: "left" }}>
              Using a Heltec Wifi Kit 32, we connect 8 sensors to measure all
              everything mentioned above, and more.
            </Text>
          </Box>
          <Img
            src="/arduino-code.png"
            maxH="150px"
            shadow="xl"
            mx="auto"
            borderRadius={16}
          />
        </SimpleGrid>

        <MedSep />
      </Container>
      <MedSep line={true} />
      <Footer />
    </>
  );
}

export async function getServerSideProps(context) {
  try {
    await clientPromise;
    // `await clientPromise` will use the default database passed in the MONGODB_URI
    // However you can use another database (e.g. myDatabase) by replacing the `await clientPromise` with the following code:
    //
    // `const client = await clientPromise`
    // `const db = client.db("myDatabase")`
    //
    // Then you can execute queries against your database like so:
    // db.find({}) or any of the MongoDB Node Driver commands

    return {
      props: { isConnected: true },
    };
  } catch (e) {
    console.error(e);
    return {
      props: { isConnected: false },
    };
  }
}
