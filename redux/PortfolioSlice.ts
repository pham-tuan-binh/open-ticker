"use client";

import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "./Store";
import { HYDRATE } from "next-redux-wrapper";

export interface SymbolEntry {
  name: string;
  quantity: number;
}

export interface PortfolioEntry {
  name: string;
  lastUpdated: number;
  symbols: Array<SymbolEntry>;
}

interface PortfolioList {
  isLoading: boolean;
  focusedPortfolio: string;
  data: Array<PortfolioEntry>;
}

// Initial state
const initialState: PortfolioList = {
  isLoading: true,
  focusedPortfolio: "Default Portfolio",
  data: [
    {
      name: "Default Portfolio",
      lastUpdated: 0,
      symbols: [],
    },
  ],
};

// Actual Slice
export const PortfolioSlice = createSlice({
  name: "portfolio",
  initialState,
  reducers: {
    focusOnPortfolio(state, action) {
      const portfolio = state.data.find(
        (entity) => entity.name == action.payload.portfolio
      );

      if (portfolio != undefined) {
        return {
          ...state,
          focusedPortfolio: action.payload.portfolio, // Create a new object for focusedPortfolio
        };
      }

      return { ...state };
    },
    addPortfolio(state, action) {
      const portfolio: PortfolioEntry = action.payload;

      return {
        ...state,
        data: [...state.data, portfolio],
      };
    },
    removePortfolio(state, action) {
      const portfolioName: string = action.payload.portfolio;
      const index = state.data.findIndex(
        (entity: PortfolioEntry) => entity.name == portfolioName
      );

      if (index >= 0) {
        return {
          ...state,
          data: state.data.filter((value, id) => id != index),
        };
      }
    },
    addSymbolToPortfolio(state, action) {
      const portfolioName: string = action.payload.portfolio;
      const symbol: SymbolEntry = action.payload.symbol;
      const entry = state.data.findIndex(
        (entity: PortfolioEntry) => entity.name == portfolioName
      );

      if (entry >= 0) {
        const updatedEntry = {
          ...state.data[entry],
          symbols: [...state.data[entry].symbols, symbol],
        };

        // Create a new state object with the updated data array
        const updatedData = [
          ...state.data.slice(0, entry),
          updatedEntry,
          ...state.data.slice(entry + 1),
        ];

        return {
          ...state,
          data: updatedData,
        };
      }

      return state;
    },
    updateTime(state, action) {
      const portfolioName = action.payload.portfolio;

      // Find the index of the portfolio entry to update
      const entryIndex = state.data.findIndex(
        (entity) => entity.name == portfolioName
      );

      // If the portfolio entry exists, create a new array with the updated entry
      if (entryIndex != -1) {
        const updatedEntry = {
          ...state.data[entryIndex],
          lastUpdated: new Date().getTime(),
        };

        // Create a new state object with the updated data array
        const updatedData = [
          ...state.data.slice(0, entryIndex),
          updatedEntry,
          ...state.data.slice(entryIndex + 1),
        ];

        return {
          ...state,
          data: updatedData,
        };
      }

      return state;
    },
    removeSymbolFromPortfolio(state, action) {
      const portfolioName = action.payload.portfolio;
      const symbolName = action.payload.symbol;

      // Find the index of the portfolio entry to update
      const entryIndex = state.data.findIndex(
        (entity) => entity.name == portfolioName
      );

      // If the portfolio entry exists, create a new array with the symbol removed
      if (entryIndex != -1) {
        const entry = { ...state.data[entryIndex] };

        const symbolIndex = entry.symbols.findIndex(
          (entity) => entity.name == symbolName
        );

        if (symbolIndex >= 0) {
          entry.symbols = [
            ...entry.symbols.slice(0, symbolIndex),
            ...entry.symbols.slice(symbolIndex + 1),
          ];

          // Create a new state object with the updated data array
          const updatedData = [
            ...state.data.slice(0, entryIndex),
            entry,
            ...state.data.slice(entryIndex + 1),
          ];

          return {
            ...state,
            data: updatedData,
          };
        }
      }

      // If the portfolio entry or symbol does not exist, return the original state
      return state;
    },
  },

  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.portfolio,
      };
    },
  },
});

export const {
  addPortfolio,
  addSymbolToPortfolio,
  removePortfolio,
  removeSymbolFromPortfolio,
  focusOnPortfolio,
  updateTime,
} = PortfolioSlice.actions;

export const getPortfolioList = (state: AppState) => state.portfolio.data;
export const getFocusedPortfolio = (state: AppState) =>
  state.portfolio.focusedPortfolio;
export const getLoadingPortfolioState = (state: AppState) =>
  state.portfolio.isLoading;

export default PortfolioSlice.reducer;
