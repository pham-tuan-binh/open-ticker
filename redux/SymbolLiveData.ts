"use client";

import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "./Store";
import { HYDRATE } from "next-redux-wrapper";

interface SymbolLiveData {
  name: string;
  latestPrice: number;
  dailyPrice: number;
}

interface SymbolLiveDataList {
  data: Array<SymbolLiveData>;
}
// Initial state
const initialState: SymbolLiveDataList = {
  data: [],
};

// Actual Slice
export const SymbolLiveSlice = createSlice({
  name: "symbolLiveData",
  initialState,
  reducers: {
    updateSymbolLiveData(state, action) {
      const { name, latestPrice } = action.payload;
      const index = state.data.findIndex((entry) => entry.name == name);

      if (index >= 0) {
        // Create a new data array with the updated entry
        const updatedData = state.data.map((entry, currentIndex) => {
          if (currentIndex == index) {
            // Create a new entry with the updated latestPrice
            return {
              ...entry,
              latestPrice,
            };
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
    updateSymbolDailyData(state, action) {
      const { name, dailyPrice } = action.payload;
      const index = state.data.findIndex((entry) => entry.name == name);

      if (index >= 0) {
        // Create a new data array with the updated entry
        const updatedData = state.data.map((entry, currentIndex) => {
          if (currentIndex == index) {
            // Create a new entry with the updated dailyPrice
            return {
              ...entry,
              dailyPrice,
              latestPrice: dailyPrice, // Update the latestPrice as well
            };
          }
          return entry;
        });

        // Create a new state object with the updated data array
        return {
          ...state,
          data: updatedData,
        };
      } else {
        // If the symbol chart doesn't exist, create a new state object with the new data appended
        return {
          ...state,
          data: [
            ...state.data,
            {
              name,
              latestPrice: dailyPrice,
              dailyPrice,
            },
          ],
        };
      }
    },
  },

  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.symbolLiveData,
      };
    },
  },
});

export const { updateSymbolLiveData, updateSymbolDailyData } =
  SymbolLiveSlice.actions;

export const getSymbolLiveData = (state: AppState) => state.symbolLiveData.data;

export default SymbolLiveSlice.reducer;
