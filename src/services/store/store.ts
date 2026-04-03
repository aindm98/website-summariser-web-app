import { configureStore } from "@reduxjs/toolkit";
import SummaryReducer from "../slices/SummarySlice";
import { useDispatch } from "react-redux";

export const store = configureStore({
  reducer: {
    summary: SummaryReducer,
  },
});

export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
export type RootState = ReturnType<typeof store.getState>