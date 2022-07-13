import { Box, Flex, Text, Icon } from "@chakra-ui/react";

export const IconCard = ({ icon, title, desc, color }) => {
  return (
    <Box>
      <Box
        p={2}
        shadow="md"
        rounded="md"
        transition="all 0.2s"
        _hover={{
          bg: "lightgreen",
          transform: "scale(1.05)",
        }}
      >
        <Flex alignItems="center">
          <Icon
            as={icon}
            fontSize="3xl"
            color="white"
            bg={color}
            p={1}
            rounded="md"
          />
          <Text fontWeight="bold" fontSize="lg" ml={4}>
            {title}
          </Text>
        </Flex>
        <Text mt={3}>{desc}</Text>
      </Box>
    </Box>
  );
};
