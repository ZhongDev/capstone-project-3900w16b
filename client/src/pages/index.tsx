import {
    Title,
    Drawer,
    createStyles,
    Header,
    Container,
    Text,
    Button,
    Burger,
    Group,
    rem,
    ScrollArea,
    Divider,
    UnstyledButton,
    Center,
    Box,
    Collapse,
} from "@mantine/core";
import Image from "next/image";
import { getMe } from "@/api/auth";
import useSWR from "swr";
import PlateHolderImg from "@/public/img/landing_ramen.png";
import Head from "next/head";
import { useRouter } from "next/router";
import { useDisclosure } from "@mantine/hooks";

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
    outer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        margin: rem(50),
        paddingTop: `calc(${theme.spacing.xl} * 4)`,
        [theme.fn.smallerThan("xs")]: {
            display: "inline-block",
            textAlign: "center",
        },
    },
    title: {
        color: theme.colorScheme === "dark" ? theme.white : theme.black,
        fontSize: rem(44),
        fontWeight: 400,

        [theme.fn.smallerThan("xs")]: {
            fontSize: rem(28),
        },
    },
    text: {
        [theme.fn.smallerThan("xs")]: {
            fontSize: rem(15),
        },
    },
    burger: {
        [theme.fn.largerThan("xs")]: {
            display: "none",
        },
    },
    registerButton: {
        [theme.fn.smallerThan("xs")]: {
            display: "none",
        },
    },
    loginButton: {
        "&:hover": {
            color: theme.colors.gray[0],
            backgroundColor: theme.colors.gold[6],
        },
        [theme.fn.smallerThan("xs")]: {
            display: "none",
        },
    },
    image: {
        [theme.fn.smallerThan("xs")]: {
            float: "right",
        },
    },
}));

export default function Home() {
    const { data, error, isLoading } = useSWR("/me", getMe);
    const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
        useDisclosure(false);
    const { classes, theme } = useStyles();
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
                            className={classes.registerButton}
                            variant="subtle"
                            size="xl"
                            color="dark"
                            radius="xl"
                            onClick={() => router.push("/register")}
                        >
                            Join Now
                        </Button>
                        <Button
                            className={classes.loginButton}
                            variant="outline"
                            radius="xl"
                            size="xl"
                            onClick={() => router.push("/login")}
                        >
                            Sign In
                        </Button>
                    </Group>
                    <Burger
                        opened={drawerOpened}
                        onClick={toggleDrawer}
                        className={classes.burger}
                    />
                </div>
            </Header>
            <div className={classes.outer}>
                <div>
                    <Container>
                        <Title className={classes.title}>
                            Welcome to the <br /> future of ordering
                        </Title>
                        <Text mt="md" className={classes.text}>
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
            <Drawer
                opened={drawerOpened}
                onClose={closeDrawer}
                size="100%"
                padding="md"
                className={classes.burger}
                zIndex={1000000}
            >
                <Divider
                    my="sm"
                    color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"}
                />
                <Group position="center" grow pb="xl" px="md">
                    <Button
                        variant="default"
                        radius="xl"
                        onClick={() => router.push("/register")}
                    >
                        Join Now
                    </Button>
                    <Button radius="xl" onClick={() => router.push("/login")}>
                        Sign In
                    </Button>
                </Group>
            </Drawer>
        </>
    );
}
