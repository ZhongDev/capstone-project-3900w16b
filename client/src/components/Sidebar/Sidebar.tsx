import { AppShell, Navbar, createStyles, Title, Header } from "@mantine/core";
import { GradientButton } from "../GradientButton";
import { useRouter } from "next/router";
import Link from "next/link";

const useStyles = createStyles((theme) => ({
  titleSection: {
    borderBottom: `1px solid ${theme.colors.gold[6]}`,
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
          <Title
            className={classes.titleSection}
            mb="xl"
            p="lg"
            align="center"
            color="gold"
          >
            Plateholder
          </Title>
          <Link href="/menu">
            <GradientButton
              variant={router.pathname === "/menu" ? "filled" : "outline"}
              size="md"
              fullWidth
            >
              Menu Management
            </GradientButton>
          </Link>
          
          <Link href="/table">
            <GradientButton
              variant={router.pathname === "/table" ? "filled" : "outline"}
              size="md"
              fullWidth
            >
              Table Setup
            </GradientButton>
          </Link>
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
