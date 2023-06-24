import {
    Title,
    createStyles,
    Header,
    Container,
    Text,
    Button,
    Group,
    rem,
} from "@mantine/core";
import Image from "next/image";
import { getMe } from "@/api/auth";
import useSWR from "swr";
import PlateHolderImg from "@/public/img/landing_ramen.png";
import Head from "next/head";
import { useRouter } from "next/router";

const useStyles = createStyles((theme) => ({
    header: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        margin: rem(25),
    },
    logo: {
        userSelect: "none",
        cursor: "pointer",
    },
    welcome: {
        //paddingTop: `calc(${theme.spacing.xl} * 4)`,
    },
    outer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        margin: rem(50),
        paddingTop: `calc(${theme.spacing.xl} * 4)`,
    },
    title: {
        color: theme.colorScheme === "dark" ? theme.white : theme.black,
        fontSize: rem(44),
        fontWeight: 400,

        [theme.fn.smallerThan("xs")]: {
            fontSize: rem(28),
        },
    },
    image: {
        //paddingTop: `calc(${theme.spacing.xl} * 4)`,
    },
}));

export default function Home() {
    const { data, error, isLoading } = useSWR("/me", getMe);
    const { classes } = useStyles();
    const router = useRouter();

    return (
        <>
            <Head>
                <title>Plateholder | Welcome to the future of ordering</title>
            </Head>
            <Header height={100}>
                <div className={classes.header}>
                    <Title
                        className={classes.logo}
                        mb="xl"
                        mt="xl"
                        color="gold.5"
                        onClick={() => router.reload()}
                    >
                        Plateholder
                    </Title>
                    <Group>
                        <Button
                            variant="subtle"
                            size="xl"
                            color="dark"
                            onClick={() => router.push("/register")}
                        >
                            Join Now
                        </Button>
                        <Button
                            variant="outline"
                            radius="xl"
                            size="xl"
                            onClick={() => router.push("/login")}
                        >
                            Sign In
                        </Button>
                    </Group>
                </div>
            </Header>
            <div className={classes.outer}>
                <div className={classes.welcome}>
                    <Container>
                        <Title className={classes.title}>
                            Welcome to the <br /> future of ordering
                        </Title>
                        <Text mt="md">
                            Experience a new era of business efficiency with out
                            smartphone-based order management system. Streamline
                            your operations anytime, anywhere. Manage, monitor
                            and process orders with a tap. Boost productivity,
                            reduce errors, and save valuable time. Empower your
                            team and delight your customers with improved
                            accuracy and faster service. It's more than an order
                            management system - it's your business, simplified.
                            Revolutionize your order process today.
                        </Text>
                    </Container>
                </div>
                <Image
                    className={classes.image}
                    src={PlateHolderImg}
                    sizes="(max-width: 800px) 100vw, (max-width: 582px) 50vw, 33vw"
                    alt="Picture of software usage"
                ></Image>
            </div>
        </>
    );
}
