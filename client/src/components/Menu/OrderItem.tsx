import { useState } from "react";
import Image from "next/image";
import { Flex, Loader, Text, createStyles } from "@mantine/core";
import { GradientButton, IncrementButton } from "@/components/Button";
import ayaya from "@/public/img/ayaya.jpg";
import useSWR from "swr";
import { getMenuItem } from "@/api/menu";
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
}));

export type OrderItemProps = {
  itemId: number;
  restaurantId: number;
  close?: () => void;
};

export const OrderItem = ({ itemId, restaurantId, close }: OrderItemProps) => {
  const { classes } = useStyles();
  const [units, setUnits] = useState(1);

  const { data: itemData } = useSWR(["/menu", itemId], () =>
    getMenuItem(itemId)
  );

  const [, { addToCart }] = useLocalCart();

  if (!itemData) {
    return (
      <Flex justify="center" mt="xl">
        <Loader />
      </Flex>
    );
  }

  return (
    <div className={classes.container}>
      <div className={classes.menuContent}>
        <div className={classes.foodImageContainer}>
          <Image
            src={ayaya}
            alt="food image"
            fill
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        </div>
        <div className={classes.itemInformation}>
          <div>
            <Text fw={500} fz="lg">
              {itemData.name}
            </Text>
            <Text fz="sm">{formatCurrency(itemData.priceCents)}</Text>
            <Text fz="sm">{itemData.description}</Text>
          </div>
        </div>
      </div>
      <div className={classes.floatingButtonGroup}>
        <IncrementButton value={units} onChange={setUnits} />
        <GradientButton
          fullWidth
          onClick={() => {
            addToCart({
              itemId: itemData.id,
              restaurantId: restaurantId,
              units,
            });
            close?.();
          }}
        >
          Add {units} to cart • {formatCurrency(itemData.priceCents * units)}
        </GradientButton>
      </div>
    </div>
  );
};
