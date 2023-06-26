import { getMenuByRestaurantId } from "@/api/menu";
import { Title, Tabs, createStyles, Text, Paper } from "@mantine/core";
import { useRouter } from "next/router";
import { useState } from "react";
import useSWR from "swr";

const useStyles = createStyles((theme) => ({
  menuContainer: {
    maxWidth: "50rem",
    margin: `${theme.spacing.xl} auto`,
  },
  menuBody: {
    padding: theme.spacing.xl,
  },
}));

export default function RestaurantMenu() {
  const router = useRouter();
  const restaurantId = Number(router.query.id);
  const { classes } = useStyles();

  const {
    data: menuData,
    error: menuError,
    isLoading: menuIsLoading,
  } = useSWR(router.isReady ? "/menu" : null, () =>
    getMenuByRestaurantId(restaurantId)
  );

  if (!router.isReady) {
    return null;
  }

  if (isNaN(restaurantId)) {
    return <Title>Do you think you&apos;re funny?</Title>;
  }

  return (
    <div className={classes.menuContainer}>
      <Title mb="sm" color="gold" align="center">
        {menuData?.restaurant.name}
      </Title>
      <Tabs p="lg" defaultValue="0">
        <Tabs.List>
          {menuData?.menu?.map((category, i) => {
            return (
              <Tabs.Tab key={category.id} value={i.toString()}>
                <Text fz="xl" fw={700}>
                  {category.name}
                </Text>
              </Tabs.Tab>
            );
          })}
        </Tabs.List>

        {menuData?.menu?.map((category, i) => {
          return (
            <Tabs.Panel key={category.id} value={i.toString()} pt="xs">
              <div className={classes.menuBody}>
                {category.items.map((item) => {
                  return (
                    <Paper shadow="md" withBorder p="md" mb="md" key={item.id}>
                      <Text fw={700} fz="lg" align="center">
                        {item.name}
                      </Text>
                    </Paper>
                  );
                })}
              </div>
            </Tabs.Panel>
          );
        })}
      </Tabs>
    </div>
  );
}
