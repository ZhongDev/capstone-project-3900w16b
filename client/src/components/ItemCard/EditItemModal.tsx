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
  createStyles,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState, useId } from "react";
import { useSWRConfig } from "swr";
import { Alteration, AlterationModal } from "./AlterationModal";
import {
  MenuItem,
  updateMenuItem,
  deleteAlteration,
  createAlteration,
} from "@/api/menu";
import { OptionsEntry } from "./CreateItemModal";

const useStyles = createStyles((theme) => ({
  estTimeGroup: {
    display: "flex",
    alignItems: "center",
    position: "relative",
    justifyContent: "space-between",
    flexWrap: "nowrap",
  },
}));
type EditItemModalProps = {
  item: MenuItem;
  opened: boolean;
  open: () => void;
  close: () => void;
};

export const EditItemModal = ({
  item,
  opened,
  open,
  close: parentClose,
}: EditItemModalProps) => {
  const { classes } = useStyles();

  const [alterations, setAlterations] = useState(item.alterations);
  const [newAlterations, setNewAlterations] = useState<Alteration[]>([]);
  const [deletedAlterationIds, setDeletedAlterationIds] = useState<number[]>(
    []
  );

  const [
    alterationOpened,
    { open: openAlterationDisclosure, close: closeAlterationDisclosure },
  ] = useDisclosure(false);

  const openAlterationModal = () => {
    parentClose();
    openAlterationDisclosure();
  };

  const closeAlterationModal = () => {
    open();
    closeAlterationDisclosure();
  };

  const formId = useId();

  const { mutate } = useSWRConfig();

  useEffect(() => {
    setAlterations(item.alterations);
  }, [item.alterations]);

  const close = () => {
    setAlterations(item.alterations);
    setDeletedAlterationIds([]);
    setNewAlterations([]);
    parentClose();
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

  const populateForm = () => {
    itemForm.setValues({
      name: item.name,
      description: item.description,
      ingredients: null,
      priceCents: item.priceCents / 100,
      minPrepMins: item.minPrepMins ?? 0,
      maxPrepMins: item.maxPrepMins ?? 0,
    });
  };

  return (
    <>
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
      <Modal opened={opened} onClose={close} title="Update item information">
        <form
          onSubmit={itemForm.onSubmit((values) => {
            updateMenuItem(item.id, {
              ...values,
              priceCents: values.priceCents * 100,
            }).then(() => {
              // Ideally we should have a bulk endpoint, but for assignment this is fine.
              Promise.all([
                ...newAlterations.map((newAlteration) =>
                  createAlteration({ ...newAlteration, itemId: item.id })
                ),
                ...deletedAlterationIds.map((alterationId) =>
                  deleteAlteration(alterationId)
                ),
              ]).finally(() => {
                mutate("/menu");
                itemForm.reset();
                close();
              });
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
                ? `$${value}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
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
          <Paper>
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
          </Paper>
          <Paper>
            <Text fz="xs">Item options:</Text>
            {alterations.length > 0 || newAlterations.length > 0 ? (
              <>
                {alterations.map((alteration) => {
                  return (
                    <OptionsEntry
                      key={alteration.id}
                      onDelete={() => {
                        setAlterations(
                          alterations.filter((alt) => alt.id !== alteration.id)
                        );
                        setDeletedAlterationIds([
                          ...deletedAlterationIds,
                          alteration.id,
                        ]);
                      }}
                      name={alteration.optionName}
                      options={alteration.options.map((a) => a.choice)}
                      onSave={(newAlteration) => {
                        console.log(newAlteration);
                      }}
                      maxChoices={alteration.maxChoices}
                    />
                  );
                })}
                {newAlterations.map((newAlteration, i) => {
                  return (
                    <OptionsEntry
                      key={i}
                      onDelete={() => {
                        setNewAlterations(
                          newAlterations.filter((_, index) => i !== index)
                        );
                      }}
                      name={newAlteration.optionName}
                      options={newAlteration.options}
                      onSave={(updatedAlteration) => {
                        const updatedAlterations = [...newAlterations];
                        updatedAlterations[0] = updatedAlteration;
                        setNewAlterations(updatedAlterations);
                      }}
                      maxChoices={newAlteration.maxChoices}
                    />
                  );
                })}
              </>
            ) : (
              <Text c="dimmed" fs="italic" fz="sm">
                No options
              </Text>
            )}
            <Button mt="sm" onClick={openAlterationModal} variant="outline">
              Add options
            </Button>
          </Paper>
          <Group position="right">
            <Button variant="subtle" onClick={close}>
              Cancel
            </Button>
            <Button type="submit">Confirm</Button>
          </Group>
        </form>
      </Modal>
      <AlterationModal
        opened={alterationOpened}
        close={closeAlterationModal}
        onSave={(newAlteration) => {
          setNewAlterations([...newAlterations, newAlteration]);
        }}
      />
    </>
  );
};
