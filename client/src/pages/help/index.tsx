import useSWR from "swr";
import { Sidebar } from "@/components/Sidebar";
import {
  HelpCall,
  getUnresolvedHelpCalls,
  updateHelpCallStatus,
} from "@/api/help";
import { HelpCallCard } from "@/components/HelpCallCard";
import { Flex, Loader, Title, createStyles, ScrollArea } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  helpSection: {
    display: "flex",
    justifyContent: "center",
    align: "center",
    marginTop: theme.spacing.xl,
  },
}));

export default function Help() {
  const { data: helpData, isLoading: helpDataIsLoading } = useSWR(
    "/help",
    getUnresolvedHelpCalls
  );
  const latestHelp: HelpCall | null = helpData ? helpData[0] : null;
  const otherHelp: HelpCall[] = helpData ? helpData.slice(1) : [];
  console.log(`Latest is from table ${latestHelp}`);
  const { classes } = useStyles();

  return (
    <>
      <Sidebar>
        <Flex gap="lg" align="center">
          <Title>Assistance Requests</Title>
        </Flex>
        {latestHelp ? (
          <HelpCallCard
            key={latestHelp.id}
            helpCall={latestHelp}
            isFirst={true}
          />
        ) : (
          <></>
        )}
        <ScrollArea>
          <div className={classes.helpSection}>
            {helpDataIsLoading ? (
              <Loader />
            ) : (
              otherHelp?.map((help) => {
                return (
                  <HelpCallCard key={help.id} helpCall={help} isFirst={false} />
                );
              })
            )}
          </div>
        </ScrollArea>
      </Sidebar>
    </>
  );
}
