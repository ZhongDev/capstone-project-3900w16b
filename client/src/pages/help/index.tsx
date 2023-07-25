import useSWR from "swr";
import { Sidebar } from "@/components/Sidebar";
import {
  HelpCall,
  getUnresolvedHelpCalls,
  manageTableHelpCall,
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

  // Organises requests
  let helpManage: manageTableHelpCall[] = [];
  helpData?.map((val, index, self) => {
    if (self.findIndex((v) => v.tableId === val.tableId) === index) {
      helpManage?.push({
        tableId: val.tableId,
        numOccurance: 1,
        helpCall: val,
      });
    } else {
      helpManage[
        helpManage.findIndex((v) => v.tableId === val.tableId)
      ].numOccurance += 1;
    }
  });
  const latestHelp: manageTableHelpCall | null =
    helpManage.length === 0 ? null : helpManage[0];
  const otherHelp: manageTableHelpCall[] =
    helpManage.length === 0 ? [] : helpManage.slice(1);

  return (
    <>
      <Sidebar>
        <Flex gap="lg" align="center">
          <Title style={{ paddingBottom: "1rem" }}>Assistance Requests</Title>
        </Flex>
        {latestHelp ? (
          <>
            <HelpCallCard
              key={latestHelp.helpCall.id}
              helpCall={latestHelp.helpCall}
              numOccurance={latestHelp.numOccurance}
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
                  <HelpCallCard
                    key={help.helpCall.id}
                    helpCall={help.helpCall}
                    numOccurance={help.numOccurance}
                    isFirst={false}
                  />
                );
              })
            )}
          </Flex>
        </ScrollArea>
      </Sidebar>
    </>
  );
}
