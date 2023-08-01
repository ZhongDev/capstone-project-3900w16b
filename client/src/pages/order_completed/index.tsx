import { Title, Loader, createStyles, Flex, ScrollArea } from "@mantine/core";
import useSWR from "swr";
import { Sidebar } from "@/components/Sidebar";
import { getOrders, GetOrdersResponse } from "@/api/order_status";
import { OrderCompletedCard } from "@/components/OrderCompletedCard";

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
    data: OrdersData,
    error: OrdersDataError,
    isLoading: OrdersDataIsLoading,
  } = useSWR("/order_status", getOrders);

  type OrdersProp = {
    orders: GetOrdersResponse[0];
  };

  return (
    <Sidebar>
      <Flex gap="lg" align="center">
        <Title>Orders Completed</Title>
      </Flex>
      <ScrollArea>
        <Flex className={classes.helpSection} gap="xs">
          {OrdersDataIsLoading ? (
            <Loader />
          ) : (
            OrdersData?.map((orders) => {
              if (orders.status != "completed") {
                return <></>;
              }
              return (
                <OrderCompletedCard key={orders.orderGroupId} orders={orders} />
              );
            })
          )}
        </Flex>
      </ScrollArea>
    </Sidebar>
  );
}
