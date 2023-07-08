import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import { Title, createStyles, Loader, Drawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { getMenuByRestaurantId } from "@/api/menu";
import { GradientButton } from "@/components/Button";
import { MenuTab } from "@/components/Menu";
import { OrderItem, Bill } from "@/components/Menu";

const useStyles = createStyles((theme) => ({
  menuContainer: {
    maxWidth: "50rem",
    margin: `${theme.spacing.xl} auto`,
  },
}));

type View =
  | {
      type: "item";
      itemId: number;
    }
  | { type: "bill" }
  | null;

export default function RestaurantMenu() {
  const router = useRouter();
  const restaurantId = Number(router.query.id);
  const [view, setView] = useState<View>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const { classes } = useStyles();

  const {
    data: menuData,
    error: menuError,
    isLoading: menuIsLoading,
  } = useSWR(router.isReady ? "/menu" : null, () =>
    getMenuByRestaurantId(restaurantId)
  );

  const allMenuItems = useMemo(
    () =>
      menuData?.menu.flatMap((categories) =>
        categories.items.map((item) => item)
      ),
    [menuData]
  );

  if (!router.isReady) {
    return null;
  }

  if (isNaN(restaurantId)) {
    return <Title>Do you think you&apos;re funny?</Title>;
  }

  return (
    <>
      <Drawer
        withCloseButton={false}
        size="90%"
        position="bottom"
        opened={opened}
        onClose={close}
        styles={{
          body: {
            height: "100%",
          },
        }}
      >
        {view?.type === "item" && (
          <OrderItem close={close} itemId={view.itemId} />
        )}
        {view?.type === "bill" && menuData && allMenuItems && (
          <Bill restaurantName={menuData.restaurant.name} menu={allMenuItems} />
        )}
      </Drawer>
      <div className={classes.menuContainer}>
        <Title mb="sm" color="gold" align="center">
          {menuData?.restaurant.name}
        </Title>
        {menuData?.menu ? (
          <MenuTab
            onClick={(itemId) => {
              setView({ type: "item", itemId });
              open();
            }}
            menus={menuData.menu}
          />
        ) : (
          <Loader />
        )}
      </div>
      <div
        style={{
          position: "fixed",
          bottom: "1rem",
          left: "50%",
          width: "50%",
          transform: "translate(-50%, 0)",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <GradientButton
          onClick={() => {
            setView({ type: "bill" });
            open();
          }}
        >
          View Bill
        </GradientButton>
      </div>
    </>
  );
}
