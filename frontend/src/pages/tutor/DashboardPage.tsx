import { Box, Heading } from "@chakra-ui/react";
import { useReadTeacherMeInfoGet } from "../../api/user/user";

export default function DashboardPage() {
  const { data } = useReadTeacherMeInfoGet();

  return (
    <Box>
      <Heading>Welcome back, {data?.data.name}</Heading>
    </Box>
  );
}
