import { markOrderGroupAsPaid } from "@/api/order";
import { GetOrdersResponse } from "@/api/order_status";
import { formatCurrency } from "@/helpers";
import {
  Button,
  Card,
  createStyles,
  Flex,
  List,
  Text,
  Title,
} from "@mantine/core";
import { useMemo } from "react";
import { useSWRConfig } from "swr";

const useStyles = createStyles((theme) => ({
  orderGroup: {
    marginBottom: theme.spacing.md,
  },
  paid: {
    backgroundColor: "grey",
  },
}));

export type TableBillCardProps = {
  orderGroups: GetOrdersResponse;
  paid?: boolean;
};
export const TableBillCard = ({ orderGroups, paid }: TableBillCardProps) => {
  const { mutate } = useSWRConfig();

  const orderGroupSortedTimeDesc = useMemo(
    () =>
      [...orderGroups].sort(
        (a, b) =>
          new Date(b.placedOn).getTime() - new Date(a.placedOn).getTime()
      ),
    [orderGroups]
  );

  const total = useMemo(() => {
    return orderGroupSortedTimeDesc.reduce((acc, curr) => {
      return (
        acc +
        curr.items.reduce(
          (acc, curr) => acc + curr.item.priceCents * curr.units,
          0
        )
      );
    }, 0);
  }, [orderGroupSortedTimeDesc]);

  if (orderGroupSortedTimeDesc.length === 0) {
    return null;
  }

  const tableName = orderGroups[0].tableName;

  return (
    <Card p="xl" shadow="xl" radius="md">
      {paid && <Title>PAID</Title>}
      <Title mb="md">Table {tableName}</Title>
      <Title mb="xs" order={3}>
        Total {formatCurrency(total)}
      </Title>
      {!paid && (
        <Button
          onClick={() => {
            Promise.all(
              orderGroupSortedTimeDesc.map((orderGroup) => {
                return markOrderGroupAsPaid(orderGroup.orderGroupId);
              })
            ).then(() => mutate("/order_status"));
          }}
          mb="lg"
        >
          Mark as paid
        </Button>
      )}
      {orderGroupSortedTimeDesc.map((orderGroup) => {
        return (
          <OrderGroupEntry
            key={orderGroup.orderGroupId}
            items={orderGroup.items.map((item) => ({
              alterations: item.alterations,
              id: item.id,
              name: item.item.name,
              price: item.item.priceCents,
              units: item.units,
            }))}
            placedOn={orderGroup.placedOn}
          />
        );
      })}
    </Card>
  );
};

type Alteration = { alterationName: string; alterationOptions: string[] };

type OrderGroupEntryProps = {
  paid?: boolean;
  placedOn: string;
  items: {
    id: number;
    units: number;
    name: string;
    price: number;
    alterations: Alteration[];
  }[];
};
const OrderGroupEntry = ({ placedOn, paid, items }: OrderGroupEntryProps) => {
  const { classes } = useStyles();

  return (
    <div className={classes.orderGroup}>
      {paid ? (
        <Text fw={700} c="dimmed" fs="italic" strikethrough>
          Ordered on {new Date(placedOn).toLocaleString()}
        </Text>
      ) : (
        <Text fw={700}>Ordered on {new Date(placedOn).toLocaleString()}</Text>
      )}
      {items.map((item) => {
        return (
          <OrderedItemEntry
            paid={paid}
            key={item.id}
            units={item.units}
            name={item.name}
            price={item.price}
            alterations={item.alterations}
          />
        );
      })}
    </div>
  );
};

type OrderedItemEntryProps = {
  paid?: boolean;
  name: string;
  units: number;
  alterations: Alteration[];
  price: number;
};
const OrderedItemEntry = ({
  name,
  units,
  alterations,
  paid,
  price,
}: OrderedItemEntryProps) => {
  return (
    <>
      {paid ? (
        <Text c="dimmed" fs="italic" strikethrough>
          {name} x{units} [{formatCurrency(units * price)}]
        </Text>
      ) : (
        <Text>
          {name} x{units} [{formatCurrency(units * price)}]
        </Text>
      )}
      <List withPadding>
        {alterations.map((alteration, i) => {
          return (
            <List.Item key={i}>
              {paid ? (
                <Text c="dimmed" fs="italic" strikethrough>
                  {alteration.alterationName}
                </Text>
              ) : (
                <Text>{alteration.alterationName}</Text>
              )}
              <List listStyleType="circle">
                {alteration.alterationOptions.map((option) => (
                  <List.Item key={option}>
                    <Text>{option}</Text>
                  </List.Item>
                ))}
              </List>
            </List.Item>
          );
        })}
      </List>
    </>
  );
};
