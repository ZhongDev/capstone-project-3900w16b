import { useMemo } from "react";
import { createStyles } from "@mantine/core";
import { useSWRConfig } from "swr";
import { Menu, reorderCategories } from "@/api/menu";
import { Reorder } from "../Reorder";

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
  const { mutate } = useSWRConfig();

  const items = useMemo(
    () =>
      menu.map((category) => ({
        id: category.id,
        displayOrder: category.displayOrder,
        label: category.name,
      })),
    [menu]
  );

  return (
    <>
      <Reorder
        close={close}
        items={items}
        setNewOrder={(newOrder) => {
          return reorderCategories(newOrder)
            .then(() => mutate("/menu"))
            .then(close);
        }}
      />
    </>
  );
};
