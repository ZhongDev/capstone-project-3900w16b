import {
  Menu,
  updateMenuCategory,
  deleteMenuCategory,
  createCategory,
} from "@/api/menu";
import {
  Paper,
  Flex,
  Title,
  Button,
  Modal,
  TextInput,
  Group,
  createStyles,
  ButtonProps,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { mutate } from "swr";
import { CreateItemModal, Items, ReorderItemCard } from "../ItemCard";

const useStyles = createStyles((theme) => ({
  menuCategory: {
    maxWidth: "50rem",
  },
  menuItems: {
    marginTop: theme.spacing.xl,
  },
}));

export type CategoriesProps = {
  menu: Menu[];
};

export const Categories = ({ menu }: CategoriesProps) => {
  return (
    <>
      {menu.map((category) => {
        return <CategoryCard key={category.id} category={category} />;
      })}
    </>
  );
};

export const CategoryCard = ({ category }: { category: Menu }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [openedSure, handler] = useDisclosure(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const { classes } = useStyles();

  const [reorderingItems, setReorderingItems] = useState(false);

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
        <Group spacing="xs">
          <CreateItemModal categoryId={category.id} mr="xs" />
          {category.items.length > 1 && (
            <Button
              onClick={() => {
                setReorderingItems(true);
              }}
              radius="xl"
              variant="outline"
              mr="xs"
            >
              Reorder
            </Button>
          )}
          <Button
            onClick={() => {
              setNewCategoryName(category.name);
              open();
            }}
            radius="xl"
            variant="outline"
            mr="xs"
          >
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
                placeholder={"New category name"}
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
                type="submit"
                onClick={() => {
                  deleteMenuCategory(category.id).then(() => {
                    mutate("/menu");
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
      {category.items.length > 0 && (
        <div className={classes.menuItems}>
          {reorderingItems ? (
            <ReorderItemCard
              categoryId={category.id}
              items={category.items}
              close={() => setReorderingItems(false)}
            />
          ) : (
            <Items items={category.items} />
          )}
        </div>
      )}
    </Paper>
  );
};

export const CreateCategory = (props: ButtonProps) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  return (
    <>
      <Button {...props} onClick={open} radius="xl" variant="outline">
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
