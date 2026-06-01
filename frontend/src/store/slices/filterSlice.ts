import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type FilterState = {
  status: string;
};

const initialState: FilterState = {
  status: "all",
};

const filterSlice = createSlice({
  name: "filter",

  initialState,

  reducers: {
    setStatus: (state, action: PayloadAction<string>) => {
      state.status = action.payload;
    },
  },
});

export const { setStatus } = filterSlice.actions;

export default filterSlice.reducer;
