import { useRouter } from "next/router";
import useSWR from "swr";
import { Title, createStyles, Loader } from "@mantine/core";
import { getMenuByRestaurantId, GetMenuResponse, Menu } from "@/api/menu";
import { GradientButton } from "@/components/Button/GradientButton";
import { MenuTab } from "@/components/Menu";
import { OrderItem } from "@/components/Menu/OrderItem";

const useStyles = createStyles((theme) => ({
  menuContainer: {
    maxWidth: "50rem",
    margin: `${theme.spacing.xl} auto`,
  },
}));

export default function RestaurantMenu() {
  const router = useRouter();
  const restaurantId = Number(router.query.id);
  const { classes } = useStyles();

  const {
    data: menuData,
    error: menuError,
    isLoading: menuIsLoading,
  } = useSWR(router.isReady ? "/menu" : null, () =>
    getMenuByRestaurantId(restaurantId)
  );

  if (!router.isReady) {
    return null;
  }

  if (isNaN(restaurantId)) {
    return <Title>Do you think you&apos;re funny?</Title>;
  }

  //   <div className={classes.menuContainer}>
  //   <Title mb="sm" color="gold" align="center">
  //     {menuData?.restaurant.name}
  //   </Title>
  //   {/* {menuData?.menu ? <MenuTab menus={menuData.menu} /> : <Loader />} */}
  // </div>
  // <div
  //   style={{
  //     position: "fixed",
  //     bottom: "1rem",
  //     left: "50%",
  //     width: "50%",
  //     transform: "translate(-50%, 0)",
  //     display: "flex",
  //     justifyContent: "center",
  //   }}
  // >
  //   <GradientButton>View Bill</GradientButton>
  // </div>

  return (
    <>
      <OrderItem />
    </>
  );
}
