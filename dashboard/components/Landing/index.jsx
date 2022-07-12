import {
  Flex,
  Container,
  Heading,
  Stack,
  Text,
  Button,
  Icon,
  IconProps,
} from "@chakra-ui/react";

export const Landing = () => {
  return (
    <Container maxW={"5xl"}>
      <Stack
        textAlign={"center"}
        align={"center"}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 20, md: 28 }}
      >
        <Heading
          fontWeight="black"
          fontSize={{ base: "3xl", sm: "4xl", md: "6xl" }}
          lineHeight={"110%"}
          color="text"
        >
          Environment detection{" "}
          <Text as={"span"} color={"darkgreen"}>
            made easy.
          </Text>
        </Heading>
        <Text color={"gray.500"} maxW={"3xl"} fontSize="md">
          Track air pollution, temperature, carbon monoxide, and five more
          sensors to keep you safe. Take ClimateSafe with you, wherever you go,
          and have the peace of mind that you're in good hands.
        </Text>
        <Stack spacing={6} direction={"row"}>
          <Button rounded={"full"} px={6}>
            Learn more
          </Button>
          <Button
            rounded={"full"}
            px={6}
            color="white"
            bg={"darkgreen"}
            _hover={{ bg: "medgreen" }}
          >
            Get started
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
};
