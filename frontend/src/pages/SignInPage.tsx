import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import {
  Button,
  Input,
  Heading,
  Stack,
  Flex,
  FormControl,
  FormErrorMessage,
  Link,
  useToast,
} from "@chakra-ui/react";
import { ChevronLeft } from "lucide-react";
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/dashboard");
  }, [navigate]);

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
      toast({
        title: "Login failed.",
        description: "Incorrect email or password. Please try again",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
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
    <Flex direction="column" align="center" justify="center">
      <Link as={RouterLink} to="/" className="absolute top-4 left-4">
        <ChevronLeft width="45px" height="45px" className="mt-3" />
      </Link>
      <div className="Quizzy text-center text-black text-2xl mt-10 font-extrabold font-['Public Sans']">
        QUIZZY
      </div>
      <Heading
        fontWeight="bold"
        fontSize="36px"
        letterSpacing="-0.02em"
        textAlign="center"
        marginTop="125px"
      >
        Sign-in as Instructor
      </Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing="4">
          <FormControl isInvalid={!!errors.email}>
            <Input
              marginTop="100px"
              width="400px"
              borderWidth="4px"
              borderColor="black"
              _hover={{ borderColor: "black" }}
              id="email"
              placeholder="Username"
              textAlign="center"
              {...register("email")}
            />
            <FormErrorMessage>
              {errors.email && errors.email.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.password}>
            <Input
              width="400px"
              borderWidth="4px"
              borderColor="black"
              _hover={{ borderColor: "black" }}
              id="password"
              type="password"
              placeholder="Password"
              textAlign="center"
              {...register("password")}
            />
            <FormErrorMessage>
              {errors.password && errors.password.message}
            </FormErrorMessage>
          </FormControl>

          {/* <Button
                onClick={signInWithGoogle}
                variant="outline"
                isLoading={isSigningGoogle}
              >
                <Chrome className="mr-2" /> Sign in with Google
              </Button> */}
          <Stack
            direction="row"
            justify="center"
            align="center"
            spacing="10px"
            mt="80px"
          >
            <Button
              type="submit"
              isLoading={isSubmitting}
              width="180px"
              height="50px"
              overflow="hidden"
              backgroundColor="black"
              textColor="white"
              _hover={{ bg: "#474747" }}
            >
              Sign-in
            </Button>
          </Stack>
          <Link
            as={RouterLink}
            to="/signup"
            color="black"
            ml={1}
            textAlign="center"
            marginTop="40px"
          >
            <u>Sign-up</u>
          </Link>
        </Stack>
      </form>
    </Flex>
  );
}
// ...
