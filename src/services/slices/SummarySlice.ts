import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../lib/axios";
import type { PayloadAction } from "@reduxjs/toolkit";

interface ArticleState {
  data: string | null;
  loading: boolean;
  error: string | null;
  urlError: string | null;
}

interface FetchSummaryPayload {
  articleUrl: string;
}

export const fetchSummary = createAsyncThunk<
  string,
  FetchSummaryPayload,
  { rejectValue: string }
>("summary/fetchSummary", async ({ articleUrl }, {rejectWithValue}) => {
  console.log("articleUrl:", articleUrl);

  try {
    const response = await axiosInstance.get("/summarize", {
      params: {
        url: articleUrl,
        lang: import.meta.env.VITE_SUMMARIZER_LANG,
        engine: import.meta.env.VITE_SUMMARIZER_ENGINE,
      },
    });
    const data = response.data.summary;
    return data;
  } catch (error: unknown) {
    console.error("Error fetching summary:", error);
    return rejectWithValue("Something went wrong" );
  }
});

const initialState: ArticleState = {
  data: null,
  loading: false,
  error: null,
  urlError: null,
};

const SummarySlice = createSlice({
  name: "summary",
  initialState,
  reducers: {
    clearSummary: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchSummary.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.data = action.payload;
        },
      )
      .addCase(fetchSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error occurred";
      });
  },
});

export const { clearSummary } = SummarySlice.actions;
export default SummarySlice.reducer;
