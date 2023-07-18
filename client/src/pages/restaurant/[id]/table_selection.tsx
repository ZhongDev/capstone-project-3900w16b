import { useState } from "react";
import {
  Title,
  createStyles,
  Header,
  Text,
  Button,
  Flex,
  TextInput,
} from "@mantine/core";
import { useRouter } from "next/router";
import { checkTable } from "@/api/table";

const useStyles = createStyles((theme) => ({
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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
    paddingTop: `calc(${theme.spacing.xl} * 1)`,
  },
  input: {
    width: 250,
  },
  textbox: {
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    paddingTop: `calc(${theme.spacing.xl} * 1)`,
  },
  continueButton: {
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    paddingTop: `calc(${theme.spacing.xl} * 1)`,
  },
}));

export default function HomePage() {
  const { classes } = useStyles();
  const router = useRouter();
  const [newTableName, setNewTableName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const doCheckTable = () => {
    const restaurantId = Number(router.query.id);
    const name = newTableName;
    checkTable(restaurantId, name)
      .then(() => router.push(`/menu/${router.query.id}`))
      .catch((err) => {
        setErrorMessage(err.msg);
      });
    setNewTableName("");
  };

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
        Enter
        <br></br>
        Table Number:
      </Text>
      <div className={classes.textbox}>
        <TextInput
          className={classes.input}
          placeholder="Enter Table Name"
          radius="xl"
          size="xl"
          error={errorMessage}
          value={newTableName}
          onChange={(e) => {
            setNewTableName(e.target.value);
            setErrorMessage("");
          }}
        />
      </div>
      <div className={classes.continueButton}>
        <Button
          color="gold.5"
          radius="xl"
          size="xl"
          onClick={doCheckTable}
          disabled={!newTableName}
        >
          Continue
        </Button>
      </div>
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
            onClick={() => router.reload()}
          >
            Scan QR
          </Button>
          <Button
            className={classes.button}
            variant="outline"
            radius="xl"
            size="lg"
            onClick={() => router.push(`../${router.query.id}/homepage`)}
          >
            Cancel
          </Button>
        </Flex>
      </div>
    </>
  );
}
