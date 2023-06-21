import { useRouter } from "next/router";
import { Card, TextInput, Text, createStyles } from "@mantine/core";
import { useForm } from "@mantine/form";
import { GradientButton } from "../GradientButton";
import request from "@/api/request";

const useStyles = createStyles((theme) => ({
  registerForm: {
    maxWidth: "30rem",
    margin: "auto",
  },
  registerCard: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing.xl,
  },
  title: {
    textAlign: "center",
  },
}));

export const RegisterForm = () => {
  const { classes } = useStyles();
  const router = useRouter();

  const registerForm = useForm({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validate: {
      confirmPassword: (value, values) =>
        value === values.password
          ? null
          : "Confirmation password differs from password",
    },
  });

  const register = ({
    email,
    name,
    password,
  }: {
    email: string;
    name: string;
    password: string;
  }) => {
    request
      .post(process.env.NEXT_PUBLIC_BASEURL + "/restaurant", {
        email,
        name,
        password,
      })
      .then((res) => router.push("/"))
      .catch((err) => {
        if (err.response) {
          /**
           * For now, the only non 500 error thrown during registering is
           * 400: email already taken. We will just assume it is always this for now.
           */
          registerForm.setFieldError("email", err.response.data.msg);
        }
      });
  };

  return (
    <div className={classes.registerForm}>
      <Card radius="lg" p="xl" withBorder className={classes.registerCard}>
        <div className={classes.title}>
          <Text fz="xl">Register Account</Text>
        </div>
        <div>
          <form
            onSubmit={registerForm.onSubmit((values) =>
              register({ ...values, name: "test" })
            )}
          >
            <TextInput
              radius="lg"
              variant="filled"
              required
              type="email"
              mb="sm"
              label="Your email"
              placeholder="Your email"
              autoComplete="username"
              {...registerForm.getInputProps("email")}
            />
            <TextInput
              radius="lg"
              variant="filled"
              required
              type="password"
              mb="sm"
              label="Password"
              placeholder="Password"
              autoComplete="new-password"
              {...registerForm.getInputProps("password")}
            />
            <TextInput
              radius="lg"
              variant="filled"
              required
              type="password"
              mb="xl"
              label="Confirm Password"
              placeholder="Confirm Password"
              autoComplete="new-password"
              {...registerForm.getInputProps("confirmPassword")}
            />
            <GradientButton fullWidth type="submit">
              Register
            </GradientButton>
          </form>
        </div>
      </Card>
    </div>
  );
};
