import { useMemo } from "react";
import { List, Paper, Text, Title, createStyles } from "@mantine/core";
import { MenuItem } from "@/api/menu";
import { useLocalCart } from "@/hooks";
import { formatCurrency } from "@/helpers";
import { GradientButton } from "../Button";
import { createOrder } from "@/api/order";

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

export type CartProps = {
  close?: () => void;
  restaurant: { name: string; id: number };
  menu: MenuItem[];
};

export const Cart = ({ close, restaurant, menu }: CartProps) => {
  const { classes } = useStyles();

  const [cart, { clearCart }] = useLocalCart();

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

  return (
    <div className={classes.container}>
      <div>
        <Title align="center">Cart</Title>
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
      <div className={classes.floatingButtonGroup}>
        <GradientButton
          disabled={cart.length === 0}
          onClick={() => {
            // TODO: Convert to real table id
            createOrder(restaurant.id, 1, cart).then(() => {
              clearCart();
              close?.();
            });
          }}
        >
          Pay with Apple Pay
        </GradientButton>
      </div>
    </div>
  );
};
