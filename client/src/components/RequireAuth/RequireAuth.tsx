import { ReactNode, useContext } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "@/providers";
import { AuthIndicator } from "../AuthIndicator";

export const RequireAuth = ({ children }: { children: ReactNode }) => {
  const authContext = useContext(AuthContext);
  const router = useRouter();

  if (authContext === undefined) {
    return <AuthIndicator />;
  }

  if (authContext.me === null) {
    router.replace("/login");
    return null;
  }

  return <>{children}</>;
};
