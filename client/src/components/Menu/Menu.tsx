import { Menu } from "@/api/menu";
import { GradientButton } from "@/components/Button/GradientButton";
import {
  Title,
  Tabs,
  createStyles,
  Text,
  Paper,
  Button,
  Flex,
  Loader,
} from "@mantine/core";
import ayaya from "@/public/img/ayaya.jpg";
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
    // border: "1px solid rgba(0, 0, 0, 0.2)",
    filter: "drop-shadow(0px 0px 3px rgba(0, 0, 0, 0.3))",
    "& > img": {
      borderRadius: theme.radius.md,
    },
  },
}));

export type MenuTabProps = {
  menus: Menu[];
};

export const MenuTab = ({ menus }: MenuTabProps) => {
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
            <MenuItems key={category.id} category={category} />
          </Tabs.Panel>
        );
      })}
    </Tabs>
  );
};

export type MenuItemsProps = {
  category: Menu;
};

export const MenuItems = ({ category }: MenuItemsProps) => {
  const { classes } = useStyles();

  return (
    <div className={classes.menuBody}>
      {category.items.length ? (
        category.items.map((item) => {
          return (
            <Paper shadow="md" p="md" mb="md" key={item.id}>
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
                <div className={classes.foodImage}>
                  <Image src={ayaya} alt="food image" width={100} />
                </div>
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
