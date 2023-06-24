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
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import useSWR, { mutate } from "swr";
import { Sidebar } from "@/components/Sidebar";
import { GetMenuResponse, createCategory, getMenu } from "@/api/menu";

const useStyles = createStyles((theme) => ({
  menuSection: {
    marginTop: theme.spacing.xl,
  },
  menuCategory: {
    maxWidth: "50rem",
  },
}));

export default function MenuManagement() {
  const { classes } = useStyles();
  const {
    data: menuData,
    error: menuDataError,
    isLoading: menuDataIsLoading,
  } = useSWR("/menu", getMenu);

  return (
    <Sidebar>
      <Flex gap="lg" align="center">
        <Title>Categories</Title>
        <CreateCategory />
      </Flex>
      <div className={classes.menuSection}>
        {menuDataIsLoading ? (
          <Loader />
        ) : (
          menuData?.map((category) => {
            return (
              <Paper
                mb="sm"
                key={category.id}
                shadow="sm"
                radius="md"
                p="md"
                className={classes.menuCategory}
              >
                <Flex align="center" justify="space-between">
                  <Title px="xl" align="center">
                    {category.name}
                  </Title>
                  <div>
                    <Button radius="xl" variant="outline" mr="xs">
                      Edit items
                    </Button>
                    <Button radius="xl" variant="outline" mr="xs">
                      Edit name
                    </Button>
                    <Button radius="xl" variant="outline" mr="xs">
                      Delete
                    </Button>
                  </div>
                </Flex>
              </Paper>
            );
          })
        )}
      </div>
    </Sidebar>
  );
}

function CreateCategory() {
  const [opened, { open, close }] = useDisclosure(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  return (
    <>
      <Button onClick={open} radius="xl" variant="outline">
        New Category
      </Button>
      <Modal opened={opened} onClose={close} title="Create a new category">
        <TextInput
          radius="lg"
          variant="filled"
          required
          mb="sm"
          label="Category name"
          placeholder="Category name"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />
        <Group position="right">
          <Button
            disabled={!newCategoryName}
            onClick={() => {
              createCategory(newCategoryName, 0).then(() => {
                mutate("/menu");
                setNewCategoryName("");
                close();
              });
            }}
          >
            Create Category
          </Button>
        </Group>
      </Modal>
    </>
  );
}
