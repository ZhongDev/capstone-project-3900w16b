import { Table, createTable, deleteRestaurantTable } from "@/api/table";
import { getOrders, GetOrdersResponse } from "@/api/order_status";
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
import QRCode from "qrcode.react";
import { useState } from "react";
import { mutate } from "swr";
import { OrderedProps } from "../Menu";

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
  const [opened, { open, close }] = useDisclosure(false);
  const [openedSure, handler] = useDisclosure(false);
  const [viewDetails, setViewDetails] = useState(false);

  return (
    <Paper
      mb="sm"
      shadow="sm"
      radius="md"
      p="md"
      className={classes.menuCategory}
    >
      <Flex align="center" justify="space-between">
        <Title px="xl" align="center">
          {orders.orderGroupId}
        </Title>
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
          <Button onClick={open} radius="xl" variant="outline" mr="xs">
            Order Status
          </Button>

          <Button radius="xl" variant="outline" mr="xs" onClick={handler.open}>
            Delete
          </Button>
          <Modal
            opened={openedSure}
            onClose={handler.close}
            title="Are you sure?"
          >
            <Group position="right">
              <Button
                variant="subtle"
                onClick={() => {
                  handler.close();
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  deleteRestaurantTable(orders.id).then(() => {
                    mutate("/restaurant/table");
                    close();
                  });
                }}
              >
                Yes
              </Button>
            </Group>
          </Modal>
        </Group>
      </Flex>
    </Paper>
  );
};
