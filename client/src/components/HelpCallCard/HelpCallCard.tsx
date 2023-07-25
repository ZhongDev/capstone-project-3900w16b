import { HelpCall, updateHelpCallStatus } from "@/api/help";
import { deleteRestaurantTable, getRestaurantTableById } from "@/api/table";
import {
  rem,
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
  Badge,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useEffect } from "react";
import useSWR, { mutate } from "swr";

const useStyles = createStyles((theme) => ({
  latestHelp: {
    height: "25rem",
  },
  otherHelp: {
    maxWidth: "50rem",
  },
  menuItems: {
    marginTop: theme.spacing.xl,
  },
  cardStyle: {
    flexDirection: "column",
    justifyContent: "center",
  },
}));

export const HelpCallCard = ({
  helpCall,
  isFirst,
}: {
  helpCall: HelpCall;
  isFirst: boolean;
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [openedSure, handler] = useDisclosure(false);
  const { classes } = useStyles();
  const { data: tableData, isLoading: tableDataIsLoading } = useSWR(
    `${helpCall.tableId}`,
    getRestaurantTableById
  );
  const tableId = tableData?.id;
  const tableName = tableData?.name;

  return (
    <>
      <Paper
        mb="sm"
        shadow="sm"
        radius="md"
        p="md"
        withBorder={true}
        className={isFirst ? classes.latestHelp : classes.otherHelp}
      >
        <Flex className={classes.cardStyle}>
          {isFirst ? (
            <Text align="center" fz={rem(50)}>
              Latest Request
            </Text>
          ) : (
            <></>
          )}
          {tableDataIsLoading ? (
            <Loader />
          ) : (
            <>
              <Text fz={isFirst ? "2rem" : "1rem"} align="center">
                Table:
              </Text>
              <Title px="xl" align="center" size={isFirst ? "8rem" : "3rem"}>
                {tableName}
              </Title>
            </>
          )}
          <Flex
            style={{
              justifyContent: isFirst ? "flex-end" : "center",
              marginTop: "1rem",
            }}
          >
            <Button
              size={isFirst ? "xl" : "md"}
              style={{
                maxWidth: isFirst ? 175 : 120,
              }}
              onClick={() => {
                updateHelpCallStatus(helpCall.id, tableId, "resolved").then(
                  () => {
                    mutate("/help");
                    close();
                  }
                );
              }}
              radius="xl"
              fullWidth={true}
              variant="outline"
            >
              Assisted
            </Button>
          </Flex>
        </Flex>
      </Paper>
    </>
  );
};
