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

export interface SymbolChartEntry {
  name: string;
  chart: Array<OHLCTEntry>;
}

interface SymbolChartList {
  data: Array<SymbolChartEntry>;
}

// Initial state
const initialState: SymbolChartList = {
  data: [],
};

// Actual Slice
export const SymbolChartSlice = createSlice({
  name: "symbolChart",
  initialState,
  reducers: {
    addSymbolChart(state, action) {
      if (action.payload.chart.length == 0) {
        console.log("sdns");
        return state;
      }

      const existingEntry = state.data.find(
        (entry) => entry.name == action.payload.name
      );

      if (!existingEntry) {
        // If the symbol chart doesn't exist, create a new state object with the new data appended
        return {
          ...state,
          data: [...state.data, action.payload],
        };
      }

      // If the symbol chart already exists, return the original state without any changes
      return state;
    },
    updateSymbolChart(state, action) {
      const symbolName = action.payload.name;
      const index = state.data.findIndex((entry) => entry.name == symbolName);

      if (index >= 0) {
        // Create a new data array with the updated entry
        const updatedData = state.data.map((entry, currentIndex) => {
          if (currentIndex == index) {
            return action.payload;
          }
          return entry;
        });

        // Create a new state object with the updated data array
        return {
          ...state,
          data: updatedData,
        };
      }

      // If the symbol chart doesn't exist, return the original state
      return state;
    },
  },

  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.symbolChart,
      };
    },
  },
});

export const { addSymbolChart, updateSymbolChart } = SymbolChartSlice.actions;

export const getSymbolCharts = (state: AppState) => state.symbolChart.data;

export default SymbolChartSlice.reducer;
