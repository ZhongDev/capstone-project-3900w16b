import {
  Text,
  Flex,
  Paper,
  Button,
  Modal,
  Group,
  Card,
  List,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useSWRConfig } from "swr";
import { MenuItem, deleteMenuItem, updateMenuItem } from "@/api/menu";
import { formatCurrency } from "@/helpers";
import { EditItemModal } from "./EditItemModal";

export type ItemsProps = {
  items: MenuItem[];
};

export const Items = ({ items }: ItemsProps) => {
  return (
    <>
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </>
  );
};

export type ItemCardProps = {
  item: MenuItem;
};

export const ItemCard = ({ item }: ItemCardProps) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [openedSure, handler] = useDisclosure(false);

  const { mutate } = useSWRConfig();

  return (
    <Paper shadow="md" mt="xs" px="xl" py="md" radius="md">
      <Flex align="center" justify="space-between">
        <div>
          <Text fw={500} fz="lg">
            {item.name}
          </Text>
          <Text c="dimmed">{item.description}</Text>
        </div>
        <Flex columnGap="lg" align="center">
          <div>
            <Text fw={500} fz="lg">
              {formatCurrency(item.priceCents)}
            </Text>
          </div>
          <Group spacing="xs">
            <EditItemModal
              item={item}
              opened={opened}
              close={close}
              open={open}
            />
            <Button variant="outline" radius="xl" onClick={handler.open}>
              Delete
            </Button>
            <Modal
              opened={openedSure}
              onClose={handler.close}
              title="Are you sure you want to delete this item?"
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
                  type="submit"
                  onClick={() => {
                    deleteMenuItem(item.id).then(() => {
                      mutate("/menu");
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
      </Flex>
      {item.alterations.length > 0 && (
        <Card>
          <Text fw={500}>Available alterations</Text>
          <List>
            {item.alterations.map((alteration) => {
              return (
                <List.Item key={alteration.id}>
                  <Text>
                    {alteration.optionName}{" "}
                    <Text c="dimmed" fs="italic" span>
                      [max {alteration.maxChoices} choice(s)]
                    </Text>
                  </Text>
                  <List listStyleType="circle">
                    {alteration.options.map((option) => {
                      return (
                        <List.Item key={option.id}>{option.choice}</List.Item>
                      );
                    })}
                  </List>
                </List.Item>
              );
            })}
          </List>
        </Card>
      )}
    </Paper>
  );
};
