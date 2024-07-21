import { createSlice } from '@reduxjs/toolkit';

const candidatesSlice = createSlice({
  name: 'candidates',
  initialState: {
    candidates: [],
  },
  reducers: {
    setCandidates: (state, action) => {
      state.candidates = action.payload;
    },
  },
});

export const { setCandidates } = candidatesSlice.actions;
export default candidatesSlice.reducer;
