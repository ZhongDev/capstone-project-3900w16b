import useSWR from "swr";
import { Sidebar } from "@/components/Sidebar";
import { getUnresolvedHelpCalls, updateHelpCallStatus } from "@/api/help";
import { HelpCallCard } from "@/components/HelpCallCard";
import { Flex, Loader, Title, createStyles } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  helpSection: {
    marginTop: theme.spacing.xl,
  },
}));

export default function Help() {
  const { data: helpData, isLoading: helpDataIsLoading } = useSWR(
    "/help",
    getUnresolvedHelpCalls
  );
  const { classes } = useStyles();

  return (
    <>
      <Sidebar>
        <Flex gap="lg" align="center">
          <Title>Assistance Requests</Title>
        </Flex>
        <div className={classes.helpSection}>
          {helpDataIsLoading ? (
            <Loader />
          ) : (
            helpData?.map((help) => {
              return <HelpCallCard key={help.id} helpCall={help} />;
            })
          )}
        </div>
      </Sidebar>
    </>
  );
}
