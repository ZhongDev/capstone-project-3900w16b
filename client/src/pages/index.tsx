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
  Divider,
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
    justifyContent: "space-between",
    paddingTop: `calc(${theme.spacing.xl} * 4)`,
    [theme.fn.smallerThan("sm")]: {
      padding: rem(10),
      display: "inline-block",
      textAlign: "center",
    },
  },
  title: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontSize: rem(60),
    fontWeight: 700,

    [theme.fn.smallerThan("sm")]: {
      fontSize: rem(45),
    },
  },
  highlight: { color: theme.colors.gold[5] },
  text: {
    fontSize: rem(15),
    [theme.fn.smallerThan("sm")]: {
      fontSize: rem(15),
    },
  },
  burger: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },
  registerButton: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },
  loginButton: {
    "&:hover": {
      color: theme.colors.gray[0],
      backgroundColor: theme.colors.gold[6],
    },
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },
  image: {
    width: rem(450),
    height: "auto",
    [theme.fn.smallerThan("md")]: {
      width: rem(250),
    },
    [theme.fn.smallerThan("sm")]: {
      display: "none",
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
        <Container>
          <Title className={classes.title}>
            Welcome to the
            <Text inherit className={classes.highlight}>
              future of ordering
            </Text>
          </Title>
          <Text mt="md" className={classes.text}>
            Experience a new era of business efficiency with our
            smartphone-based order management system. Streamline your operations
            anytime, anywhere. Manage, monitor and process orders with a tap.
            Boost productivity, reduce errors, and save valuable time. Empower
            your team and delight your customers with improved accuracy and
            faster service. It&apos;s more than an order management system -
            it&apos;s your business, simplified. Revolutionize your order
            process today.
          </Text>
        </Container>
        <Image
          className={classes.image}
          src={PlateHolderImg}
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
