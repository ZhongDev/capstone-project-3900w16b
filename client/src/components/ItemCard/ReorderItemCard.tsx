import { useSWRConfig } from "swr";
import { MenuItem, reorderItems } from "@/api/menu";
import { Reorder } from "../Reorder";

export type ReorderItemCardProps = {
  categoryId: number;
  items: MenuItem[];
  close: () => void;
};

export const ReorderItemCard = ({
  categoryId,
  items,
  close,
}: ReorderItemCardProps) => {
  const { mutate } = useSWRConfig();

  return (
    <Reorder
      setNewOrder={(newOrder) =>
        reorderItems(categoryId, newOrder).then(() => mutate("/menu"))
      }
      close={close}
      items={items.map((item) => ({
        id: item.id,
        displayOrder: item.displayOrder,
        label: item.name,
      }))}
    />
  );
};
