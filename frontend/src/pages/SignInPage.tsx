import { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
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
} from "@chakra-ui/react";
import { Chrome } from "lucide-react";
import { firebaseAuth } from "../utils/constants";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const signInWithEmailPassword = async () => {
    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password);
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
        <Heading size="md">Sign In</Heading>
        <Text pt="2" fontSize="sm">
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

          <Button onClick={signInWithEmailPassword}>
            Sign in with Email/Password
          </Button>
          <Button
            onClick={signInWithGoogle}
            variant="outline"
            bgColor="green.200"
          >
            <Chrome className="mr-2" /> Sign in with Google
          </Button>
        </Stack>
      </CardBody>
    </Card>
  );
}
// ...
