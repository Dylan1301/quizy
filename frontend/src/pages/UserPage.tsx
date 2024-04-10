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
import fetcher from "../utils/fetcher";
import { FetchReturnType } from "openapi-typescript-fetch";

const usersGet = fetcher.path("/users/").method("get").create();
type UsersGetResponse = FetchReturnType<typeof usersGet>;

export default function UserPage() {
  const [users, setUsers] = useState<UsersGetResponse>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    username: "",
  });

  useEffect(() => {
    usersGet({}).then((r) => setUsers(r.data));
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
      <h1 className="font-bold text-4xl">This is demo User page</h1>
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
