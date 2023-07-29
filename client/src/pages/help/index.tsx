import useSWR from "swr";
import { Sidebar } from "@/components/Sidebar";
import { useEffect, useState } from "react";
import { getUnresolvedHelpCalls } from "@/api/help";
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
    getUnresolvedHelpCalls,
    { refreshInterval: 1000 }
  );
  const helpManage = helpData ? helpData : [];

  const [loaded, setLoaded] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    setAudio(new Audio("/audio/Notif.ogg"));
  }, []);

  audio?.play();

  // } else
  const latestHelp = helpManage.length === 0 ? null : helpManage[0];
  const otherHelp = helpManage.length === 0 ? [] : helpManage.slice(1);

  return (
    <>
      <Sidebar>
        <Flex gap="lg" align="center">
          <Title style={{ paddingBottom: "1rem" }}>Assistance Requests</Title>
        </Flex>
        {latestHelp ? (
          <>
            <HelpCallCard
              key={latestHelp.tableId}
              tableId={latestHelp.tableId}
              numOccurrence={latestHelp.numOccurrence}
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
                    key={help.tableId}
                    tableId={help.tableId}
                    numOccurrence={help.numOccurrence}
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
