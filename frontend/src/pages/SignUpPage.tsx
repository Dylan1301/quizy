import { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Input,
  Heading,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Chrome } from "lucide-react";
import { firebaseAuth } from "../utils/constants";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const toast = useToast();

  const signUpWithEmailPassword = async () => {
    try {
      await createUserWithEmailAndPassword(firebaseAuth, email, password);
      toast({
        title: "Account created.",
        description: "We've created your account for you.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });

      navigate("/home");
    } catch (error) {
      console.error(error);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(firebaseAuth, new GoogleAuthProvider());
      navigate("/home");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card className="max-w-sm mx-auto">
      <CardHeader>
        <Heading size="md">Sign Up</Heading>
        <Text fontSize="sm">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Blanditiis,
          similique.
        </Text>
      </CardHeader>

      <CardBody>
        <Stack spacing="4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
          />

          <Button onClick={signUpWithEmailPassword}>Sign up</Button>
          <Button
            onClick={signInWithGoogle}
            variant="outline"
            bgColor="green.200"
          >
            <Chrome className="mr-2" /> Sign up with Google
          </Button>
        </Stack>
      </CardBody>
    </Card>
  );
}
// ...
