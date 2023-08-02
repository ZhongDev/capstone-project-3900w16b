import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getMe, GetMeResponse } from "@/api/auth";

export const useAuth = (redirectTo?: string) => {
  const [me, setMe] = useState<GetMeResponse | null | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    getMe()
      .then((me) => {
        setMe(me);
      })
      .catch(() => {
        setMe(null);
        if (redirectTo) {
          router.push(redirectTo);
        }
      });

    return () => setMe(undefined);
  }, [redirectTo, router]);

  return { me, setMe };
};
