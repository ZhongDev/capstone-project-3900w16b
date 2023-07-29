import { Title, Loader, createStyles, Flex } from "@mantine/core";
import useSWR from "swr";
import { Sidebar } from "@/components/Sidebar";
import { getRestaurantTables } from "@/api/table";
import { CreateTable, TableCard } from "@/components/TableCard";
import { getOrders, GetOrdersResponse } from "@/api/order_status";
import { OrderStatusCard } from "@/components/OrderStatusCard";

const useStyles = createStyles((theme) => ({
  menuSection: {
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
        <Title>Order status</Title>
      </Flex>
      <div className={classes.menuSection}>
        {OrdersDataIsLoading ? (
          <Loader />
        ) : (
          OrdersData?.map((orders) => {
            return (
              <OrderStatusCard key={orders.orderGroupId} orders={orders} />
            );
          })
        )}
      </div>
    </Sidebar>
  );
}
