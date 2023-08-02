import {
  Text,
  Button,
  Modal,
  TextInput,
  NumberInput,
  Textarea,
  Group,
  ButtonProps,
  createStyles,
  Flex,
  ActionIcon,
  FileButton,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { mutate } from "swr";
import { Alteration, AlterationModal } from "./AlterationModal";
import { createItem, uploadItemImage } from "@/api/menu";
import { IconTrashX, IconPencil } from "@tabler/icons-react";

const useStyles = createStyles((theme) => ({
  estTimeGroup: {
    display: "flex",
    alignItems: "center",
    position: "relative",
    justifyContent: "space-between",
    flexWrap: "nowrap",
  },
}));

export const CreateItemModal = ({
  categoryId,
  ...props
}: {
  categoryId: number;
} & ButtonProps) => {
  const { classes } = useStyles();
  const [opened, { open, close: closeDisclosure }] = useDisclosure(false);

  const [
    alterationOpened,
    { open: openAlterationDisclosure, close: closeAlterationDisclosure },
  ] = useDisclosure(false);

  const [alterations, setAlterations] = useState<Alteration[]>([]);
  const [image, setImage] = useState<File | null>(null);

  const close = () => {
    itemForm.reset();
    setImage(null);
    setAlterations([]);
    closeDisclosure();
  };

  const openAlterationModal = () => {
    closeDisclosure();
    openAlterationDisclosure();
  };

  const closeAlterationModal = () => {
    closeAlterationDisclosure();
    open();
  };

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
              alterations: alterations.map((alteration) => {
                return {
                  maxChoices: alteration.maxChoices,
                  optionName: alteration.optionName,
                  options: alteration.options.map((option) => option.choice),
                };
              }),
              priceCents: values.priceCents * 100,
            })
              .then((item) => {
                if (image) {
                  return uploadItemImage(item.id, image);
                }
              })
              .then(() => {
                mutate("/menu");
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
          <Flex align="center" columnGap="xs">
            <FileButton onChange={setImage} accept="image/png,image/jpeg">
              {(props) => (
                <Button mb="xs" {...props} variant="outline">
                  Upload image
                </Button>
              )}
            </FileButton>
            {image && (
              <Text truncate size="xs">
                {image.name}
              </Text>
            )}
          </Flex>
          <div>
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
          </div>
          <div>
            <Text mt="xl" fz="sm">
              Item options:
            </Text>
            {alterations.length ? (
              alterations.map((alteration, i) => {
                return (
                  <OptionsEntry
                    key={i}
                    onDelete={() =>
                      setAlterations(
                        alterations.filter((_, index) => i !== index)
                      )
                    }
                    onSave={(alteration) => {
                      const newAlterations = [...alterations];
                      newAlterations[i] = alteration;
                      setAlterations(newAlterations);
                    }}
                    options={alteration.options}
                    maxChoices={alteration.maxChoices}
                    name={alteration.optionName}
                  />
                );
              })
            ) : (
              <Text c="dimmed" fs="italic" fz="sm">
                No options
              </Text>
            )}
          </div>
          <Button mt="xs" onClick={openAlterationModal} variant="outline">
            Add option
          </Button>
          <Group position="right">
            <Button
              variant="subtle"
              onClick={() => {
                close();
              }}
            >
              Cancel
            </Button>
            <Button type="submit">Create Item</Button>
          </Group>
        </form>
      </Modal>
      <AlterationModal
        opened={alterationOpened}
        close={closeAlterationModal}
        onSave={(newAlteration) =>
          setAlterations([...alterations, newAlteration])
        }
      />
    </>
  );
};

export type OptionsEntryProps = {
  name: string;
  options: { choice: string; id?: number }[];
  maxChoices: number;
  onDelete: () => void;
  onSave?: (newAlteration: Alteration) => void;
};

export const OptionsEntry = ({
  name,
  options,
  maxChoices,
  onSave,
  onDelete,
}: OptionsEntryProps) => {
  const [editModalOpened, { open: openEditModal, close: closeEditModal }] =
    useDisclosure(false);

  return (
    <>
      <AlterationModal
        close={closeEditModal}
        opened={editModalOpened}
        onSave={onSave}
        initialMaxChoices={maxChoices}
        initialOptionName={name}
        initialChoices={options}
      />
      <Flex>
        <ActionIcon onClick={onDelete}>
          <IconTrashX size="1.125rem" color="red" />
        </ActionIcon>
        <ActionIcon onClick={openEditModal}>
          <IconPencil size="1.125rem" color="blue" />
        </ActionIcon>
        <Text>
          {name}{" "}
          <Text c="dimmed" span>
            [{options.length} option(s)]
          </Text>
        </Text>
      </Flex>
    </>
  );
};
