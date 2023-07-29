import {
  Table,
  createTable,
  deleteRestaurantTable,
  getTableNameById,
  getRestaurantTableById,
} from "@/api/table";
import {
  getOrders,
  GetOrdersResponse,
  orderStatusToComplete,
  orderStatusToOrdered,
  orderStatusToPrepared,
} from "@/api/order_status";
import {
  Paper,
  Flex,
  Title,
  Button,
  Modal,
  Group,
  createStyles,
  Text,
  TextInput,
  List,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import { useState } from "react";
import { mutate } from "swr";
import useSWR from "swr";

//import { OrderedProps } from "../Menu";

const useStyles = createStyles((theme) => ({
  menuCategory: {
    maxWidth: "50rem",
  },
  menuItems: {
    marginTop: theme.spacing.xl,
  },
}));
type OrdersProp = {
  orders: GetOrdersResponse[0];
};

export const OrderStatusCard = ({ orders }: OrdersProp) => {
  const { classes } = useStyles();
  const { data: OrdersData } = useSWR("order_status_card", getOrders);
  const [opened, { open, close }] = useDisclosure(false);
  const [openedSure, handler] = useDisclosure(false);
  const [viewDetails, setViewDetails] = useState(false);
  const [viewStatus, setViewStatus] = useState(orders.status);
  const [tableName, setTableName] = useState("");
  getTableNameById(orders.tableId).then((a) => {
    console.log(a);
    setTableName(a);
  });
  return (
    <Paper
      mb="sm"
      shadow="sm"
      radius="md"
      p="md"
      className={classes.menuCategory}
    >
      <Flex align="center" justify="space-between">
        <Title order={3} align="center">
          {tableName}
        </Title>
        <Text>Hi</Text>
        <Flex columnGap="xs">
          <Flex mt="xs">
            <List>
              {orders.items.map((item) => {
                return (
                  <List.Item key={item.id}>
                    {item.item.name} x{item.units}
                  </List.Item>
                );
              })}
            </List>
          </Flex>
        </Flex>

        <Group spacing="xs">
          <Button onClick={open} radius="xl" mr="xs">
            {viewStatus[0].toUpperCase() + viewStatus.slice(1).toLowerCase()}
          </Button>

          <Button radius="xl" variant="outline" mr="xs" onClick={handler.open}>
            Edit Status
          </Button>
          <Modal
            opened={openedSure}
            onClose={handler.close}
            title="Change Order Status To:"
          >
            <Group position="center">
              <Button
                onClick={() => {
                  orderStatusToOrdered(orders.orderGroupId).then(() => {
                    // mutate("/order/orders");
                    setViewStatus("ordered");
                  });
                  handler.close();
                }}
              >
                Ordered
              </Button>
              <Button
                onClick={() => {
                  orderStatusToPrepared(orders.orderGroupId).then(() => {
                    // mutate("/order/orders");
                    setViewStatus("prepared");
                  });
                  handler.close();
                }}
              >
                Prepared
              </Button>
              <Button
                onClick={() => {
                  orderStatusToComplete(orders.orderGroupId).then(() => {
                    // mutate("/order/orders");
                    setViewStatus("completed");
                  });
                  handler.close();
                }}
              >
                Complete
              </Button>
            </Group>
          </Modal>
        </Group>
      </Flex>
      <Text>Hi</Text>
    </Paper>
  );
};
