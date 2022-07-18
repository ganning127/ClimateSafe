import { Avatar, AvatarGroup, Text, Badge, Box, Stack } from "@chakra-ui/react";

export const TeamCard = ({ name, title, pic }) => {
  return (
    <Box textAlign="center">
      <Avatar src={pic} h="150px" w="150px" />
      <Text fontSize="lg" fontWeight="bold">
        {name}
      </Text>
      <Badge colorScheme="green">{title}</Badge>
    </Box>
  );
};
