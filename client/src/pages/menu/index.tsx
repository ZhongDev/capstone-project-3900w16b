import { useEffect, useState } from "react";
import useSWR from "swr";
import { Title, createStyles, Flex, Button } from "@mantine/core";
import { Sidebar } from "@/components/Sidebar";
import Head from "next/head";
import {
  Categories,
  CreateCategory,
  ReorderCategories,
} from "@/components/CategoryCard";
import { getMenu } from "@/api/menu";
import { RequireAuth } from "@/components/RequireAuth";

const useStyles = createStyles((theme) => ({
  menuSection: {
    marginTop: theme.spacing.xl,
  },
}));

export default function MenuManagement() {
  const { classes } = useStyles();
  const [reordering, setReordering] = useState(false);
  const { data: menuData } = useSWR("/menu", getMenu);

  return (
    <RequireAuth>
      <Head>
        <title> Edit Menu </title>
      </Head>
      <Sidebar>
        <Flex gap="lg" align="center">
          <Title>Categories</Title>
          <CreateCategory disabled={reordering} />
          {!reordering && (
            <Button
              radius="xl"
              variant="outline"
              onClick={() => setReordering(!reordering)}
            >
              Reorder
            </Button>
          )}
        </Flex>
        <div className={classes.menuSection}>
          {menuData ? (
            reordering ? (
              <ReorderCategories
                close={() => setReordering(false)}
                menu={menuData.menu}
              />
            ) : (
              <Categories menu={menuData.menu} />
            )
          ) : null}
        </div>
      </Sidebar>
    </RequireAuth>
  );
}
