import { Title, Loader, createStyles, Flex, Text, Paper } from "@mantine/core";
import useSWR from "swr";
import { Sidebar } from "@/components/Sidebar";
import Head from "next/head";
import { useEffect, useState } from "react";
import { getDaySummary } from "@/api/order";
import { DatePicker } from "@mantine/dates";
import { getMe } from "@/api/auth";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const useStyles = createStyles((theme) => ({
  statSection: {
    alignContent: "center",
    justifyContent: "space-evenly",
    marginTop: theme.spacing.xl,
  },
  miniSection: {
    alignItems: "center",
    justifyItems: "space-evenly",
    marginTop: theme.spacing.xl,
  },
}));

export default function TableManagement() {
  const { classes } = useStyles();
  const { data } = useSWR("/me", getMe);
  const [dates, setDates] = useState<[Date | null, Date | null]>([null, null]);
  const [statData, setStatData] = useState<
    | {
        from: string;
        to: string;
        totalRevenue: Number;
        totalOrders: Number;
        mostOrdered: string | undefined;
        data: { date: string; "revenue ($)": number; "item orders": number }[];
      }
    | undefined
  >();
  useEffect(() => {
    getDaySummary(
      data?.restaurantId,
      dates[0]?.toString(),
      dates[1]?.toString()
    ).then((res) => {
      let date = new Date(res.fromDate);
      setStatData({
        from: new Date(res.fromDate).toDateString(),
        to: new Date(res.toDate).toDateString(),
        totalRevenue: res.totalRevenue,
        totalOrders: res.totalOrders,
        mostOrdered: res.mostPopularItem,
        data: res.revenue.map((val, i) => {
          const dateString = date.toDateString();
          date.setDate(date.getDate() + 1);
          return {
            date: dateString,
            "revenue ($)": val,
            "item orders": res.numOrders[i],
          };
        }),
      });
      console.log("STATDATA :" + statData);
    });
  }, [dates]);

  return (
    <>
      <Head>
        <title> Restaurant Statistics </title>
      </Head>
      <Sidebar>
        <Flex gap="lg" align="center">
          <Title>Restaurant Statistics</Title>
        </Flex>
        <Flex className={classes.statSection}>
          <Flex direction="column" className={classes.miniSection}>
            <Paper shadow="md" mt="xs" px="xl" py="md" radius="md">
              <DatePicker
                type="range"
                allowSingleDateInRange
                value={dates}
                onChange={setDates}
              />
            </Paper>

            <Paper shadow="md" mt="xs" px="xl" py="md" radius="md">
              {statData?.data.length !== 0 ? (
                <Flex direction="column" align="center">
                  <Text fw={700} style={{ paddingBottom: "1rem" }}>
                    {statData?.from} - {statData?.to}
                  </Text>

                  <Text>
                    Total Revenue: ${statData?.totalRevenue.toLocaleString()}
                  </Text>
                  <Text>
                    Total Item Orders: {statData?.totalOrders.toLocaleString()}
                  </Text>
                  <Text>Most Popular Menu Item: {statData?.mostOrdered}</Text>
                </Flex>
              ) : (
                <Text fw={700}>Select dates to see restaurant stats!</Text>
              )}
            </Paper>
          </Flex>
          {statData?.data.length !== 0 && (
            <ResponsiveContainer width={"65%"} height={500}>
              <LineChart data={statData?.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue ($)"
                  stroke="#EAA844"
                  activeDot={{ r: 8 }}
                />
                <Line type="monotone" dataKey="item orders" stroke="#03adfc" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Flex>
      </Sidebar>
    </>
  );
}
