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
  createCategory,
  updateMenuCategory,
  deleteMenuCategory,
  createItem,
  updateMenuItem,
  deleteMenuItem,
  getMenu,
  Menu,
  MenuItem,
} from "@/api/menu";
import { formatCurrency } from "@/helpers";

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
          menuData?.menu.map((category) => {
            return <CategoryCard key={category.id} category={category} />;
          })
        )}
      </div>
    </Sidebar>
  );
}

const Item = ({ item }: { item: MenuItem }) => {
  return (
    <Paper shadow="md" mt="xs" px="xl" py="md" radius="md">
      <Flex align="center" justify="space-between">
        <div>
          <Text fw={500} fz="lg">
            {item.name}
          </Text>
          <Text c="dimmed">{item.description}</Text>
        </div>
        <div>
          <Text fw={500} fz="lg">
            {formatCurrency(item.priceCents)}
          </Text>
        </div>
        {/* <div>
          <Button mr="xs" variant="outline" radius="xl">
            Edit
          </Button>
          <Button variant="outline" radius="xl">
            Delete
          </Button>
        </div> */}
      </Flex>
    </Paper>
  );
};

const CategoryCard = ({ category }: { category: Menu }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const { classes } = useStyles();

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
          <CreateItem categoryId={category.id} mr="xs" />
          <Button onClick={open} radius="xl" variant="outline" mr="xs">
            Edit name
          </Button>
          <Modal opened={opened} onClose={close} title="Rename category">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newCategoryName) {
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
                placeholder="Category name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
              <Group position="right">
                <Button
                  variant="subtle"
                  onClick={() => {
                    setNewCategoryName("");
                    close();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!newCategoryName}
                  onClick={() => {
                    updateMenuCategory(category.id, {
                      name: newCategoryName,
                    }).then(() => {
                      mutate("/menu");
                      setNewCategoryName("");
                      close();
                    });
                  }}
                >
                  Confirm
                </Button>
              </Group>
            </form>
          </Modal>
          <Button
            radius="xl"
            variant="outline"
            mr="xs"
            onClick={() => {
              deleteMenuCategory(category.id).then(() => {
                mutate("/menu");
                close();
              });
            }}
          >
            Delete
          </Button>
        </div>
      </Flex>
      <div className={classes.menuItems}>
        {category.items.map((item) => {
          return <Item key={item.id} item={item} />;
        })}
      </div>
    </Paper>
  );
};

const CreateItem = ({
  categoryId,
  ...props
}: {
  categoryId: number;
} & ButtonProps) => {
  const [opened, { open, close }] = useDisclosure(false);

  const itemForm = useForm({
    initialValues: {
      name: "",
      description: "",
      ingredients: null,
      priceCents: 0,
    },
    validate: {
      priceCents: (value, values) =>
        value < 0 ? "Price cannot be less than 0" : null,
    },
  });

  return (
    <>
      <Button onClick={open} radius="xl" variant="outline" {...props}>
        Add Item
      </Button>
      <Modal opened={opened} onClose={close} title="Add a new category item">
        <form
          onSubmit={itemForm.onSubmit((values) => {
            createItem(categoryId, {
              ...values,
              priceCents: values.priceCents * 100,
            }).then(() => {
              mutate("/menu");
              itemForm.reset();
              close();
            });
          })}
        >
          <TextInput
            radius="lg"
            variant="filled"
            required
            data-autofocus
            mb="sm"
            placeholder="Item name"
            {...itemForm.getInputProps("name")}
          />
          <NumberInput
            radius="lg"
            variant="filled"
            required
            data-autofocus
            mb="sm"
            placeholder="Price"
            precision={2}
            step={0.1}
            {...itemForm.getInputProps("priceCents")}
          />
          <Textarea
            radius="lg"
            variant="filled"
            required
            mb="sm"
            placeholder="Item description"
            withAsterisk
            {...itemForm.getInputProps("description")}
          />
          <Group position="right">
            <Button
              variant="subtle"
              onClick={() => {
                itemForm.reset();
                close();
              }}
            >
              Cancel
            </Button>
            <Button type="submit">Create Item</Button>
          </Group>
        </form>
      </Modal>
    </>
  );
};

const CreateCategory = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  return (
    <>
      <Button onClick={open} radius="xl" variant="outline">
        New Category
      </Button>
      <Modal opened={opened} onClose={close} title="Create a new category">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!newCategoryName) {
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
            placeholder="Category name"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
          <Group position="right">
            <Button
              variant="subtle"
              onClick={() => {
                setNewCategoryName("");
                close();
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!newCategoryName}
              onClick={() => {
                createCategory(newCategoryName).then(() => {
                  mutate("/menu");
                  setNewCategoryName("");
                  close();
                });
              }}
            >
              Create Category
            </Button>
          </Group>
        </form>
      </Modal>
    </>
  );
};
