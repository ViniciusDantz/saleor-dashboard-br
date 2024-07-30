import { useNavigatorOnLine } from "@dashboard/hooks/useNavigatorOnLine";
import React from "react";
import { useRegisterSW } from "virtual:pwa-register/react";

import { NewVersionAvailable } from "./NewVersionAvailable";
import { YouAreOffline } from "./YouAreOffline";

export const TopWarning = () => {
  const {
    needRefresh: [needRefresh],
  } = useRegisterSW();

  const isOnline = useNavigatorOnLine();

  if (!isOnline) {
    return <YouAreOffline />;
  }

  if (needRefresh) {
    return <NewVersionAvailable />;
  }

  return null;
};
