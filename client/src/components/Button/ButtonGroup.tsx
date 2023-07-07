import { Flex, Button, Text, createStyles } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  middle: {
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    backgroundColor: theme.colors.gold[0],
  },
  parent: {
    backgroundColor: theme.colors.gold[0],
    borderRadius: `${theme.radius.xl}`,
  },
  pseudoButton: {
    borderRadius: "0px",
  },
  button: {
    "&:first-child": {
      borderRadius: `${theme.radius.xl} 0px 0px ${theme.radius.xl}`,
    },
    "&:last-child": {
      borderRadius: `0px ${theme.radius.xl} ${theme.radius.xl} 0px`,
    },
  },
}));

export const ButtonGroup = () => {
  const { classes } = useStyles();
  return (
    <Flex className={classes.parent} align="center" justify="center">
      <Button className={classes.button} variant="light">
        −
      </Button>
      <Button
        className={classes.pseudoButton}
        styles={(theme) => ({
          root: {
            ":active": { transform: "none" },
            ":hover": {
              backgroundColor: theme.colors.gold[0],
              cursor: "default",
            },
          },
        })}
        variant="light"
      >
        2
      </Button>
      <Button className={classes.button} variant="light">
        +
      </Button>
    </Flex>
  );
};
