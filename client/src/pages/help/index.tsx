import useSWR from "swr";
import { Sidebar } from "@/components/Sidebar";
import { useState, useEffect } from "react";
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

// const audio = new Audio(
//   "https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3"
// );

// let firstRun = true;

export default function Help() {
  const { classes } = useStyles();
  const { data: helpData, isLoading: helpDataIsLoading } = useSWR(
    "/help",
    getUnresolvedHelpCalls
  );
  // const [audio, setAudio] = useState(null);
  // useEffect(() => {
  //   setAudio(
  //     new Audio(
  //       "https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3"
  //     )
  //   );
  //   // only run once on the first render on the client
  // }, []);

  // Organises requests
  let helpManage: manageTableHelpCall[] = [];
  helpData?.map((val, index, self) => {
    if (self.findIndex((v) => v.tableId === val.tableId) === index) {
      helpManage?.push({
        tableId: val.tableId,
        numOccurrence: 1,
        helpCall: val,
      });
    } else {
      helpManage[
        helpManage.findIndex((v) => v.tableId === val.tableId)
      ].numOccurrence += 1;
    }
    // if (!firstRun) {
    //   audio.play();
    // }
  });
  // useEffect(() => {
  //   audio.play();
  // }, [helpManage]);
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
                    key={help.helpCall.id}
                    helpCall={help.helpCall}
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
