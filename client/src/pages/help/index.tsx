import useSWR from "swr";
import { Sidebar } from "@/components/Sidebar";
import {
  HelpCall,
  getUnresolvedHelpCalls,
  updateHelpCallStatus,
} from "@/api/help";
import { HelpCallCard } from "@/components/HelpCallCard";
import {
  Flex,
  Loader,
  Title,
  createStyles,
  ScrollArea,
  Text,
} from "@mantine/core";

const useStyles = createStyles((theme) => ({
  helpSection: {
    display: "flex",
    justifyContent: "center",
    align: "center",
    marginTop: theme.spacing.xl,
  },
}));

export default function Help() {
  const { classes } = useStyles();
  const { data: helpData, isLoading: helpDataIsLoading } = useSWR(
    "/help",
    getUnresolvedHelpCalls
  );
  // Filter by unique tableid
  const uniqueHelp = helpData?.filter((val, index, self) => {
    return self.findIndex((v) => v.tableId === val.tableId) === index;
  });
  const latestHelp: HelpCall | null = uniqueHelp ? uniqueHelp[0] : null;
  const otherHelp: HelpCall[] = uniqueHelp ? uniqueHelp.slice(1) : [];

  return (
    <>
      <Sidebar>
        <Flex gap="lg" align="center">
          <Title style={{ paddingBottom: "1rem" }}>Assistance Requests</Title>
        </Flex>
        {latestHelp ? (
          <>
            <HelpCallCard
              key={latestHelp.id}
              helpCall={latestHelp}
              isFirst={true}
            />
          </>
        ) : (
          <Text size="xl" style={{ paddingTop: "3rem" }}>
            You have no unresolved requests :)
          </Text>
        )}
        {otherHelp.length === 0 ? (
          <></>
        ) : (
          <Text size="xl" style={{ paddingTop: "3rem" }}>
            Previous Unresolved Requests
          </Text>
        )}
        <ScrollArea>
          <Flex className={classes.helpSection} gap="xs">
            {helpDataIsLoading ? (
              <Loader />
            ) : (
              otherHelp?.map((help) => {
                return (
                  <HelpCallCard key={help.id} helpCall={help} isFirst={false} />
                );
              })
            )}
          </Flex>
        </ScrollArea>
      </Sidebar>
    </>
  );
}
