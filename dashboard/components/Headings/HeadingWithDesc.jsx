import { Heading, Text, Box } from "@chakra-ui/react";
export const HeadingWithDesc = ({ desc, children, smaller }) => {
  return (
    <Box textAlign="center" maxW="700px" mx="auto">
      <Heading
        as="h1"
        fontSize={{ base: "4xl", md: "5xl" }}
        color="text"
        mb="4"
        fontWeight="extrabold"
      >
        {children}
      </Heading>
      {desc && (
        <Text
          fontWeight="normal"
          color="btext"
          fontSize={{ base: "md", lg: "lg" }}
          my="3"
        >
          {desc}
        </Text>
      )}
    </Box>
  );
};
