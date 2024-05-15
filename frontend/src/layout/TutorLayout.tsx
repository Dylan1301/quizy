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
} from "@chakra-ui/react";
import { Sun, Moon, Goal, PlusCircle, UserCircle2 } from "lucide-react";
import { Outlet, Link as RouterLink } from "react-router-dom";
import { useReadTeacherMeInfoGet } from "../api/user/user";
import Quizzes from "../components/Quizzes";

export default function TutorLayout() {
  const { colorMode, toggleColorMode } = useColorMode();
  const navColor = useColorModeValue("gray.50", "gray.800");
  const color = useColorModeValue("black", "white");
  const { data } = useReadTeacherMeInfoGet();

  return (
    <Flex
      direction="column"
      minH="100vh"
      width="100%"
      bg={navColor}
      color={color}
    >
      <Flex height="3rem" py="1" px="2" boxShadow="sm" gap="6">
        <Button
          variant="ghost"
          as={RouterLink}
          to="/dashboard"
          display="flex"
          gap={1}
        >
          <Goal />
          <Text fontWeight="bold">quizzy</Text>
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
      <Flex>
        <Box w="25%" maxWidth="24rem" p="4" className="border border-r">
          <Stack spacing="4">
            <Link as={RouterLink} to="/quiz/create" w="100%">
              <Button colorScheme="blue" w="100%">
                <PlusCircle size={20} className="mr-2" /> Create a quiz
              </Button>
            </Link>
            <Quizzes />
          </Stack>
        </Box>
        <Box
          w="75%"
          height="calc(100vh - 3rem)"
          overflow="auto"
          flexGrow={1}
          p="4"
        >
          <Outlet />
        </Box>
      </Flex>
    </Flex>
  );
}
