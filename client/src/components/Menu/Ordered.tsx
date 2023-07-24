import useSWR from "swr";
import {
  Badge,
  Flex,
  List,
  Paper,
  Text,
  Title,
  createStyles,
  rem,
} from "@mantine/core";
import {
  GetRestaurantOrdersByDeviceIdResponse,
  getRestaurantOrdersByDeviceId,
} from "@/api/order";
import { formatCurrency } from "@/helpers";
import ayaya from "@/public/img/ayaya.jpg";
import Image from "next/image";
import { GradientButton } from "../Button";

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

  const { data: orderedData } = useSWR(`/order/${restaurant.id}/${"a"}`, () =>
    getRestaurantOrdersByDeviceId(restaurant.id, "a")
  );

  return (
    <div className={classes.container}>
      <div>
        <Title align="center" mb="lg" size={rem(50)}>
          Past Orders
        </Title>
        <List>
          {orderedData?.map((orderedItem) => (
            <OrderedItemCard key={orderedItem.id} item={orderedItem} />
          ))}
        </List>
      </div>
      <div className={classes.floatingButtonGroup}>
        <GradientButton onClick={() => close?.()}>Back</GradientButton>
      </div>
    </div>
  );
};

type OrderedItemCardProps = { item: GetRestaurantOrdersByDeviceIdResponse[0] };

const OrderedItemCard = ({ item }: OrderedItemCardProps) => {
  const { classes } = useStyles();

  return (
    <div>
      <Paper p="lg" shadow="lg" mb="sm">
        <Flex justify="space-between">
          <Flex direction="column" justify="space-between">
            <Text fw={700} fz="lg">
              {item.item.name}
            </Text>
            <Text>{new Date(item.placedOn).toLocaleString()}</Text>
            <Flex columnGap="xs">
              <Badge size="xl">{item.units}x</Badge>
              <Badge size="xl">{item.status}</Badge>
            </Flex>
          </Flex>
          <Flex direction="column" justify="space-between" align="flex-end">
            <Image
              className={classes.foodImage}
              src={ayaya}
              alt="food image"
              width={75}
            />
            {formatCurrency(item.units * item.item.priceCents)}
          </Flex>
        </Flex>
      </Paper>
    </div>
  );
};
