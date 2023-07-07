import Image from "next/image";
import { Button, Text, createStyles } from "@mantine/core";
import { ButtonGroup, GradientButton } from "@/components/Button";
import ayaya from "@/public/img/ayaya.jpg";

const useStyles = createStyles((theme) => ({
  foodImageContainer: {
    width: "100%",
    height: "250px",
    position: "relative",
  },
  itemInformation: {
    padding: theme.spacing.xl,
  },
  floatingButtonGroup: {
    position: "fixed",
    bottom: "1rem",
    left: "50%",
    width: "100%",
    padding: `0px ${theme.spacing.xl}`,
    transform: "translate(-50%, 0)",
    display: "flex",
    flexDirection: "column",
    gap: `${theme.spacing.sm} 0px`,
    justifyContent: "center",
    alignItems: "center",
  },
}));

export const OrderItem = () => {
  const { classes } = useStyles();

  return (
    <div>
      <div className={classes.foodImageContainer}>
        <Image
          src={ayaya}
          alt="food image"
          fill
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </div>
      <div className={classes.itemInformation}>
        <Text fw={500} fz="lg">
          Edamame
        </Text>
        <Text fz="sm">$6.80</Text>
        <Text fz="sm">Lightly salted soybeans</Text>
      </div>
      <div className={classes.floatingButtonGroup}>
        <ButtonGroup />
        <GradientButton fullWidth>Add 2 to cart</GradientButton>
      </div>
    </div>
  );
};
