import { useMemo, useState } from "react";
import useSWR from "swr";
import {
  Badge,
  Button,
  Flex,
  List,
  Paper,
  Text,
  Title,
  createStyles,
  rem,
} from "@mantine/core";
import Image from "next/image";
import {
  GetRestaurantOrdersByDeviceIdResponse,
  getRestaurantOrdersByDeviceId,
} from "@/api/order";
import { formatCurrency } from "@/helpers";
import ayaya from "@/public/img/ayaya.jpg";
import { GradientButton } from "../Button";
import { useDeviceId } from "@/hooks";

const useStyles = createStyles((theme) => ({
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
  foodImage: {
    marginBottom: theme.spacing.xs,
    alignSelf: "right",
  },
}));

export type OrderedProps = {
  close?: () => void;
  restaurant: { name: string; id: number };
};

export const Ordered = ({ close, restaurant }: OrderedProps) => {
  const { classes } = useStyles();

  const deviceId = useDeviceId();
  const { data: orderedData } = useSWR(`/order/${restaurant.id}/${"a"}`, () =>
    getRestaurantOrdersByDeviceId(restaurant.id, deviceId)
  );

  return (
    <div className={classes.container}>
      <div>
        <Title align="center" mb="lg" size={rem(50)}>
          Past Orders
        </Title>
        <List>
          {orderedData?.map((orderGroup) => (
            <OrderedItemCard
              key={orderGroup.orderGroupId}
              orderGroup={orderGroup}
            />
          ))}
        </List>
      </div>
      <div className={classes.floatingButtonGroup}>
        <GradientButton onClick={() => close?.()}>Back</GradientButton>
      </div>
    </div>
  );
};

type OrderedItemCardProps = {
  orderGroup: GetRestaurantOrdersByDeviceIdResponse[0];
};

const OrderedItemCard = ({ orderGroup }: OrderedItemCardProps) => {
  const { classes } = useStyles();

  const [viewDetails, setViewDetails] = useState(false);

  const hasMultipleItems = orderGroup.items.length > 1;
  const groupTotalPrice = useMemo(
    () =>
      orderGroup.items.reduce(
        (acc, curr) => acc + curr.item.priceCents * curr.units,
        0
      ),
    [orderGroup]
  );

  return (
    <div>
      <Paper p="lg" shadow="lg" mb="sm">
        <Flex justify="space-between">
          <Flex direction="column" rowGap="xs">
            <Text fw={700} fz="lg">
              {orderGroup.items[0].item.name}
              {hasMultipleItems
                ? ` + ${orderGroup.items.length - 1} item(s)`
                : null}
            </Text>
            <Text>{new Date(orderGroup.placedOn).toLocaleString()}</Text>
            <Flex columnGap="xs">
              <Button
                onClick={() => setViewDetails(!viewDetails)}
                radius="xl"
                compact
              >
                {viewDetails ? "Hide" : "View"} Details
              </Button>
              <Button radius="xl" compact disabled uppercase>
                {orderGroup.status}
              </Button>
            </Flex>
            {viewDetails && (
              <Flex mt="xs">
                <List>
                  {orderGroup.items.map((item) => {
                    return (
                      <List.Item key={item.id}>
                        {item.item.name} x{item.units} [
                        {formatCurrency(item.units * item.item.priceCents)}]
                      </List.Item>
                    );
                  })}
                </List>
              </Flex>
            )}
          </Flex>
          <Flex direction="column" justify="space-between" align="flex-end">
            <Image
              className={classes.foodImage}
              src={ayaya}
              alt="food image"
              width={75}
            />
            {formatCurrency(groupTotalPrice)}
          </Flex>
        </Flex>
      </Paper>
    </div>
  );
};
