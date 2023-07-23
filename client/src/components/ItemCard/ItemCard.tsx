import {
  MenuItem,
  createItem,
  deleteMenuItem,
  updateMenuItem,
} from "@/api/menu";
import { formatCurrency } from "@/helpers";
import {
  rem,
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
  createStyles,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { it } from "node:test";
import { useEffect } from "react";
import { mutate } from "swr";

const useStyles = createStyles((theme) => ({
  estTimeGroup: {
    display: "flex",
    alignItems: "center",
    position: "relative",
    justifyContent: "space-between",
    flexWrap: "nowrap",
  },
}));

export type ItemsProps = {
  items: MenuItem[];
};

export const Items = ({ items }: ItemsProps) => {
  return (
    <>
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </>
  );
};

export const ItemCard = ({ item }: { item: MenuItem }) => {
  const { classes } = useStyles();
  const [opened, { open, close }] = useDisclosure(false);
  const [openedSure, handler] = useDisclosure(false);

  const itemForm = useForm({
    initialValues: {
      name: "",
      description: "",
      ingredients: null,
      priceCents: 0,
      minPrepMins: 0,
      maxPrepMins: 0,
    },
    validate: {
      priceCents: (value) => (value < 0 ? "Price cannot be less than 0" : null),
      minPrepMins: (value) =>
        value < 0 ? "Prep time cannot be less than 0" : null,
      maxPrepMins: (value) =>
        value < 0 ? "Prep time cannot be less than 0" : null,
    },
  });

  const { setValues } = itemForm;
  const populateForm = () => {
    setValues({
      name: item.name,
      description: item.description,
      ingredients: null,
      priceCents: item.priceCents / 100,
      minPrepMins: item.minPrepMins,
      maxPrepMins: item.maxPrepMins,
    });
  };

  useEffect(populateForm, [
    item.description,
    item.name,
    item.priceCents,
    setValues,
  ]);

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
          <Group spacing="xs">
            <Button
              onClick={() => {
                populateForm();
                open();
              }}
              mr="xs"
              variant="outline"
              radius="xl"
            >
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
                <Text fz="xs">Estimated preparation time (minutes):</Text>
                <Group className={classes.estTimeGroup} grow>
                  <NumberInput
                    radius="lg"
                    variant="filled"
                    mb="xs"
                    description="Min"
                    {...itemForm.getInputProps("minPrepMins")}
                  />
                  <NumberInput
                    radius="lg"
                    variant="filled"
                    mb="xs"
                    description="Max"
                    {...itemForm.getInputProps("maxPrepMins")}
                  />
                </Group>
                <Group position="right">
                  <Button variant="subtle" onClick={close}>
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
          </Group>
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
  const { classes } = useStyles();
  const [opened, { open, close }] = useDisclosure(false);

  const itemForm = useForm({
    initialValues: {
      name: "",
      description: "",
      ingredients: null,
      priceCents: 0,
      minPrepMins: 0,
      maxPrepMins: 0,
    },
    validate: {
      priceCents: (value) => (value < 0 ? "Price cannot be less than 0" : null),
      minPrepMins: (value) =>
        value < 0 ? "Prep time cannot be less than 0" : null,
      maxPrepMins: (value) =>
        value < 0 ? "Prep time cannot be less than 0" : null,
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
            placeholder="Item name*"
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
            placeholder="Item description*"
            withAsterisk
            {...itemForm.getInputProps("description")}
          />
          <Text fz="xs">Estimated preparation time (minutes):</Text>
          <Group className={classes.estTimeGroup} grow>
            <NumberInput
              radius="lg"
              variant="filled"
              mb="xs"
              description="Min"
              {...itemForm.getInputProps("minPrepMins")}
            />
            <NumberInput
              radius="lg"
              variant="filled"
              mb="xs"
              description="Max"
              {...itemForm.getInputProps("maxPrepMins")}
            />
          </Group>
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
