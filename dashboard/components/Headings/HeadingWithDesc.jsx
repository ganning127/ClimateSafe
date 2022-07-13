import { Heading, Text, Box } from "@chakra-ui/react";
export const HeadingWithDesc = ({
  desc,
  children,
  align = "center",
  smaller,
}) => {
  return (
    <Box textAlign={align} maxW="700px" mx={align == "left" ? "" : "auto"}>
      <Heading
        as="h1"
        fontSize={smaller ? "3xl" : { base: "4xl", md: "5xl" }}
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
