import DataObserver from "@/backend/patterns/DataObserver";
import React from "react";

export const SubscriptionObserverContext = React.createContext<DataObserver>(
  new DataObserver()
);

export const SettingsObserverContext = React.createContext<DataObserver>(
  new DataObserver()
);
