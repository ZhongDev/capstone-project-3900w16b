import { useMemo, useState } from "react";
import {
  Button,
  createStyles,
  Flex,
  Paper,
  ActionIcon,
  Title,
  Group,
} from "@mantine/core";
import { IconArrowUp, IconArrowDown } from "@tabler/icons-react";
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

// export const ReorderCategories = ({ menu, close }: ReorderCategoriesProps) => {
//   const { classes } = useStyles();
//   const { mutate } = useSWRConfig();

//   const [saving, setSaving] = useState(false);
//   // key: category id
//   // value: display order
//   const [ordering, setOrdering] = useState<Map<number, number>>(
//     setInitialOrderMap(menu)
//   );

//   const sortedMenu = useMemo(
//     () =>
//       [...menu].sort((a, b) => {
//         const aOrder = ordering.get(a.id);
//         const bOrder = ordering.get(b.id);
//         if (aOrder === undefined || bOrder === undefined) {
//           return 0;
//         }
//         return aOrder - bOrder;
//       }),
//     [menu, ordering]
//   );

//   const swapOrder = (id1: number, id2: number) => {
//     const newOrdering = new Map(ordering);
//     const displayOrder1 = newOrdering.get(id1);
//     const displayOrder2 = newOrdering.get(id2);

//     if (displayOrder1 !== undefined && displayOrder2 !== undefined) {
//       newOrdering.set(id1, displayOrder2);
//       newOrdering.set(id2, displayOrder1);
//       setOrdering(newOrdering);
//     }
//   };

//   const canMoveUp = (i: number) => i > 0;
//   const canMoveDown = (i: number) => i < sortedMenu.length - 1;

//   return (
//     <>
//       {sortedMenu.map((category, i) => {
//         return (
//           <Paper
//             className={classes.categoryCard}
//             shadow="md"
//             p="md"
//             mb="md"
//             key={category.id}
//           >
//             <Flex align="center" columnGap="lg">
//               <Button.Group orientation="vertical">
//                 <ActionIcon
//                   size="sm"
//                   variant="default"
//                   disabled={!canMoveUp(i)}
//                   onClick={() => {
//                     if (canMoveUp(i)) {
//                       swapOrder(sortedMenu[i].id, sortedMenu[i - 1].id);
//                     }
//                   }}
//                 >
//                   <IconArrowUp size="0.875rem" />
//                 </ActionIcon>
//                 <ActionIcon
//                   size="sm"
//                   disabled={!canMoveDown(i)}
//                   variant="default"
//                   onClick={() => {
//                     if (canMoveDown(i)) {
//                       swapOrder(sortedMenu[i].id, sortedMenu[i + 1].id);
//                     }
//                   }}
//                 >
//                   <IconArrowDown size="0.875rem" />
//                 </ActionIcon>
//               </Button.Group>
//               <Title>{category.name}</Title>
//             </Flex>
//           </Paper>
//         );
//       })}
//       <Group spacing="xs">
//         <Button loading={saving} variant="subtle" onClick={close}>
//           Cancel
//         </Button>
//         <Button
//           loading={saving}
//           onClick={() => {
//             setSaving(true);
//             reorderCategories(
//               [...ordering.entries()]
//                 .sort((a, b) => a[1] - b[1])
//                 .map(([id]) => id)
//             )
//               .then(() => mutate("/menu"))
//               .then(() => close())
//               .finally(() => setSaving(false));
//           }}
//         >
//           Save
//         </Button>
//       </Group>
//     </>
//   );
// };

const setInitialOrderMap = (menu: Menu[]) => {
  return new Map(menu.map((category) => [category.id, category.displayOrder]));
};
