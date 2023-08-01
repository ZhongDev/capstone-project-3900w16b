import { updateHelpCallStatusTable } from "@/api/help";
import { getRestaurantTableById } from "@/api/table";
import {
  rem,
  Text,
  Flex,
  Paper,
  Button,
  Title,
  createStyles,
  Loader,
  Badge,
} from "@mantine/core";
import useSWR, { mutate } from "swr";

const useStyles = createStyles((theme) => ({
  latestHelp: {
    maxHeight: "28rem",
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
  tableId,
  numOccurrence,
  isFirst,
}: {
  tableId: number;
  numOccurrence: number;
  isFirst: boolean;
}) => {
  const { classes } = useStyles();
  const { data: tableData, isLoading: tableDataIsLoading } = useSWR(
    `${tableId}`,
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
        withBorder={true}
        className={isFirst ? classes.latestHelp : classes.otherHelp}
      >
        <Flex className={classes.cardStyle}>
          {numOccurrence > 1 ? (
            <Badge
              size={isFirst ? "xl" : "xs"}
              color="red"
              variant="dot"
              style={{
                maxWidth: isFirst ? "15rem" : "10rem",
                alignSelf: isFirst ? "" : "center",
              }}
            >
              Requested {numOccurrence} times
            </Badge>
          ) : (
            <></>
          )}
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
                updateHelpCallStatusTable(tableId, "resolved").then(() => {
                  mutate("/help");
                });
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