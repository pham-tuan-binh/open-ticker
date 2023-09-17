"use client";

import * as React from "react";

import { NextUIProvider } from "@nextui-org/react";
import { Provider } from "react-redux";
import { Store, persistor } from "../../redux/Store";
import { PersistGate } from "redux-persist/integration/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={Store}>
      <PersistGate persistor={persistor}>
        <NextUIProvider>{children}</NextUIProvider>
      </PersistGate>
    </Provider>
  );
}
