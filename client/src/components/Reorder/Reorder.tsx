import { useMemo, useState } from "react";
import {
  Paper,
  Flex,
  Button,
  ActionIcon,
  createStyles,
  Title,
  Group,
} from "@mantine/core";
import { IconArrowUp, IconArrowDown } from "@tabler/icons-react";

const useStyles = createStyles((theme) => ({
  categoryCard: {
    maxWidth: "50rem",
  },
}));

export type ReorderProps = {
  items: { id: number; label: string; displayOrder: number }[];
  setNewOrder: (newOrderedIds: number[]) => Promise<any> | void;
  close: () => void;
};

export const Reorder = ({ items, setNewOrder, close }: ReorderProps) => {
  const { classes } = useStyles();

  const [ordering, setOrdering] = useState<Map<number, number>>(
    new Map(items.map((item) => [item.id, item.displayOrder]))
  );

  const [loading, setLoading] = useState(false);

  const sortedItems = useMemo(
    () =>
      [...items].sort((a, b) => {
        const aOrder = ordering.get(a.id);
        const bOrder = ordering.get(b.id);
        if (aOrder === undefined || bOrder === undefined) {
          return 0;
        }
        return aOrder - bOrder;
      }),
    [items, ordering]
  );

  const swapOrder = (id1: number, id2: number) => {
    const newOrdering = new Map(ordering);
    const displayOrder1 = newOrdering.get(id1);
    const displayOrder2 = newOrdering.get(id2);

    if (displayOrder1 !== undefined && displayOrder2 !== undefined) {
      newOrdering.set(id1, displayOrder2);
      newOrdering.set(id2, displayOrder1);
      setOrdering(newOrdering);
    }
  };

  return (
    <>
      {sortedItems.map((item, i) => {
        const canMoveUp = (i: number) => i > 0;
        const canMoveDown = (i: number) => i < sortedItems.length - 1;

        return (
          <Paper
            className={classes.categoryCard}
            shadow="md"
            p="md"
            mb="md"
            key={item.id}
          >
            <Flex align="center" columnGap="lg">
              <Button.Group orientation="vertical">
                <ActionIcon
                  size="sm"
                  variant="default"
                  disabled={!canMoveUp(i)}
                  onClick={() => {
                    if (canMoveUp(i)) {
                      swapOrder(sortedItems[i].id, sortedItems[i - 1].id);
                    }
                  }}
                >
                  <IconArrowUp size="0.875rem" />
                </ActionIcon>
                <ActionIcon
                  size="sm"
                  disabled={!canMoveDown(i)}
                  variant="default"
                  onClick={() => {
                    if (canMoveDown(i)) {
                      swapOrder(sortedItems[i].id, sortedItems[i + 1].id);
                    }
                  }}
                >
                  <IconArrowDown size="0.875rem" />
                </ActionIcon>
              </Button.Group>
              <Title>{item.label}</Title>
            </Flex>
          </Paper>
        );
      })}
      <Group spacing="xs">
        <Button disabled={loading} variant="subtle" onClick={close}>
          Cancel
        </Button>
        <Button
          loading={loading}
          onClick={() => {
            const promise = setNewOrder(
              [...ordering.entries()]
                .sort((a, b) => a[1] - b[1])
                .map(([id]) => id)
            );

            if (promise) {
              setLoading(true);
              promise.then(() => close()).finally(() => setLoading(false));
            }
          }}
        >
          Save
        </Button>
      </Group>
    </>
  );
};
