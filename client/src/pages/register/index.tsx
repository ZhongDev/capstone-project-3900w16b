import { RegisterForm } from "@/components/RegisterForm";
import { Title } from "@mantine/core";
import Link from "next/link";

export default function Register() {
    return (
        <>
            <Link href="/">
                <Title mb="xl" mt="xl" align="center" color="gold.5">
                    Plateholder
                </Title>
            </Link>
            <RegisterForm />
        </>
    );
}
