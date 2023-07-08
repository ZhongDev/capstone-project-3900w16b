import { Button, ButtonProps } from "@mantine/core";

export const GradientButton = ({
  children,
  ...props
}: ButtonProps & Omit<React.HTMLProps<HTMLButtonElement>, "ref">) => {
  return (
    <Button
      style={
        props.variant === "filled"
          ? {
              background:
                "linear-gradient(144deg, rgba(234,168,68,1) 56%, rgba(253,202,125,1) 100%)",
            }
          : {}
      }
      color="gold"
      radius="xl"
      size="xl"
      {...props}
    >
      {children}
    </Button>
  );
};
