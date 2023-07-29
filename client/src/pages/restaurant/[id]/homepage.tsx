import {
  Title,
  createStyles,
  Header,
  Text,
  Button,
  rem,
  Flex,
} from "@mantine/core";
import Image from "next/image";
import PlateHolderImg from "@/public/img/pikachu_food.jpg";
import { useRouter } from "next/router";

const useStyles = createStyles((theme) => ({
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    [theme.fn.smallerThan("xs")]: {
      float: "right",
    },
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
  },
  button: {
    "&:hover": {
      color: theme.colors.gray[0],
      backgroundColor: theme.colors.gold[6],
    },
    [theme.fn.smallerThan("xs")]: {
      display: "right",
    },
  },
  title: {
    mb: "xl",
    mt: "xl",
    size: "3rem",
  },
  buttons: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "20px",
    paddingBottom: `calc(${theme.spacing.xl} * 2)`,
    paddingTop: `calc(${theme.spacing.xl} * 2)`,
  },
}));

export default function HomePage() {
  const { classes } = useStyles();
  const router = useRouter();

  return (
    <>
      <Header height={100}>
        <div className={classes.header}>
          <Title className={classes.title} color="gold.5" ta="center">
            Plateholder
          </Title>
        </div>
      </Header>
      <Text fw={650} size="2rem" ta="center">
        Simply
        <br></br>
        Unbeatable Food.
      </Text>
      <div className={classes.buttons}>
        <Flex
          direction={{ base: "column", sm: "row" }}
          gap={{ base: "sm", sm: "lg" }}
          justify={{ sm: "center" }}
          align="center"
        >
          <Button
            className={classes.button}
            variant="outline"
            radius="xl"
            size="lg"
            onClick={() =>
              router.push(`/restaurant/${router.query.id}/table_selection`)
            }
          >
            Order Now
          </Button>
          <Button
            className={classes.button}
            variant="outline"
            radius="xl"
            size="lg"
            onClick={() => router.reload()}
          >
            Scan QR Code
          </Button>
        </Flex>
      </div>
      <div className={classes.image}>
        <Image
          src={PlateHolderImg}
          sizes="(max-width: 800px) 100vw, (max-width: 582px) 50vw, 33vw"
          alt="Picture of sample restaurant food"
        ></Image>
      </div>
    </>
  );
}
