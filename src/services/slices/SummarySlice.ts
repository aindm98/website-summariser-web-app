// // features/articleSlice.ts

// import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
// import { axiosInstance } from "../services/api";
// import { ArticleState, FetchSummaryPayload } from "./articleTypes";

// // Async thunk
// export const fetchSummary = createAsyncThunk<
//   string, // return type
//   FetchSummaryPayload, // argument type
//   { rejectValue: string } // error type
// >(
//   "article/fetchSummary",
//   async ({ articleUrl, prompt }, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.post("chat/completions", {
//         model: "gemini-1.5-flash",
//         messages: [
//           {
//             role: "user",
//             content: prompt
//               ? `${prompt}\n${articleUrl}`
//               : articleUrl,
//           },
//         ],
//       });

//       const text =
//         response.data?.choices?.[0]?.message?.content || "";

//       return text;
//     } catch (error: any) {
//       return rejectWithValue(
//         error.response?.data || "Something went wrong"
//       );
//     }
//   }
// );

// // Initial state
// const initialState: ArticleState = {
//   data: null,
//   loading: false,
//   error: null,
// };

// // Slice
// const articleSlice = createSlice({
//   name: "article",
//   initialState,
//   reducers: {
//     clearSummary: (state) => {
//       state.data = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchSummary.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(
//         fetchSummary.fulfilled,
//         (state, action: PayloadAction<string>) => {
//           state.loading = false;
//           state.data = action.payload;
//         }
//       )
//       .addCase(fetchSummary.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || "Error occurred";
//       });
//   },
// });

// export const { clearSummary } = articleSlice.actions;
// export default articleSlice.reducer;// features/articleSlice.ts

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../lib/axios";
import type { PayloadAction } from "@reduxjs/toolkit";

interface ArticleState {
  data: string | null;
  loading: boolean;
  error: string | null;
}

interface FetchSummaryPayload {
  articleUrl: string;
}

export const fetchSummary = createAsyncThunk<string, FetchSummaryPayload,  { rejectValue: string } >(
  "summary/fetchSummary",
  async ({ articleUrl }, { rejectWithValue }) => {
    console.log("articleUrl:", articleUrl);
    
    try {
      const response = await axiosInstance.post("chat/completions", {
         model: import.meta.env.VITE_GEMINI_MODEL_NAME,
        messages: [
          {
            role: "user",
           content: `Summarize the content from this URL: ${articleUrl}`,
          },
        ],
      });

      const text =
        response.data?.choices?.[0]?.message?.content || "";

      return text;
    } catch (error : unknown) {
      return rejectWithValue(
        (error as { response?: { data?: string } }).response?.data || "Something went wrong"
      );
    }
  }
);


const initialState: ArticleState = {
  data: null,
  loading: false,
  error: null,
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
        }
      )
      .addCase(fetchSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error occurred";
      });
  },
});

export const { clearSummary } = SummarySlice.actions;
export default SummarySlice.reducer; 