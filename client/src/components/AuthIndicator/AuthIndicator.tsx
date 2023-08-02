import { Loader, Flex, Text, createStyles } from "@mantine/core";

export const AuthIndicator = () => {
  return (
    <Flex mt="xl" align="center" justify="center" direction="column">
      <Loader />
      <Text>Loading you in...</Text>
    </Flex>
  );
};
