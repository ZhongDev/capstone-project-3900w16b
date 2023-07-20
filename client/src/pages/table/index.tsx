import { Title, Loader, createStyles, Flex } from "@mantine/core";
import useSWR from "swr";
import { Sidebar } from "@/components/Sidebar";
import { getRestaurantTables } from "@/api/table";
import { CreateTable, TableCard } from "@/components/TableCard";

const useStyles = createStyles((theme) => ({
  menuSection: {
    marginTop: theme.spacing.xl,
  },
}));

export default function TableManagement() {
  const { classes } = useStyles();
  const {
    data: tableData,
    error: tableDataError,
    isLoading: tableDataIsLoading,
  } = useSWR("/restaurant/table", getRestaurantTables);

  return (
    <Sidebar>
      <Flex gap="lg" align="center">
        <Title>Table Setup</Title>
        <CreateTable />
      </Flex>
      <div className={classes.menuSection}>
        {tableDataIsLoading ? (
          <Loader />
        ) : (
          tableData?.tables.map((table) => {
            return <TableCard key={table.id} table={table} />;
          })
        )}
      </div>
    </Sidebar>
  );
}
