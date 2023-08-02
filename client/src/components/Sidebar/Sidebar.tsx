import { AppShell, Navbar, createStyles, Title } from "@mantine/core";
import { GradientButton } from "../Button";
import { useRouter } from "next/router";
import Link from "next/link";

const useStyles = createStyles((theme) => ({
  titleSection: {
    borderBottom: `1px solid ${theme.colors.gold[6]}`,
  },

  section: {
    marginLeft: `calc(${theme.spacing.md} * -1)`,
    marginRight: `calc(${theme.spacing.md} * -1)`,
    marginBottom: theme.spacing.md,
  },
}));

export const Sidebar = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { classes } = useStyles();

  return (
    <AppShell
      padding="md"
      navbar={
        <Navbar width={{ base: 300 }} p="xl">
          <Link href="/">
            <Title
              className={classes.titleSection}
              mb="xl"
              p="lg"
              align="center"
              color="gold"
            >
              Plateholder
            </Title>
          </Link>
          <Navbar.Section className={classes.section} px="xl">
            <Link href="/help">
              <GradientButton
                variant={router.pathname === "/help" ? "filled" : "outline"}
                size="md"
                fullWidth
              >
                Assistance List
              </GradientButton>
            </Link>
          </Navbar.Section>
          <Navbar.Section className={classes.section} px="xl">
            <Link href="/menu">
              <GradientButton
                variant={router.pathname === "/menu" ? "filled" : "outline"}
                size="md"
                fullWidth
              >
                Menu Management
              </GradientButton>
            </Link>
          </Navbar.Section>
          <Navbar.Section className={classes.section} px="xl">
            <Link href="/table">
              <GradientButton
                variant={router.pathname === "/table" ? "filled" : "outline"}
                size="md"
                fullWidth
              >
                Table Setup
              </GradientButton>
            </Link>
          </Navbar.Section>
          <Navbar.Section className={classes.section} px="xl">
            <Link href="/order_status">
              <GradientButton
                variant={
                  router.pathname === "/order_status" ? "filled" : "outline"
                }
                size="md"
                fullWidth
              >
                Order Status
              </GradientButton>
            </Link>
          </Navbar.Section>
          <Navbar.Section className={classes.section} px="xl">
            <Link href="/order_completed">
              <GradientButton
                variant={
                  router.pathname === "/order_completed" ? "filled" : "outline"
                }
                size="md"
                fullWidth
              >
                Orders Completed
              </GradientButton>
            </Link>
          </Navbar.Section>
          <Navbar.Section className={classes.section} px="xl">
            <Link href="/summary">
              <GradientButton
                variant={router.pathname === "/summary" ? "filled" : "outline"}
                size="md"
                fullWidth
              >
                Restaurant Statistics
              </GradientButton>
            </Link>
          </Navbar.Section>
        </Navbar>
      }
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      })}
    >
      {children}
    </AppShell>
  );
};
