"use client";

import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "./Store";
import { HYDRATE } from "next-redux-wrapper";

export interface OHLCTEntry {
  open: number;
  high: number;
  low: number;
  close: number;
  time: number;
}

export interface PortfolioChartEntry {
  name: string;
  chart: Array<OHLCTEntry>;
}

interface PortfolioChartList {
  data: Array<PortfolioChartEntry>;
}

// Initial state
const initialState: PortfolioChartList = {
  data: [],
};

// Actual Slice
export const PortfolioChartSlice = createSlice({
  name: "portfolioChart",
  initialState,
  reducers: {
    addPortfolioChart(state, action) {
      const existingIndex = state.data.findIndex(
        (entry) => entry.name == action.payload.name
      );

      if (existingIndex < 0) {
        // If the portfolio doesn't exist, create a new state object with the new data
        return {
          ...state,
          data: [...state.data, action.payload],
        };
      } else {
        // If the portfolio exists, update it by creating a new data array
        const updatedData = state.data.map((entry, index) => {
          if (index == existingIndex) {
            return action.payload;
          }
          return entry;
        });

        return {
          ...state,
          data: updatedData,
        };
      }
    },
    removePortfolioChart(state, action) {
      const portfolioName = action.payload.portfolio;
      const index = state.data.findIndex(
        (entity) => entity.name == portfolioName
      );

      if (index >= 0) {
        // Create a new data array without the removed entry
        const updatedData = [
          ...state.data.slice(0, index),
          ...state.data.slice(index + 1),
        ];

        // Create a new state object with the updated data array
        return {
          ...state,
          data: updatedData,
        };
      }

      // If the portfolio doesn't exist, return the original state
      return state;
    },
  },

  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.portfolioChart,
      };
    },
  },
});

export const { addPortfolioChart, removePortfolioChart } =
  PortfolioChartSlice.actions;

export const getPortfolioCharts = (state: AppState) =>
  state.portfolioChart.data;

export default PortfolioChartSlice.reducer;
