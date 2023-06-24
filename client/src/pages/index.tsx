import { Title } from "@mantine/core";
import { getMe } from "@/api/auth";
import useSWR from "swr";

export default function Home() {
  const { data, error, isLoading } = useSWR("/me", getMe);

  if (isLoading) {
    return null;
  }

  if (error) {
    return <Title>Hi, you are not logged in</Title>;
  }

  return (
    <Title>
      Hi, you are currently logged in as restaurant id {data?.restaurantId}
    </Title>
  );
}
