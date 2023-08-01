import { Title, Loader, createStyles, Flex, Text } from "@mantine/core";
import useSWR from "swr";
import { Sidebar } from "@/components/Sidebar";
import { getRestaurantTables } from "@/api/table";
import Head from "next/head";
import { CreateTable, TableCard } from "@/components/TableCard";
import { Group } from "@mantine/core";
import { useEffect, useState } from "react";
import { getDaySummary } from "@/api/order";
import { DatePicker } from "@mantine/dates";
import { getMe } from "@/api/auth";

const useStyles = createStyles((theme) => ({
  menuSection: {
    marginTop: theme.spacing.xl,
  },
}));

export default function TableManagement() {
  const { classes } = useStyles();
  const { data, error, isLoading } = useSWR("/me", getMe);
  const [dates, setDates] = useState<[Date | null, Date | null]>([null, null]);
  const [shit, setShit] = useState("");
  useEffect(() => {
    getDaySummary(
      data?.restaurantId,
      dates[0]?.toString(),
      dates[1]?.toString()
    ).then((res) => {
      setShit(JSON.stringify(res));
    });
  }, [dates]);

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
          <Text>{shit}</Text>
        </Group>
      </Sidebar>
    </>
  );
}
