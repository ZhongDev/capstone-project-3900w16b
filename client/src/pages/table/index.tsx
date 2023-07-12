import { useState } from "react";
import {
  Paper,
  Title,
  Loader,
  Button,
  createStyles,
  Flex,
  Modal,
  TextInput,
  Group,
  Text,
  Accordion,
  ButtonProps,
  Textarea,
  NumberInput,
} from "@mantine/core";
import QRCode from "qrcode.react";
import { useDisclosure } from "@mantine/hooks";
import useSWR, { mutate } from "swr";
import { Sidebar } from "@/components/Sidebar";

import {
  Table,
  createTable,
  getRestaurantTables,
  deleteRestaurantTable,
} from "@/api/table";

const useStyles = createStyles((theme) => ({
  menuSection: {
    marginTop: theme.spacing.xl,
  },
  menuCategory: {
    maxWidth: "50rem",
  },
  menuItems: {
    marginTop: theme.spacing.xl,
  },
}));

export default function TableManagement() {
  const { classes } = useStyles();
  const {
    data: tableData,
    error: tableDataError,
    isLoading: tableDataIsLoading,
  } = useSWR("/restaurant/table", getRestaurantTables);

  return (
    <Sidebar>
      <Flex gap="lg" align="center">
        <Title>Table Setup</Title>
        <CreateTable />
      </Flex>
      <div className={classes.menuSection}>
        {tableDataIsLoading ? (
          <Loader />
        ) : (
          tableData?.tables.map((table) => {
            return <TableCard key={table.id} table={table} />;
          })
        )}
      </div>
    </Sidebar>
  );
}

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

const TableCard = ({ table }: { table: Table }) => {
  const { classes } = useStyles();
  const [opened, { open, close }] = useDisclosure(false);
  const tableURL = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

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
        <div>
          <Button onClick={open} radius="xl" variant="outline" mr="xs">
            Generate QR Code
          </Button>
          <Modal opened={opened} onClose={close} title="QR Code">
            <Text>
              QR Code should display URL: {process.env.NEXT_PUBLIC_BASEURL}
              /restaurant/
              {table.restaurantId}/{table.id}
            </Text>
            <Group position="center">
              <QRCode
                id="QRCode"
                size={256}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                value={tableURL}
              />
              <Button onClick={downloadQR}>Save Image</Button>
            </Group>
          </Modal>
          <Button
            radius="xl"
            variant="outline"
            mr="xs"
            onClick={() => {
              deleteRestaurantTable(table.id).then(() => {
                mutate("/restaurant/table");
                close();
              });
            }}
          >
            Delete
          </Button>
        </div>
      </Flex>
    </Paper>
  );
};

const CreateTable = () => {
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
