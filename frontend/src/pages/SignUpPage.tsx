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
import { Link as RouterLink } from "react-router-dom";
import { ChevronLeftIcon } from "@chakra-ui/icons";

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
      const { user } = await signInWithPopup(
        firebaseAuth,
        new GoogleAuthProvider()
      );
      console.log(user);
      
      setIsSigningGoogle(false);
      // navigate("/home");
    } catch (error) {
      setIsSigningGoogle(false);
      console.error(error);
    }
  };

  return (
    <Flex direction="column" align="center" justify="center">
            <Link as={RouterLink} to="/signin" className="absolute top-4 left-4">
              <ChevronLeftIcon width="45px" height="45px" mt={3}/>
            </Link>
          <div className="Quizzy text-center text-black text-2xl mt-10 font-extrabold font-['Public Sans']">QUIZZY</div>
          <Heading fontWeight="bold" fontSize="36px" letterSpacing="-0.02em" textAlign="center" marginTop="125px">Sign-up as Instructor</Heading>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack>
              <FormControl isInvalid={!!errors.name}>
                <Input marginTop="50px" width="400px" borderWidth="4px" borderColor="black" _hover={{ borderColor: "black" }}
                  id="name"
                  textAlign="center"
                  placeholder="Name"
                  {...register("name")}
                />
                <FormErrorMessage>
                  {errors.name && errors.name.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.email}>
                <Input marginTop="10px" width="400px" borderWidth="4px" borderColor="black" _hover={{ borderColor: "black" }}
                  id="email"
                  textAlign="center"
                  placeholder="Email Address"
                  {...register("email")}
                />
                <FormErrorMessage>
                  {errors.email && errors.email.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.password}>
                <Input marginTop="10px" width="400px" borderWidth="4px" borderColor="black" _hover={{ borderColor: "black" }}
                  id="password"
                  type="password"
                  textAlign="center"
                  placeholder="Password"
                  {...register("password")}
                />
                <FormErrorMessage>
                  {errors.password && errors.password.message}
                </FormErrorMessage>
              </FormControl>

              <Text fontSize="sm" color="gray" textAlign="center" marginTop="10px">
              Already have an account?
                <Link as={RouterLink} to="/signin" color="blue.500" ml={1}>
                  <strong>Sign in</strong>
                </Link>
              </Text>
            <Stack direction="row" justify="center" align="center" spacing="10px" mt="40px">
              <Button type="submit" isLoading={isSubmitting}  width="180px" height="50px" overflow="hidden" backgroundColor="black" textColor="white" _hover={{ bg: "#474747" }}>
                Sign up
              </Button>
            </Stack>
              {/* <Button
                onClick={signInWithGoogle}
                variant="outline"
                isLoading={isSigningGoogle}
              >
                <Chrome className="mr-2" /> Sign up with Google
              </Button> */}
            </Stack>
          </form>
    </Flex>
  );
}
// ...
