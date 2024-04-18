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
  useToast,
  Flex,
  FormLabel,
  FormControl,
  FormErrorMessage,
  Link,
} from "@chakra-ui/react";
import { Chrome } from "lucide-react";
import { firebaseAuth } from "../utils/constants";
import fetcher from "../utils/fetcher";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

const signUpApi = fetcher.path("/signup").method("post").create();
const loginApi = fetcher.path("/login").method("post").create();

const signUpFormSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().min(2).max(50),
  password: z.string().min(6).max(50),
});

export default function SignUpPage() {
  const [isSigningGoogle, setIsSigningGoogle] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
  });

  async function onSubmit(values: z.infer<typeof signUpFormSchema>) {
    try {
      await signUpApi(values);
      const { data } = await loginApi({
        email: values.email,
        password: values.password,
      });
      localStorage.setItem("token", data.access_token);
      toast({
        title: "Account created.",
        description: "We've created your account for you.",
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
      setIsSigningGoogle(false);
      // navigate("/home");
    } catch (error) {
      setIsSigningGoogle(false);
      console.error(error);
    }
  };

  return (
    <Flex alignItems="center" className="h-screen">
      <Card className="max-w-sm mx-auto">
        <CardHeader pb={0}>
          <Heading size="md">Sign Up</Heading>
          <Text fontSize="sm">
            Create an account. Already have an account?
            <Link href="/signin" color="blue.500" ml={1}>
              <strong>Sign in</strong>
            </Link>
          </Text>
        </CardHeader>

        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack>
              <FormControl isInvalid={!!errors.name}>
                <FormLabel htmlFor="name">First name</FormLabel>
                <Input
                  id="name"
                  placeholder="Fill your name"
                  {...register("name")}
                />
                <FormErrorMessage>
                  {errors.name && errors.name.message}
                </FormErrorMessage>
              </FormControl>

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
                Sign up
              </Button>
              <Button
                onClick={signInWithGoogle}
                variant="outline"
                isLoading={isSigningGoogle}
              >
                <Chrome className="mr-2" /> Sign up with Google
              </Button>
            </Stack>
          </form>
        </CardBody>
      </Card>
    </Flex>
  );
}
// ...
