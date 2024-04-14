import { Button, Link, Stack } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

export default function HomePage() {
  // return links to sign in and sign up pages, dashboard, and users route as Button with gap between them

  return (
    <Stack spacing="4">
      <Link as={RouterLink} to="/signin">
        <Button>Sign In</Button>
      </Link>
      <Link as={RouterLink} to="/signup">
        <Button>Sign Up</Button>
      </Link>
      <Link as={RouterLink} to="/dashboard">
        <Button>Dashboard</Button>
      </Link>
      <Link as={RouterLink} to="/users">
        <Button>Users</Button>
      </Link>
    </Stack>
  );
}
