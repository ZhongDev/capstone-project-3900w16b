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
import { useForm } from "@mantine/form";
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

const TableCard = ({ table }: { table: Table }) => {
  const { classes } = useStyles();

  return (
    <Paper
      mb="sm"
      key={table.id}
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

  return (
    <>
      <Button onClick={open} radius="xl" variant="outline">
        New Table
      </Button>
      <Modal opened={opened} onClose={close} title="Create a new table">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!newTableName) {
              return;
            }
          }}
        >
          <TextInput
            radius="lg"
            variant="filled"
            required
            data-autofocus
            mb="sm"
            placeholder="Table name"
            value={newTableName}
            onChange={(e) => setNewTableName(e.target.value)}
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
              onClick={() => {
                createTable(newTableName).then(() => {
                  mutate("/restaurant/table");
                  setNewTableName("");
                  close();
                });
              }}
            >
              Create Table
            </Button>
          </Group>
        </form>
      </Modal>
    </>
  );
};

const DeleteTable = () => {};
