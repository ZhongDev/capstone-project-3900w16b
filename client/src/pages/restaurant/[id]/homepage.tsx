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
import PlateHolderImg from "@/public/img/pikachu_food.jpg";
import Head from "next/head";
import { useRouter } from "next/router";
import { useDisclosure } from "@mantine/hooks";
import { wrap } from "module";

const useStyles = createStyles((theme) => ({
  header: {
    display: "flex",
    alignItems: "center",
  },
  image: {
    [theme.fn.smallerThan("xs")]: {
      float: "right",
    },
  },
  button: {
    "&:hover": {
      color: theme.colors.gray[0],
      backgroundColor: theme.colors.gold[6],
    },
    [theme.fn.smallerThan("xs")]: {
      display: "none",
    },
  },
}));

export default function HomePage() {
  const { classes, theme } = useStyles();
  const router = useRouter();

  return (
    <>
      <div>
        <Title mb="xl" mt="xl" size="3rem" color="gold.5" ta="center">
          Plateholder
        </Title>
        <Text fw={500} size="2rem" ta="center">
          Simply
          <br></br>
          Unbeatable Food
        </Text>
        <Group position="center">
          <Button
            className={classes.button}
            variant="outline"
            radius="xl"
            size="lg"
            onClick={() => router.push("/register")}
          >
            Order Now
          </Button>
          <Button
            className={classes.button}
            variant="outline"
            radius="xl"
            size="lg"
            onClick={() => router.push("/login")}
          >
            Scan QR Code
          </Button>
        </Group>
        <Image
          className={classes.image}
          src={PlateHolderImg}
          sizes="(max-width: 800px) 100vw, (max-width: 582px) 50vw, 33vw"
          alt="Picture of sample restaurant food"
        ></Image>
      </div>
    </>
  );
}
