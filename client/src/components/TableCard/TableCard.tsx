import { Table, createTable, deleteRestaurantTable } from "@/api/table";
import {
  Paper,
  Flex,
  Title,
  Button,
  Modal,
  Group,
  createStyles,
  Text,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import QRCode from "qrcode.react";
import { useState } from "react";
import { mutate } from "swr";

const downloadQR = () => {
  const canvas = document.getElementById("QRCode") as HTMLCanvasElement;
  const pngUrl = canvas
    .toDataURL("image/png")
    .replace("image/png", "image/octet-stream");
  let downloadLink = document.createElement("a");
  downloadLink.href = pngUrl;
  downloadLink.download = "QRCode.png";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
};

const useStyles = createStyles((theme) => ({
  menuCategory: {
    maxWidth: "50rem",
  },
  menuItems: {
    marginTop: theme.spacing.xl,
  },
}));

export const TableCard = ({ table }: { table: Table }) => {
  const { classes } = useStyles();
  const [opened, { open, close }] = useDisclosure(false);
  const [openedSure, handler] = useDisclosure(false);

  return (
    <Paper
      mb="sm"
      shadow="sm"
      radius="md"
      p="md"
      className={classes.menuCategory}
    >
      <Flex align="center" justify="space-between">
        <Title px="xl" align="center">
          {table.name}
        </Title>
        <Group spacing="xs">
          <Button onClick={open} radius="xl" variant="outline" mr="xs">
            Generate QR Code
          </Button>
          <Modal opened={opened} onClose={close} title="QR Code">
            <Text>QR Code for table: {table.name}</Text>
            <Group position="center">
              <QRCode
                id="QRCode"
                size={256}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                value={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/menu/${table.restaurantId}/${table.id}`}
              />
              <Button onClick={downloadQR}>Save Image</Button>
            </Group>
          </Modal>
          <Button radius="xl" variant="outline" mr="xs" onClick={handler.open}>
            Delete
          </Button>
          <Modal
            opened={openedSure}
            onClose={handler.close}
            title="Are you sure?"
          >
            <Group position="right">
              <Button
                variant="subtle"
                onClick={() => {
                  handler.close();
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  deleteRestaurantTable(table.id).then(() => {
                    mutate("/restaurant/table");
                    close();
                  });
                }}
              >
                Yes
              </Button>
            </Group>
          </Modal>
        </Group>
      </Flex>
    </Paper>
  );
};

export const CreateTable = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [newTableName, setNewTableName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const doCreateTable = () => {
    createTable(newTableName)
      .then(() => {
        mutate("/restaurant/table");
        setNewTableName("");
        close();
      })
      .catch((err) => {
        setErrorMessage(err.msg);
      });
  };

  return (
    <>
      <Button onClick={open} radius="xl" variant="outline">
        New Table
      </Button>
      <Modal
        opened={opened}
        onClose={() => {
          setErrorMessage("");
          close();
        }}
        title="Create a new table"
      >
        <TextInput
          radius="lg"
          variant="filled"
          required
          data-autofocus
          mb="sm"
          error={errorMessage}
          placeholder="Table name"
          value={newTableName}
          onChange={(e) => {
            setErrorMessage("");
            setNewTableName(e.target.value);
          }}
        />
        <Group position="right">
          <Button
            variant="subtle"
            onClick={() => {
              setNewTableName("");
              close();
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!newTableName}
            onClick={doCreateTable}
          >
            Create Table
          </Button>
        </Group>
      </Modal>
    </>
  );
};
