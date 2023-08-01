import { Menu } from "@/api/menu";
import { Tabs, createStyles, Text, Paper, Flex } from "@mantine/core";
import Image from "next/image";

const useStyles = createStyles((theme) => ({
  menuContainer: {
    maxWidth: "50rem",
    margin: `${theme.spacing.xl} auto`,
  },
  menuBody: {
    padding: theme.spacing.xl,
  },
  foodImage: {
    filter: "drop-shadow(0px 0px 3px rgba(0, 0, 0, 0.3))",
    "& > img": {
      borderRadius: theme.radius.md,
    },
  },
  item: {
    cursor: "pointer",
  },
}));

export type MenuTabProps = {
  menus: Menu[];
  onClick?: (itemId: number) => void;
};

export const MenuTab = ({ menus, onClick }: MenuTabProps) => {
  return (
    <Tabs
      styles={{
        tabsList: {
          border: "none",
        },
      }}
      p="lg"
      defaultValue="0"
    >
      <Tabs.List>
        {menus.map((category, i) => {
          return (
            <Tabs.Tab key={category.id} value={i.toString()}>
              <Text fz="xl" fw={700}>
                {category.name}
              </Text>
            </Tabs.Tab>
          );
        })}
      </Tabs.List>
      {menus.map((category, i) => {
        return (
          <Tabs.Panel key={category.id} value={i.toString()} pt="xs">
            <MenuItemsCards
              onClick={onClick}
              key={category.id}
              category={category}
            />
          </Tabs.Panel>
        );
      })}
    </Tabs>
  );
};

export type MenuItemsProps = {
  category: Menu;
  onClick?: (itemId: number) => void;
};

export const MenuItemsCards = ({ category, onClick }: MenuItemsProps) => {
  const { classes } = useStyles();

  return (
    <div className={classes.menuBody}>
      {category.items.length ? (
        category.items.map((item) => {
          return (
            <Paper
              className={classes.item}
              onClick={() => onClick?.(item.id)}
              shadow="md"
              p="md"
              mb="md"
              key={item.id}
            >
              <Flex justify="space-between">
                <div>
                  <Text fw={700} fz="lg">
                    {item.name}
                  </Text>
                  <Text>${(item.priceCents / 100).toFixed(2)}</Text>
                  <Text c="dimmed" fz="md">
                    {item.description}
                  </Text>
                </div>
                {item.image && (
                  <div className={classes.foodImage}>
                    <Image
                      src={
                        process.env.NEXT_PUBLIC_BASEURL +
                        "/public/" +
                        item.image
                      }
                      alt="food image"
                      width={100}
                      height={100}
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                )}
              </Flex>
            </Paper>
          );
        })
      ) : (
        <Text fs="italic" c="dimmed">
          There is nothing here...
        </Text>
      )}
    </div>
  );
};
