import Head from "next/head";
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
import { AiOutlineCloud, AiOutlineFire } from "react-icons/ai";
import { FaTemperatureHigh } from "react-icons/fa";
import { WiSmoke, WiHumidity } from "react-icons/wi";
import { MdOutlineMasks } from "react-icons/md";
import { BiGasPump, BiMicrochip } from "react-icons/bi";
import { BsLightbulb } from "react-icons/bs";
import { TbNumber1, TbNumber2, TbNumber3 } from "react-icons/tb";
import { TwoColWithPic } from "../components/TwoCol/TwoColWithPic";
import { TeamCard } from "../components/Cards/TeamCard";

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
    icon: AiOutlineFire,
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

export default function About() {
  return (
    <>
      <Head>
        <title>ClimateSafe | Detecting Air Pollution</title>
      </Head>
      <NavBar />

      <SmSep />

      <Container maxW="container.xl" p={4}>
        <TwoColWithPic
          title="About Us"
          desc="ClimateSafe is an organization dedicated to the monitoring of air pollution in all places: on the person, in the garage, and in your home. We're a team of high school students from North Carolina."
          pic="/about-us.png"
          link1="/login"
          button1="Get Started"
          link2="/dashboard"
          button2="Dashboard"
        />

        <MedSep line={true} />

        <HeadingWithDesc
          align="center"
          desc="Meet our team, all students from the Duke Summer STEM Academy."
        >
          Our Team
        </HeadingWithDesc>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
          <TeamCard
            name="Ganning Xu"
            title="Software, Dashboard, Arduino Code"
            pic="/Ganning.jpg"
          />
          <TeamCard
            name="Tal Lucas"
            title="Circuitry, Wiring, Arduino"
            pic="/tal.jpg"
          />
          <TeamCard
            name="Anderson Adu-Poku"
            title="Hardware Casing and CAD"
            pic="/anderson.jpg"
          />
          <TeamCard
            name="Abe Cunningham"
            title="Robot Dog, Website"
            pic="/abe.jpg"
          />
        </SimpleGrid>
      </Container>

      <Footer />
    </>
  );
}
