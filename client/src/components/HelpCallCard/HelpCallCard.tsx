import { HelpCall, updateHelpCallStatus } from "@/api/help";
import { deleteRestaurantTable, getRestaurantTableById } from "@/api/table";
import {
  Text,
  Flex,
  Paper,
  Button,
  Modal,
  Textarea,
  Group,
  ButtonProps,
  Title,
  createStyles,
  Loader,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useEffect } from "react";
import useSWR, { mutate } from "swr";

const useStyles = createStyles((theme) => ({
  menuCategory: {
    maxWidth: "50rem",
  },
  menuItems: {
    marginTop: theme.spacing.xl,
  },
}));

export const HelpCallCard = ({ helpCall }: { helpCall: HelpCall }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [openedSure, handler] = useDisclosure(false);
  const { classes } = useStyles();
  const { data: tableData, isLoading: tableDataIsLoading } = useSWR(
    `${helpCall.tableId}`,
    getRestaurantTableById
  );
  const tableName = tableData?.name;

  return (
    <>
      <Paper
        mb="sm"
        shadow="sm"
        radius="md"
        p="md"
        className={classes.menuCategory}
      >
        <Flex align="center" justify="space-between">
          {tableDataIsLoading ? (
            <Loader />
          ) : (
            <Title px="xl" align="center" weight="1000">
              {tableName} NEEDS HELP!!!11!!!
            </Title>
          )}
          <Group spacing="xs">
            <Button onClick={open} radius="xl" variant="outline" mr="xs">
              Assisted
            </Button>
            <Modal
              opened={opened}
              onClose={close}
              title="Do some assistance shit"
            ></Modal>
          </Group>
        </Flex>
      </Paper>
    </>
  );
};
