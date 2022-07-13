import { Box, Flex, Text, Icon } from "@chakra-ui/react";

export const MetricCard = ({ icon, desc, num, color }) => {
  return (
    <Box>
      <Box
        p={2}
        shadow="md"
        rounded="md"
        transition="all 0.2s"
        _hover={{
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
          <Text ml={2} fontSize="lg" color="text">
            <Text as="span" color={color} fontWeight="bold">
              {num}
            </Text>{" "}
            {desc}
          </Text>
        </Flex>
      </Box>
    </Box>
  );
};
