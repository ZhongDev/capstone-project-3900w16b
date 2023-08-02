import { Title, Loader, createStyles, Flex, Text } from "@mantine/core";
import useSWR from "swr";
import { Sidebar } from "@/components/Sidebar";
import { getOrders, GetOrdersResponse } from "@/api/order_status";
import { OrderCompletedCard } from "@/components/OrderCompletedCard";
import { useMemo } from "react";

const useStyles = createStyles((theme) => ({
  menuSection: {
    marginTop: theme.spacing.xl,
  },
  helpSection: {
    display: "flex",
    justifyContent: "center",
    align: "center",
    marginTop: theme.spacing.xl,
  },
}));

export default function OrderManagement() {
  const { classes } = useStyles();
  const {
    data: ordersData,
    error: ordersDataError,
    isLoading: ordersDataIsLoading,
  } = useSWR("/order_status", getOrders);

  const ordersCompleted = useMemo(() => {
    return ordersData?.filter((orders) => {
      return (
        orders.status === "completed" &&
        orders.items.length > 0 &&
        orders.tableId !== null
      );
    });
  }, [ordersData]);

  return (
    <Sidebar>
      <Flex gap="lg" align="center">
        <Title>Orders Completed</Title>
      </Flex>
      <Flex wrap="wrap" className={classes.helpSection} gap="xs">
        {ordersDataIsLoading && <Loader />}
        {!ordersDataIsLoading && ordersCompleted?.length ? (
          ordersCompleted.map((orders) => {
            return (
              <OrderCompletedCard key={orders.orderGroupId} orders={orders} />
            );
          })
        ) : (
          <Text fs="italic" c="dimmed">
            No orders completed yet
          </Text>
        )}
      </Flex>
    </Sidebar>
  );
}
