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
import {
  createCategory,
  createItem,
  getMenu,
  Menu,
  MenuItem,
} from "@/api/menu";

const useStyles = createStyles((theme) => ({
  menuSection: {
    marginTop: theme.spacing.xl,
  },
  menuCategory: {
    maxWidth: "50rem",
  },
  menuItems: {
    marginTop: theme.spacing.xl,
  },
}));


export default function TableManagement() {
  const { classes } = useStyles();
  const {
    data: menuData,
    error: menuDataError,
    isLoading: menuDataIsLoading,
  } = useSWR("/table", getMenu);

  return (
    <Sidebar>
      <Flex gap="lg" align="center">
        <Title>Table Setup</Title>
        {/* <CreateCategory /> */}
      </Flex> 
      {/* <div className={classes.menuSection}>
        {menuDataIsLoading ? (
          <Loader />
        ) : (
          menuData?.menu.map((category) => {
            return <CategoryCard key={category.id} category={category} />;
          })
        )}
      </div> */}
    </Sidebar>
  );
}