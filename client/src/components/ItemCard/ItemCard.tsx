import {
  MenuItem,
  createItem,
  deleteMenuItem,
  updateMenuItem,
} from "@/api/menu";
import { formatCurrency } from "@/helpers";
import {
  Text,
  Flex,
  Paper,
  Button,
  Modal,
  TextInput,
  NumberInput,
  Textarea,
  Group,
  ButtonProps,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useEffect } from "react";
import { mutate } from "swr";

export const ItemCard = ({ item }: { item: MenuItem }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [openedSure, handler] = useDisclosure(false);

  const itemForm = useForm({
    initialValues: {
      name: "",
      description: "",
      ingredients: null,
      priceCents: 0,
    },
    validate: {
      priceCents: (value) => (value < 0 ? "Price cannot be less than 0" : null),
    },
  });

  const { setValues } = itemForm;
  useEffect(() => {
    setValues({
      name: item.name,
      description: item.description,
      ingredients: null,
      priceCents: item.priceCents / 100,
    });
  }, [item.description, item.name, item.priceCents, setValues]);

  return (
    <Paper shadow="md" mt="xs" px="xl" py="md" radius="md">
      <Flex align="center" justify="space-between">
        <div>
          <Text fw={500} fz="lg">
            {item.name}
          </Text>
          <Text c="dimmed">{item.description}</Text>
        </div>
        <Flex columnGap="lg" align="center">
          <div>
            <Text fw={500} fz="lg">
              {formatCurrency(item.priceCents)}
            </Text>
          </div>
          <div>
            <Button onClick={open} mr="xs" variant="outline" radius="xl">
              Edit
            </Button>
            <Modal
              opened={opened}
              onClose={close}
              title="Update item information"
            >
              <form
                onSubmit={itemForm.onSubmit((values) => {
                  updateMenuItem(item.id, {
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
                  placeholder="New item name"
                  {...itemForm.getInputProps("name")}
                />
                <NumberInput
                  radius="lg"
                  variant="filled"
                  required
                  data-autofocus
                  mb="sm"
                  placeholder="New item price"
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  formatter={(value) =>
                    !Number.isNaN(parseFloat(value))
                      ? `$${value}`.replace(
                          /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                          ","
                        )
                      : "$ "
                  }
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
                  <Button type="submit">Confirm</Button>
                </Group>
              </form>
            </Modal>
            <Button variant="outline" radius="xl" onClick={handler.open}>
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
                    deleteMenuItem(item.id).then(() => {
                      mutate("/menu");
                      close();
                    });
                  }}
                >
                  Yes
                </Button>
              </Group>
            </Modal>
          </div>
        </Flex>
      </Flex>
    </Paper>
  );
};

export const CreateItem = ({
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
      priceCents: (value) => (value < 0 ? "Price cannot be less than 0" : null),
    },
  });

  return (
    <>
      <Button onClick={open} radius="xl" variant="outline" {...props}>
        Add Item
      </Button>
      <Modal opened={opened} onClose={close} title="Add a new item">
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
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            formatter={(value) =>
              !Number.isNaN(parseFloat(value))
                ? `$${value}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
                : "$ "
            }
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
