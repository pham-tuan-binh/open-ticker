"use client";

import {
  configureStore,
  ThunkAction,
  Action,
  combineReducers,
} from "@reduxjs/toolkit";
import { PortfolioSlice } from "./PortfolioSlice";
import { SymbolChartSlice } from "./SymbolChartSlice";
import { PortfolioChartSlice } from "./PortfolioChartSlice";
import { SymbolLiveSlice } from "./SymbolLiveData";

import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

const rootReducer = combineReducers({
  [PortfolioSlice.name]: PortfolioSlice.reducer,
  [SymbolChartSlice.name]: SymbolChartSlice.reducer,
  [PortfolioChartSlice.name]: PortfolioChartSlice.reducer,
  [SymbolLiveSlice.name]: SymbolLiveSlice.reducer,
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const makeStore = () => {
  const store = configureStore({ reducer: persistedReducer });
  return store;
};

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore["getState"]>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action
>;

export const Store = makeStore();
export const persistor = persistStore(Store);
