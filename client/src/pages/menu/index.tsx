import { useState } from "react";
import {
  Paper,
  Title,
  Loader,
  Button,
  createStyles,
  Flex,
  Modal,
  TextInput,
  Group,
  Text,
  Accordion,
  ButtonProps,
  Textarea,
  NumberInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import useSWR, { mutate } from "swr";
import { Sidebar } from "@/components/Sidebar";
import { CategoryCard, CreateCategory } from "@/components/CategoryCard";
import {
  createCategory,
  updateMenuCategory,
  deleteMenuCategory,
  createItem,
  updateMenuItem,
  deleteMenuItem,
  getMenu,
  Menu,
  MenuItem,
} from "@/api/menu";
import { formatCurrency } from "@/helpers";

const useStyles = createStyles((theme) => ({
  menuSection: {
    marginTop: theme.spacing.xl,
  },
}));

export default function MenuManagement() {
  const { classes } = useStyles();
  const {
    data: menuData,
    error: menuDataError,
    isLoading: menuDataIsLoading,
  } = useSWR("/menu", getMenu);

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
