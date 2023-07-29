import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import {
  rem,
  Paper,
  Text,
  Title,
  createStyles,
  Flex,
  ActionIcon,
  Modal,
  Button,
} from "@mantine/core";
import { MenuItem, getMenuItemPrep } from "@/api/menu";
import { useDeviceId, useLocalCart } from "@/hooks";
import { formatCurrency } from "@/helpers";
import { GradientButton, IncrementButton } from "../Button";
import { createOrder, getEstTimeByOrderGroupId } from "@/api/order";
import { Table } from "@/api/table";
import Image from "next/image";
import ayaya from "@/public/img/ayaya.jpg";
import { IconTrash } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import useSWR from "swr";

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
  const router = useRouter();
  const { classes } = useStyles();

  const deviceId = useDeviceId();
  const [cart, { setUnitInCart, removeFromCart, clearCart }] = useLocalCart();
  const [opened, handler] = useDisclosure(false);
  const [estTime, setEstTime] = useState<number>(0);
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
            ).then((res) => {
              handler.open();
              console.log(
                `"RESTAURANT ID: ${restaurant.id} ORDERGROUP ID: ${res[0].orderGroupId}"`
              );
              getEstTimeByOrderGroupId(restaurant.id, res[0].orderGroupId).then(
                (res) => {
                  res ? setEstTime(res) : null;
                }
              );
            });
          }}
        >
          Pay with Apple Pay
        </GradientButton>
        <Modal
          opened={opened}
          onClose={() => {
            clearCart();
            handler.close();
            close?.();
          }}
          withCloseButton={false}
        >
          <Flex direction="column">
            <Text align="center" size="xl">
              Estimated time your food will arrive:
            </Text>
            <Text align="center" size="5rem">
              {estTime}+
            </Text>
            <Text align="center" size="3rem" style={{ paddingBottom: "1rem" }}>
              Mins
            </Text>
            <Button
              onClick={() => {
                clearCart();
                handler.close();
                close?.();
              }}
            >
              Confirm
            </Button>
          </Flex>
        </Modal>
      </div>
    </div>
  );
};
