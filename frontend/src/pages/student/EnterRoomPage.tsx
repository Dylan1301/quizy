import { SetStateAction, useState } from "react";
import { Heading, Input, Button, Box, Text, Flex } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

export default function EnterRoomPage() {
  const icons = [
    "👩‍🎓",
    "👨‍🎓",
    "👩‍💻",
    "👨‍💻",
    "👩‍🔬",
    "👨‍🔬",
    "👩‍🚀",
    "👨‍🚀",
  ];
  
  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("");

  const handleNameChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    setName(event.target.value);
  };

  const handleIconClick = (icon: SetStateAction<string>) => {
    setSelectedIcon(icon);
  };

  const handleSubmit = () => {
    // Validate name
    if (!name.trim()) {
      alert("Please enter your name.");
      return;
    }

    // Validate selected icon
    if (!selectedIcon) {
      alert("Please select an avatar.");
      return;
    }

    // Proceed with form submission or further actions
  };

  return (
    <Flex direction="column" align="center" justify="center" h="100vh" gap={10}>
      <Heading>Choose Your Name and Avatar</Heading>
      <Input placeholder="Enter your name" value={name} onChange={handleNameChange} width="30%" />
      <Box mt={4}>
        <Text>Select an avatar:</Text>
        <Box display="flex" mt={2}>
          {icons.map((icon) => (
            <Box
              key={icon}
              as="button"
              p={2}
              fontSize="2xl"
              onClick={() => handleIconClick(icon)}
              bg={selectedIcon === icon ? "gray.200" : "transparent"}
              borderRadius="md"
              _hover={{ cursor: "pointer", bg: "gray.200" }}
            >
              {icon}
            </Box>
          ))}
        </Box>
      </Box>
      <Button mt={4} onClick={handleSubmit} as={RouterLink} to="waiting">
        Submit
      </Button>
    </Flex>
  );
}