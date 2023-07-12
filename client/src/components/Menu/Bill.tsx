import { useMemo, useState } from "react";
import Image from "next/image";
import {
  Flex,
  List,
  Loader,
  Paper,
  Text,
  Title,
  createStyles,
} from "@mantine/core";
import ayaya from "@/public/img/ayaya.jpg";
import useSWR from "swr";
import { MenuItem, getMenuItem } from "@/api/menu";
import { useLocalCart } from "@/hooks";
import { formatCurrency } from "@/helpers";

const useStyles = createStyles((theme) => ({
  foodImageContainer: {
    width: "100%",
    height: "250px",
    position: "relative",
  },
  itemInformation: {
    padding: theme.spacing.xl,
  },
  floatingButtonGroup: {
    bottom: "0px",
    backgroundColor: "white",
    padding: theme.spacing.xs,
    borderTop: `1px solid ${theme.colors.gold[1]}`,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: `${theme.spacing.sm} 0px`,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
  },
  menuContent: {
    overflowY: "auto",
  },
  orderInfo: {
    padding: theme.spacing.xl,
  },
}));

export type BillProps = {
  close?: () => void;
  restaurantName: string;
  menu: MenuItem[];
};

export const Bill = ({ close, restaurantName, menu }: BillProps) => {
  const { classes } = useStyles();
  const [units, setUnits] = useState(1);

  const [cart] = useLocalCart();

  const total = useMemo(() => {
    return cart
      .map((inCartItem) => {
        const itemData = menu.find((item) => item.id === inCartItem.itemId);
        if (!itemData) {
          return 0;
        }
        return itemData.priceCents * inCartItem.units;
      })
      .reduce((acc, curr) => acc + curr, 0);
  }, [cart, menu]);

  console.log({ total });

  return (
    <div>
      <Title color="gold" align="center">
        {restaurantName}
      </Title>
      <Title align="center">Bill</Title>
      <Paper withBorder shadow="md" p="xl" mt="xl">
        <div>
          <Text align="center" fz="lg">
            Table{" "}
            <Text fw={500} span>
              C24
            </Text>
          </Text>
          <div className={classes.orderInfo}>
            <Text>
              Order#{" "}
              <Text span fw={500}>
                15a59db
              </Text>
            </Text>
            <Text>
              Customer{" "}
              <Text span fw={500}>
                Michael Min
              </Text>
            </Text>
            <Text>
              Ordered{" "}
              <Text span fw={500}>
                2m ago
              </Text>
            </Text>
          </div>
          <div>
            <List>
              {cart.map((item) => {
                const inCartItem = menu.find(
                  (menuItem) => menuItem.id === item.itemId
                );
                if (!inCartItem) {
                  return;
                }
                return (
                  <List.Item key={item.itemId}>
                    {inCartItem.name}{" "}
                    <Text span fz="xs">
                      x{item.units} [
                      {formatCurrency(inCartItem.priceCents * item.units)}]
                    </Text>
                  </List.Item>
                );
              })}
            </List>
          </div>
          <div>
            <Text fz="xl" fw={700} align="center" mt="xl">
              Total {formatCurrency(total)}
            </Text>
          </div>
        </div>
      </Paper>
    </div>
  );
};
