import {
  SimpleGrid,
  Heading,
  Img,
  Text,
  Button,
  Box,
  HStack,
} from "@chakra-ui/react";
import { useColorModeValue } from "@chakra-ui/react";
export const TwoColWithPic = ({
  title,
  desc,
  button1,
  link1,
  button2,
  link2,
  pic,
  smaller,
}) => {
  const headingColor = useColorModeValue("text.dark", "blue.shade");
  const textColor = useColorModeValue("text.dark", "text.light");
  return (
    <>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={40} alignItems="center">
        <Box textAlign="center">
          <Heading
            as="h1"
            fontSize={smaller ? "3xl" : { base: "4xl", md: "5xl" }}
            color="text"
            mb="4"
            fontWeight="extrabold"
          >
            {title}
          </Heading>
          <Text color="text" fontSize="lg" ml={4}>
            {desc}
          </Text>

          <HStack justifyContent="center" mt={4}>
            <Button
              as="a"
              bg="green.300"
              borderRadius="20px"
              color="white"
              fontSize="lg"
              _hover={{ bg: "green.400" }}
              href={link1}
            >
              {button1}
            </Button>

            <Button
              as="a"
              color="green.300"
              fontSize="lg"
              bg="transparent"
              _hover={{ color: "green.400" }}
              href={link2}
            >
              {button2}
            </Button>
          </HStack>
        </Box>

        <Box d={{ base: "block", lg: "none" }}>
          <Img src={pic} mx="auto" rounded="lg" maxH="300px" shadow="lg" />
        </Box>
      </SimpleGrid>
    </>
  );
};
