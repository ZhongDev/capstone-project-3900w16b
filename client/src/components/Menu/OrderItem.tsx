import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Flex,
  Loader,
  Text,
  createStyles,
  Checkbox,
  Radio,
} from "@mantine/core";
import { GradientButton, IncrementButton } from "@/components/Button";
import useSWR from "swr";
import { Alteration, getMenuItem } from "@/api/menu";
import { useLocalCart } from "@/hooks";
import { formatCurrency } from "@/helpers";

const useStyles = createStyles((theme) => ({
  foodImageContainer: {
    width: "100%",
    height: "250px",
    position: "relative",
  },
  itemInformation: {
    padding: theme.spacing.md,
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
  const [alterations, setAlterations] = useState<Map<number, number[]>>(
    new Map()
  );

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
        {itemData.image && (
          <div className={classes.foodImageContainer}>
            <Image
              src={
                process.env.NEXT_PUBLIC_BASEURL + "/public/" + itemData.image
              }
              alt="food image"
              fill
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
          </div>
        )}
        <div className={classes.itemInformation}>
          <div>
            <Text fw={500} fz="lg">
              {itemData.name}
            </Text>
            <Text fz="sm">{formatCurrency(itemData.priceCents)}</Text>
            <Text fz="sm">{itemData.description}</Text>
            {itemData.alterations.map((alteration) => (
              <AlterationSelector
                key={alteration.id}
                alteration={alteration}
                onChange={(optionIds) =>
                  alterations.set(alteration.id, optionIds)
                }
              />
            ))}
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
              alterations: [...alterations.entries()].map(
                ([alterationId, selectedOptions]) => ({
                  alterationId,
                  selectedOptions,
                })
              ),
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

type AlterationSelectorProps = {
  alteration: Alteration;
  onChange?: (choices: number[]) => void;
};

const AlterationSelector = ({
  alteration,
  onChange,
}: AlterationSelectorProps) => {
  const [choices, setChoices] = useState<Set<number>>(new Set());

  return (
    <div key={alteration.id}>
      <Text>
        {alteration.optionName}{" "}
        <Text c="dimmed" span>
          [Pick {alteration.maxChoices}]
        </Text>
      </Text>
      {alteration.options.map((option) => {
        return (
          <Checkbox
            key={option.id}
            label={option.choice}
            checked={choices.has(option.id)}
            disabled={
              choices.size >= alteration.maxChoices && !choices.has(option.id)
            }
            onChange={(e) => {
              if (e.target.checked && choices.size < alteration.maxChoices) {
                choices.add(option.id);
              } else {
                choices.delete(option.id);
              }

              const newChoices = new Set(choices);
              setChoices(newChoices);
              onChange?.([...newChoices]);
            }}
          />
        );
      })}
    </div>
  );
};
