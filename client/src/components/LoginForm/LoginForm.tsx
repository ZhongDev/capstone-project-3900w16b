import Link from "next/link";
import { useRouter } from "next/router";
import { Card, TextInput, Text, createStyles } from "@mantine/core";
import { useForm } from "@mantine/form";
import { GradientButton } from "../Button";
import { loginRestaurant } from "@/api/auth";
import { useContext } from "react";
import { AuthContext } from "@/providers";

const useStyles = createStyles((theme) => ({
  loginForm: {
    maxWidth: "30rem",
    margin: "auto",
  },
  loginCard: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing.xl,
  },
  title: {
    textAlign: "center",
  },
}));

export const LoginForm = () => {
  const { classes } = useStyles();
  const router = useRouter();
  const authContext = useContext(AuthContext);
  const loginForm = useForm({
    initialValues: {
      email: "",
      password: "",
    },
  });

  const login = ({ email, password }: { email: string; password: string }) => {
    authContext
      ?.login(email, password)
      .then(() => router.push("/menu"))
      .catch((err) => {
        loginForm.setFieldError("password", err.msg);
        loginForm.setFieldError("email", err.msg);
      });
  };

  return (
    <div className={classes.loginForm}>
      <Card radius="lg" p="xl" withBorder className={classes.loginCard}>
        <div className={classes.title}>
          <Text fz="xl" fw={500}>
            Sign In
          </Text>
        </div>
        <div>
          <form onSubmit={loginForm.onSubmit((values) => login(values))}>
            <TextInput
              radius="lg"
              variant="filled"
              required
              type="email"
              mb="sm"
              label="Email"
              placeholder="Email"
              autoComplete="username"
              {...loginForm.getInputProps("email")}
            />
            <TextInput
              radius="lg"
              variant="filled"
              required
              type="password"
              mb="xl"
              label="Password"
              placeholder="Password"
              autoComplete="new-password"
              {...loginForm.getInputProps("password")}
            />
            <GradientButton fullWidth type="submit">
              Sign In
            </GradientButton>
            <Link href="/login">
              <Text align="center" fw={500} mt="lg" color="gold">
                Forgot Password?
              </Text>
            </Link>
          </form>
        </div>
      </Card>
      <Text mt="xl" align="center" fw={500}>
        Don&apos;t have an account?{" "}
        <Link href="/register">
          <Text color="gold" span>
            Register
          </Text>
        </Link>
      </Text>
    </div>
  );
};
