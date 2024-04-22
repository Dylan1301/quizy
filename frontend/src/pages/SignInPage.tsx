import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Input,
  Heading,
  Stack,
  Text,
  Flex,
  FormLabel,
  FormControl,
  FormErrorMessage,
  Link,
  useToast,
} from "@chakra-ui/react";
import { Chrome } from "lucide-react";
import { firebaseAuth } from "../utils/constants";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import fetcher from "../utils/fetcher";
import { Link as RouterLink } from "react-router-dom";

const loginApi = fetcher.path("/login").method("post").create();

const signInFormSchema = z.object({
  email: z.string().min(2).max(50),
  password: z.string().min(6).max(50),
});

export default function SignInPage() {
  const [isSigningGoogle, setIsSigningGoogle] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
  });

  async function onSubmit(values: z.infer<typeof signInFormSchema>) {
    try {
      const { data } = await loginApi(values);
      localStorage.setItem("token", data.access_token);

      toast({
        title: "Login successfully.",
        description: "We'll bring you to dashboard in sec.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
    }
  }

  const signInWithGoogle = async () => {
    setIsSigningGoogle(true);
    try {
      await signInWithPopup(firebaseAuth, new GoogleAuthProvider());
      // navigate("/home");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSigningGoogle(false);
    }
  };

  return (
    <Flex alignItems="center" className="h-screen">
      <Card className="w-full max-w-sm mx-auto">
        <CardHeader pb={0}>
          <Heading size="md">Sign In</Heading>
          <Text fontSize="sm" color="gray">
            Don't have an account?
            <Link as={RouterLink} to="/signup" color="blue.500" ml={1}>
              <strong>Create now</strong>
            </Link>
          </Text>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing="4">
              <FormControl isInvalid={!!errors.email}>
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input
                  id="email"
                  placeholder="Enter your email"
                  {...register("email")}
                />
                <FormErrorMessage>
                  {errors.email && errors.email.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.password}>
                <FormLabel htmlFor="password">Password</FormLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  {...register("password")}
                />
                <FormErrorMessage>
                  {errors.password && errors.password.message}
                </FormErrorMessage>
              </FormControl>

              <Button type="submit" colorScheme="blue" isLoading={isSubmitting}>
                Sign in
              </Button>
              <Button
                onClick={signInWithGoogle}
                variant="outline"
                isLoading={isSigningGoogle}
              >
                <Chrome className="mr-2" /> Sign in with Google
              </Button>
            </Stack>
          </form>
        </CardBody>
      </Card>
    </Flex>
  );
}
// ...
