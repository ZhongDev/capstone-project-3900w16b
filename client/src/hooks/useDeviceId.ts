import { useState } from "react";
import { v4 as uuid } from "uuid";

export const useDeviceId = () => {
  const [deviceId, setDeviceId] = useState(
    localStorage.getItem("deviceId") ?? ""
  );

  if (!deviceId) {
    const id = uuid();
    localStorage.setItem("deviceId", id);
    setDeviceId(id);
  }

  return deviceId;
};
