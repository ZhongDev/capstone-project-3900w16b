import { Title, Loader, createStyles, Flex } from "@mantine/core";
import useSWR from "swr";
import { Sidebar } from "@/components/Sidebar";
import { getRestaurantTables } from "@/api/table";
import Head from "next/head";
import { CreateTable, TableCard } from "@/components/TableCard";
import { Group } from "@mantine/core";
import { useState } from "react";
// import { DatePicker } from "@mantine/dates";

const useStyles = createStyles((theme) => ({
  menuSection: {
    marginTop: theme.spacing.xl,
  },
}));

export default function TableManagement() {
  const { classes } = useStyles();
  const [dates, setDates] = useState<[Date | null, Date | null]>([null, null]);
  const {
    data: tableData,
    error: tableDataError,
    isLoading: tableDataIsLoading,
  } = useSWR("/restaurant/table", getRestaurantTables);

  return (
    <>
      <Head>
        <title> Order Summaries </title>
      </Head>
      <Sidebar>
        <Flex gap="lg" align="center">
          <Title>Order Summaries</Title>
        </Flex>
        <Group position="center">
          <DatePicker
            type="range"
            allowSingleDateInRange
            value={dates}
            onChange={setDates}
          />
        </Group>
      </Sidebar>
    </>
  );
}
