import React, { ReactNode } from "react";
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  HStack,
  Icon,
  useColorModeValue,
  Link,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  Img,
} from "@chakra-ui/react";
import { FiMenu } from "react-icons/fi";
import { AiOutlineHeart } from "react-icons/ai";
import { User } from "./User";
import { BsTable } from "react-icons/bs";
import { BiCodeAlt } from "react-icons/bi";
import { TbLivePhoto } from "react-icons/tb";
const LinkItems = [
  { name: "Dashboard", icon: AiOutlineHeart, href: "/dashboard" },
  {
    name: "Live Data",
    icon: TbLivePhoto,
    href: "/dashboard/live-data",
  },
  {
    name: "Raw Data",
    icon: BsTable,
    href: "/dashboard/raw-data",
  },
  {
    name: "Developers",
    icon: BiCodeAlt,
    href: "/dashboard/developers",
  },
];

export const SideBar = ({ active, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box minH="100vh" bg="white">
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
        active={active}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent active={active} onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  );
};

const SidebarContent = ({ onClose, active, ...rest }) => {
  return (
    <Box
      // transition="3s ease"
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Flex alignItems="center" as="a" href="/">
          <Img src="/logo.png" h="40px" d="inline" />
          <Text fontSize="xl" fontWeight="black">
            Climate
            <Text as="span" color="darkgreen">
              Safe
            </Text>
          </Text>
        </Flex>{" "}
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem
          key={link.name}
          icon={link.icon}
          href={link.href}
          active={active}
        >
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};

const NavItem = ({ icon, children, href, active, ...rest }) => {
  return (
    <Link
      href={href}
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
    >
      <Flex
        align="center"
        px={4}
        py={2}
        my={3}
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        fontWeight="semibold"
        bg={active === children.toLowerCase() ? "darkgreen" : "transparent"}
        color={active === children.toLowerCase() ? "white" : "text"}
        transition="all 0.2s"
        _hover={{
          bg: "lightgreen",
        }}
        {...rest}
      >
        {icon && <Icon mr="4" fontSize="16" as={icon} />}
        {children}
      </Flex>
    </Link>
  );
};

const MobileNav = ({ onOpen, ...rest }) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-between", md: "flex-end" }}
      {...rest}
    >
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Flex alignItems="center" display={{ base: "flex", md: "none" }}>
        <Img src="/logo.png" h="40px" d="inline" />
        <Text fontSize="xl" fontWeight="black">
          Climate
          <Text as="span" color="darkgreen">
            Safe
          </Text>
        </Text>
      </Flex>

      <HStack spacing={{ base: "0", md: "6" }}>
        <User />
      </HStack>
    </Flex>
  );
};
