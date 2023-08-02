import { getTableNameById } from "@/api/table";
import {
  getOrders,
  GetOrdersResponse,
  orderStatusToComplete,
  orderStatusToOrdered,
  orderStatusToPrepared,
  getOrderTimeById,
} from "@/api/order_status";
import {
  Paper,
  Flex,
  Stack,
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

import { useEffect, useState } from "react";
import { mutate } from "swr";
import useSWR from "swr";

const useStyles = createStyles((theme) => ({
  menuCategory: {
    width: "15rem",
    maxHeight: "50rem",
    alignSelf: "start",
  },
  menuItems: {
    marginTop: theme.spacing.xl,
  },
  buttonFlex: {
    justifyContent: "space-between",
    height: "100%",
  },
  itemText: {
    fontWeight: 600,
  },
  texts: {
    paddingRight: "10px",
  },
}));
type OrdersProp = {
  orders: GetOrdersResponse[0];
};

export const OrderCompletedCard = ({ orders }: OrdersProp) => {
  const { classes } = useStyles();
  const { data: OrdersData } = useSWR("order_status_card", getOrders);
  const [opened, { open, close }] = useDisclosure(false);
  const [openedSure, handler] = useDisclosure(false);
  const [viewStatus, setViewStatus] = useState(orders.status);
  const [tableName, setTableName] = useState("");
  const [viewHour, setViewHour] = useState("");
  const [viewMinute, setViewMinute] = useState("");
  useEffect(() => {
    getTableNameById(orders.tableId).then((a) => {
      console.log(a);
      setTableName(a);
    });
    getOrderTimeById(orders.orderGroupId).then((b) => {
      setViewHour(b.hour);
      setViewMinute(b.minute);
    });
  }, []);

  return (
    <Paper
      mb="sm"
      shadow="sm"
      radius="md"
      p="md"
      className={classes.menuCategory}
    >
      <Flex direction="column" className={classes.buttonFlex} gap="lg">
        <Flex align="center" justify="center" className={classes.texts}>
          <Flex columnGap="xs">
            <Flex mt="xs">
              <Stack align="flex-start" spacing="xs">
                <Title order={3} align="center">
                  {"Table: " + tableName}
                </Title>
                <Text>{"Order Id: " + orders.orderGroupId}</Text>
                <Text>
                  {"Order Time: " +
                    viewHour +
                    "h " +
                    viewMinute +
                    "m " +
                    " ago"}
                </Text>
                <List className={classes.itemText}>
                  {orders.items.map((item) => {
                    return (
                      <List.Item key={item.id}>
                        {item.item.name} x{item.units}
                        <List>
                          {item.alterations.map((alteration, i) => {
                            return alteration.alterationOptions.map(
                              (optionText) => {
                                return (
                                  <List.Item key={optionText}>
                                    {optionText}
                                  </List.Item>
                                );
                              }
                            );
                          })}
                        </List>
                      </List.Item>
                    );
                  })}
                </List>
              </Stack>
            </Flex>
          </Flex>
        </Flex>
        <Flex justify="center" align="flex-end">
          <Stack>
            <Button
              radius="xl"
              variant="outline"
              mr="xs"
              onClick={handler.open}
            >
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
                      setViewStatus("ordered");
                    });
                    mutate("/order_status");
                    handler.close();
                  }}
                >
                  Ordered
                </Button>
                <Button
                  onClick={() => {
                    orderStatusToPrepared(orders.orderGroupId).then(() => {
                      setViewStatus("prepared");
                    });
                    mutate("/order_status");
                    handler.close();
                  }}
                >
                  Prepared
                </Button>
              </Group>
            </Modal>
          </Stack>
        </Flex>
      </Flex>
    </Paper>
  );
};
