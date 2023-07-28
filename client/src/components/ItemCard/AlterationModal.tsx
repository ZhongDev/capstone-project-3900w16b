import {
  Text,
  Flex,
  Paper,
  Button,
  Modal,
  TextInput,
  NumberInput,
  Group,
  ActionIcon,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconTrashX, IconCheck } from "@tabler/icons-react";
import { useState, useId } from "react";

export type Alteration = {
  optionName: string;
  maxChoices: number;
  options: string[];
};

export type AlterationModalProps = {
  onSave: (alteration: Alteration) => void;
  opened: boolean;
  close: () => void;
  initialOptionName?: string;
  initialMaxChoices?: number;
  initialChoices?: string[];
};

export const AlterationModal = ({
  onSave,
  opened,
  close,
  initialMaxChoices = 1,
  initialOptionName = "",
  initialChoices,
}: AlterationModalProps) => {
  const form = useForm<{ optionName: string; maxChoices: number }>({
    initialValues: {
      optionName: initialOptionName,
      maxChoices: initialMaxChoices,
    },
    validate: {
      optionName: (value) => (value ? null : "Invalid name"),
      maxChoices: (value) => (value >= 1 ? null : "Invalid max choices"),
    },
  });

  const [choices, setChoices] = useState<string[]>(initialChoices ?? []);
  const [newChoice, setNewChoice] = useState<string | null>(null);

  const optionInputId = useId();
  const maxChoiceInputId = useId();

  const clearAndClose = () => {
    setChoices([]);
    setNewChoice(null);
    form.reset();
    close();
  };

  return (
    <>
      <Modal shadow="xl" size="sm" opened={opened} onClose={clearAndClose}>
        <form
          onSubmit={form.onSubmit((values) => {
            onSave({
              optionName: values.optionName,
              maxChoices: values.maxChoices,
              options: choices,
            });
            clearAndClose();
          })}
        >
          <Paper>
            <label htmlFor={optionInputId}>
              <Text>Option name</Text>
            </label>
            <TextInput
              mt="xs"
              {...form.getInputProps("optionName")}
              id={optionInputId}
              placeholder="Option"
            />
          </Paper>
          <Paper mt="md">
            <label htmlFor={maxChoiceInputId}>
              <Text>Max choices</Text>
            </label>
            <NumberInput
              mt="xs"
              {...form.getInputProps("maxChoices")}
              id={maxChoiceInputId}
              defaultValue={1}
            />
          </Paper>
          <Paper mt="md">
            <Text>Choices</Text>
            {choices.length ? (
              <Paper my="xs">
                {choices.map((choice, i) => {
                  return (
                    <Flex key={i}>
                      <ActionIcon
                        onClick={() =>
                          setChoices(choices.filter((_, index) => i !== index))
                        }
                      >
                        <IconTrashX size="1.125rem" color="red" />
                      </ActionIcon>
                      <Text>{choice}</Text>
                    </Flex>
                  );
                })}
              </Paper>
            ) : null}
          </Paper>
          {typeof newChoice === "string" ? (
            <Flex align="center" columnGap="xs">
              <TextInput
                value={newChoice}
                autoFocus
                onChange={(e) => setNewChoice(e.currentTarget.value)}
              />
              <ActionIcon
                onClick={() => {
                  setChoices([...choices, newChoice]);
                  setNewChoice(null);
                }}
              >
                <IconCheck size="1.125rem" color="green" />
              </ActionIcon>
              <ActionIcon onClick={() => setNewChoice(null)}>
                <IconTrashX size="1.125rem" color="red" />
              </ActionIcon>
            </Flex>
          ) : (
            <Button
              variant="outline"
              size="xs"
              radius="xl"
              onClick={() => setNewChoice("")}
            >
              New Choice
            </Button>
          )}
          <Group position="right">
            <Button
              variant="subtle"
              onClick={() => {
                clearAndClose();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={choices.length === 0}>
              Save
            </Button>
          </Group>
        </form>
      </Modal>
    </>
  );
};
