import { LoginForm } from "@/components/LoginForm";
import { Title } from "@mantine/core";
import Link from "next/link";

export default function Login() {
  return (
    <>
      <Link href="/">
        <Title mb="xl" mt="xl" align="center" color="gold.5">
          Plateholder
        </Title>
      </Link>
      <LoginForm />
    </>
  );
}
