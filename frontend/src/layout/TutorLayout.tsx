import {
  Box,
  Flex,
  Spacer,
  Text,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuGroup,
  MenuDivider,
  IconButton,
  HStack,
  Stack,
  Link,
  useColorMode,
  useColorModeValue,
  Divider,
} from "@chakra-ui/react";
import { Sun, Moon, Goal, PlusCircle, UserCircle2 } from "lucide-react";
import { Outlet, Link as RouterLink } from "react-router-dom";
import { useReadTeacherMeInfoGet } from "../api/user/user";

export default function TutorLayout() {
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue("white", "gray.800");
  const navColor = useColorModeValue("gray.100", "gray.800");
  const color = useColorModeValue("black", "white");
  const { data } = useReadTeacherMeInfoGet();

  return (
    <Flex direction="column" minH="100vh" width="100%" bg={bg} color={color}>
      <Flex py="1" px="2" boxShadow="sm" gap="6" bg={navColor}>
        <Button variant="ghost" as={RouterLink} to="/" display="flex" gap={1}>
          <Goal />
          <Text fontWeight="bold">quizy</Text>
        </Button>
        <Spacer />
        <HStack>
          <IconButton
            onClick={toggleColorMode}
            size="sm"
            aria-label={"dark-mode-toggler"}
          >
            {colorMode === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </IconButton>
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<UserCircle2 size={16} />}
              size="sm"
            >
              {data?.data.name}
            </MenuButton>
            <MenuList>
              <MenuGroup title="Profile">
                <MenuItem>My Account</MenuItem>
                <MenuItem>Settings</MenuItem>
              </MenuGroup>
              <MenuDivider />
              <MenuItem
                color="red"
                as="a"
                href="/signin"
                onClick={() => localStorage.removeItem("token")}
              >
                Sign out
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>
      <Flex height="100vh">
        <Box w="25%" maxWidth="15rem" p="4">
          <Stack spacing="4">
            <Link as={RouterLink} to="/quiz/create" w="100%">
              <Button colorScheme="blue" w="100%">
                <PlusCircle size={20} className="mr-2" /> Create a quiz
              </Button>
            </Link>
            <Link as={RouterLink} to="/users">
              Users
            </Link>
          </Stack>
        </Box>
        <Divider orientation="vertical" />
        <Box w="75%" p="4">
          <Outlet />
        </Box>
      </Flex>
    </Flex>
  );
}
