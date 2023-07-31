import { RegisterForm } from "@/components/RegisterForm";
import { Title } from "@mantine/core";
import Head from "next/head";
import Link from "next/link";

export default function Register() {
  return (
    <>
      <Head>
        <title> Register </title>
      </Head>
      <Link href="/">
        <Title mb="xl" mt="xl" align="center" color="gold.5">
          Plateholder
        </Title>
      </Link>
      <RegisterForm />
    </>
  );
}
