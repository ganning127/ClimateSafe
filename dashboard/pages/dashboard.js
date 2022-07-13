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
import { BiGasPump, BiMicrochip } from "react-icons/bi";
import { BsLightbulb } from "react-icons/bs";
import { TbNumber1, TbNumber2, TbNumber3 } from "react-icons/tb";
import { SideBar } from "../components/SideBar";

export default function Dashboard({ isConnected }) {
  return (
    <>
      <Head>
        <title>ClimateSafe | Detecting Air Pollution</title>
      </Head>

      <SideBar isConnected={isConnected} />
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
