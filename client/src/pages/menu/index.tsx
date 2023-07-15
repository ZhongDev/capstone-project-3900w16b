import { Title, Loader, createStyles, Flex } from "@mantine/core";
import useSWR from "swr";
import { Sidebar } from "@/components/Sidebar";
import { CategoryCard, CreateCategory } from "@/components/CategoryCard";
import { getMenu } from "@/api/menu";

const useStyles = createStyles((theme) => ({
  menuSection: {
    marginTop: theme.spacing.xl,
  },
}));

export default function MenuManagement() {
  const { classes } = useStyles();
  const { data: menuData, isLoading: menuDataIsLoading } = useSWR(
    "/menu",
    getMenu
  );

  return (
    <Sidebar>
      <Flex gap="lg" align="center">
        <Title>Categories</Title>
        <CreateCategory />
      </Flex>
      <div className={classes.menuSection}>
        {menuDataIsLoading ? (
          <Loader />
        ) : (
          menuData?.menu.map((category) => {
            return <CategoryCard key={category.id} category={category} />;
          })
        )}
      </div>
    </Sidebar>
  );
}
