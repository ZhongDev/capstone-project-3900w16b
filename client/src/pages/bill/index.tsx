import { Title, Loader, createStyles, Flex, Text } from "@mantine/core";
import useSWR from "swr";
import { Sidebar } from "@/components/Sidebar";
import { getOrders, GetOrdersResponse } from "@/api/order_status";
import { OrderCompletedCard } from "@/components/OrderCompletedCard";
import { useMemo } from "react";
import { TableBillCard } from "@/components/TableBillCard";

const useStyles = createStyles((theme) => ({
  menuSection: {
    marginTop: theme.spacing.xl,
  },
  billSection: {
    display: "flex",
    justifyContent: "center",
    align: "center",
    marginTop: theme.spacing.xl,
  },
  paidBillSection: {
    display: "flex",
    justifyContent: "center",
    align: "center",
    marginTop: "5rem",
    paddingTop: "5rem",
    borderTop: `1px solid ${theme.colors.gold[5]}`,
  },
}));

export default function Bill() {
  const { classes } = useStyles();
  const {
    data: ordersData,
    error: ordersDataError,
    isLoading: ordersDataIsLoading,
  } = useSWR("/order_status", getOrders);

  const unpaidOrderGroupByTableId = useMemo<
    Map<number, GetOrdersResponse> | undefined
  >(() => {
    return ordersData
      ?.filter((orders) => {
        return (
          orders.status === "completed" &&
          orders.items.length > 0 &&
          orders.tableId !== null &&
          orders.paid === false
        );
      })
      .reduce((acc, curr) => {
        const tableOrders = acc.get(curr.tableId);
        if (tableOrders) {
          tableOrders.push(curr);
        } else {
          acc.set(curr.tableId, [curr]);
        }
        return acc;
      }, new Map<number, GetOrdersResponse>());
  }, [ordersData]);

  const paidOrderGroupByTableId = useMemo<
    Map<number, GetOrdersResponse> | undefined
  >(() => {
    return ordersData
      ?.filter((orders) => {
        return (
          orders.status === "completed" &&
          orders.items.length > 0 &&
          orders.tableId !== null &&
          orders.paid
        );
      })
      .reduce((acc, curr) => {
        const tableOrders = acc.get(curr.tableId);
        if (tableOrders) {
          tableOrders.push(curr);
        } else {
          acc.set(curr.tableId, [curr]);
        }
        return acc;
      }, new Map<number, GetOrdersResponse>());
  }, [ordersData]);

  return (
    <Sidebar>
      <Flex gap="lg" align="center">
        <Title>Table bill</Title>
      </Flex>
      <Flex wrap="wrap" align="start" className={classes.billSection} gap="xs">
        {ordersDataIsLoading && <Loader />}
        {!ordersDataIsLoading &&
          unpaidOrderGroupByTableId &&
          [...unpaidOrderGroupByTableId.entries()].map(
            ([tableId, orderGroups]) => {
              return <TableBillCard key={tableId} orderGroups={orderGroups} />;
            }
          )}
      </Flex>
      <Flex
        wrap="wrap"
        align="start"
        className={classes.paidBillSection}
        gap="xs"
      >
        {!ordersDataIsLoading &&
          paidOrderGroupByTableId &&
          [...paidOrderGroupByTableId.entries()].map(
            ([tableId, orderGroups]) => {
              return (
                <TableBillCard paid key={tableId} orderGroups={orderGroups} />
              );
            }
          )}
      </Flex>
    </Sidebar>
  );
}
