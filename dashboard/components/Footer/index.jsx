import {
  ButtonGroup,
  Container,
  IconButton,
  Stack,
  Text,
  Flex,
  Img,
} from "@chakra-ui/react";
import * as React from "react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

export const Footer = () => (
  <Container as="footer" role="contentinfo" py={{ base: "12", md: "16" }}>
    <Stack spacing={{ base: "4", md: "5" }}>
      <Stack justify="space-between" direction="row" align="center">
        <Flex alignItems="center">
          <Img src="/logo.png" h="40px" d="inline" />
          <Text fontSize="xl" fontWeight="black">
            Climate
            <Text as="span" color="darkgreen">
              Safe
            </Text>
          </Text>
        </Flex>
        <ButtonGroup variant="ghost">
          <IconButton
            as="a"
            href="#"
            aria-label="LinkedIn"
            icon={<FaLinkedin fontSize="1.25rem" />}
          />
          <IconButton
            as="a"
            href="#"
            aria-label="GitHub"
            icon={<FaGithub fontSize="1.25rem" />}
          />
          <IconButton
            as="a"
            href="#"
            aria-label="Twitter"
            icon={<FaTwitter fontSize="1.25rem" />}
          />
        </ButtonGroup>
      </Stack>
      <Text fontSize="sm" color="subtle">
        &copy; {new Date().getFullYear()} ClimateSafe, Inc. All rights reserved.
      </Text>
    </Stack>
  </Container>
);
