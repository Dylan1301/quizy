import { useEffect, useState } from "react";
import {
  Button,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";

// Using Chakra UI component table, list all users in this API http://localhost:8000/users
// Use the useEffect hook to fetch the data from the API
// Use the useState hook to store the data
// Use the Chakra UI Table component to display the data
// Use the Chakra UI Button component to delete a user
// Use the Chakra UI Button component to edit a user
// Use the Chakra UI Button component to add a user
// Use the Chakra UI Modal component to add a user
// Use the Chakra UI Modal component to edit a user
// Use the Chakra UI Modal component to delete a user
// Use the Chakra UI Input component to add a user

interface User {
  email: string;
  hashed_password: string;
  id: number;
  username: string;
}

export default function UserPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    username: "",
  });

  useEffect(() => {
    fetch(`http://localhost:8000/users`)
      .then((r) => r.json())
      .then(setUsers);
  }, []);

  const handleAddUser = () => {
    fetch(`http://localhost:8000/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    })
      .then((r) => r.json())
      .then((data) => {
        setUsers((users) => [...users, data]);
        setIsOpen(false);
      });
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Add User</Button>
      <Table>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Username</Th>
          </Tr>
        </Thead>
        <Tbody>
          {users.map((user) => (
            <Tr key={user.id}>
              <Td>{user.username}</Td>
              <Td>{user.email}</Td>
              <Td>{user.hashed_password}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add User</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
            <Input
              placeholder="Email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
            />
            <Input
              placeholder="Username"
              value={newUser.username}
              onChange={(e) =>
                setNewUser({ ...newUser, username: e.target.value })
              }
            />
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleAddUser}>Add User</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
