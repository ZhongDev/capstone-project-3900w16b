import { LoginForm } from "@/components/LoginForm";
import { Title } from "@mantine/core";
import Head from "next/head";
import Link from "next/link";

export default function Login() {
  return (
    <>
      <Head>
        <title> Log In</title>
      </Head>
      <Link href="/">
        <Title mb="xl" mt="xl" align="center" color="gold.5">
          Plateholder
        </Title>
      </Link>
      <LoginForm />
    </>
  );
}
