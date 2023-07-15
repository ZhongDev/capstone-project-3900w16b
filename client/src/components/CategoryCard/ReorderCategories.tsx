import { useEffect, useMemo, useState } from "react";
import { Button, createStyles, Flex, Paper, Text, Title } from "@mantine/core";
import { Menu } from "@/api/menu";

const useStyles = createStyles((theme) => ({
  categoryCard: {
    maxWidth: "50rem",
  },
}));

export type ReorderCategoriesProps = {
  menu: Menu[];
  close: () => void;
};

export const ReorderCategories = ({ menu, close }: ReorderCategoriesProps) => {
  const { classes } = useStyles();

  // key: category id
  // value: display order
  const [ordering, setOrdering] = useState<Map<number, number>>(
    setInitialOrderMap(menu)
  );

  const sortedMenu = useMemo(
    () =>
      [...menu].sort((a, b) => {
        const aOrder = ordering.get(a.id);
        const bOrder = ordering.get(b.id);
        if (aOrder === undefined || bOrder === undefined) {
          return 0;
        }
        return aOrder - bOrder;
      }),
    [menu, ordering]
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

  const canMoveUp = (i: number) => i > 0;
  const canMoveDown = (i: number) => i < sortedMenu.length - 1;

  return (
    <>
      {sortedMenu.map((category, i) => {
        return (
          <Paper
            className={classes.categoryCard}
            shadow="md"
            p="md"
            mb="md"
            key={category.id}
          >
            <Flex align="center" columnGap="xs">
              <Button.Group orientation="vertical">
                <Button
                  disabled={!canMoveUp(i)}
                  onClick={() => {
                    if (canMoveUp(i)) {
                      swapOrder(sortedMenu[i].id, sortedMenu[i - 1].id);
                    }
                  }}
                  variant="subtle"
                >
                  up
                </Button>
                <Button
                  disabled={!canMoveDown(i)}
                  onClick={() => {
                    if (canMoveDown(i)) {
                      swapOrder(sortedMenu[i].id, sortedMenu[i + 1].id);
                    }
                  }}
                  variant="subtle"
                >
                  down
                </Button>
              </Button.Group>
              <Title>{category.name}</Title>
            </Flex>
          </Paper>
        );
      })}
      <Button
        onClick={() => {
          console.log(
            [...ordering.entries()]
              .sort((a, b) => a[1] - b[1])
              .map(([id]) => id)
          );
          close();
        }}
      >
        Save
      </Button>
    </>
  );
};

const setInitialOrderMap = (menu: Menu[]) => {
  return new Map(menu.map((category) => [category.id, category.displayOrder]));
};
