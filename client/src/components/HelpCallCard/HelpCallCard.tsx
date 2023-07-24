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
    display: "flex",
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
  const tableName = tableData?.name;

  return (
    <>
      <Paper
        mb="sm"
        shadow="sm"
        radius="md"
        p="md"
        className={isFirst ? classes.latestHelp : classes.otherHelp}
      >
        <div className={classes.cardStyle}>
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
            <Title px="xl" align="center" size={isFirst ? "8rem" : "3rem"}>
              {tableName}
            </Title>
          )}
          <div
            style={{
              display: "flex",
              justifyContent: isFirst ? "flex-end" : "center",
            }}
          >
            <Button
              size={isFirst ? "xl" : "md"}
              style={{
                maxWidth: isFirst ? 175 : 120,
              }}
              onClick={() => {
                updateHelpCallStatus(helpCall.id, "resolved").then(() => {
                  mutate("/help");
                  close();
                });
              }}
              radius="xl"
              fullWidth={true}
              variant="outline"
            >
              Assisted
            </Button>
          </div>
        </div>
      </Paper>
    </>
  );
};
