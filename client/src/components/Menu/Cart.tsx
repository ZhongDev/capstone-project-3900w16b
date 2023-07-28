import { useMemo, useState } from "react";
import {
  rem,
  List,
  Paper,
  Text,
  Title,
  createStyles,
  Tabs,
  Flex,
  Badge,
  ActionIcon,
} from "@mantine/core";
import { MenuItem } from "@/api/menu";
import { useDeviceId, useLocalCart } from "@/hooks";
import { formatCurrency } from "@/helpers";
import { GradientButton, IncrementButton } from "../Button";
import { createOrder } from "@/api/order";
import { Table } from "@/api/table";
import Image from "next/image";
import ayaya from "@/public/img/ayaya.jpg";
import { IconTrash } from "@tabler/icons-react";

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
  foodImage: {
    filter: "drop-shadow(0px 0px 3px rgba(0, 0, 0, 0.3))",
    "& > img": {
      borderRadius: theme.radius.md,
    },
  },
  item: { cursor: "pointer" },
}));

export type CartProps = {
  close?: () => void;
  restaurant: { name: string; id: number };
  table: Table;
  menu: MenuItem[];
};

export const Cart = ({ close, restaurant, table, menu }: CartProps) => {
  const { classes } = useStyles();

  const deviceId = useDeviceId();
  const [cart, { setUnitInCart, removeFromCart, clearCart }] = useLocalCart();
  const restCart = useMemo(
    () => (cart[restaurant.id] ? cart[restaurant.id] : []),
    [cart, restaurant.id]
  );

  const total = useMemo(() => {
    return restCart
      .map((inCartItem) => {
        const itemData = menu.find((item) => item.id === inCartItem.itemId);
        if (!itemData) {
          return 0;
        }
        return itemData.priceCents * inCartItem.units;
      })
      .reduce((acc, curr) => acc + curr, 0);
  }, [menu, restCart]);

  return (
    <div className={classes.container}>
      <div>
        <Title align="center" size={rem(50)}>
          Cart
        </Title>
        <Paper withBorder shadow="md" p="xl" mt="xl">
          <div>
            <Title align="center" size="h1" weight={100}>
              Table:{" "}
              <Title fw={500} size="h1">
                {table?.name}
              </Title>
            </Title>
            <div className={classes.orderInfo}>{/* TODO: Order info??? */}</div>
            <div>
              {restCart.map((item) => {
                const inCartItem = menu.find(
                  (menuItem) => menuItem.id === item.itemId
                );
                if (!inCartItem) {
                  return;
                }
                return (
                  <Paper
                    className={classes.item}
                    shadow="md"
                    p="md"
                    mb="md"
                    key={inCartItem.id}
                  >
                    <Flex justify="space-between">
                      <div>
                        <Text fw={700} fz="lg">
                          {inCartItem.name}{" "}
                          <Text span fz="xs">
                            x{item.units} [
                            {formatCurrency(inCartItem.priceCents * item.units)}
                            ]
                          </Text>
                        </Text>
                        <Text c="dimmed" fz="md">
                          {inCartItem.description}
                        </Text>
                      </div>
                      <div className={classes.foodImage}>
                        <Image src={ayaya} alt="food image" width={75} />
                      </div>
                    </Flex>
                    <Flex columnGap="xs">
                      <IncrementButton
                        value={item.units}
                        onChange={(value) => {
                          setUnitInCart(inCartItem.id, restaurant.id, value);
                        }}
                      />
                      <ActionIcon
                        variant="light"
                        radius="lg"
                        size="lg"
                        color="gold5"
                        onClick={() => {
                          removeFromCart(inCartItem.id, restaurant.id);
                        }}
                      >
                        <IconTrash />
                      </ActionIcon>
                    </Flex>
                  </Paper>
                );
              })}
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
          disabled={restCart.length === 0}
          onClick={() => {
            createOrder(
              restaurant.id,
              table.id,
              deviceId,
              cart[restaurant.id]
            ).then(() => {
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
