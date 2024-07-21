import { createSlice } from '@reduxjs/toolkit';

const entriesSlice = createSlice({
  name: 'entries',
  initialState: {
    entries: [],
  },
  reducers: {
    addEntry: (state, action) => {
      state.entries.push(action.payload);
    },
    // Adding deleteEntry reducer
    deleteEntry: (state, action) => {
      state.entries = state.entries.filter((_, index) => index !== action.payload);
    },

    //reset entrySlice
    resetEntries(state) {
      state.entries = [];
      // Reset other state properties as needed
    },
  },
});

export const { addEntry, deleteEntry , resetEntries } = entriesSlice.actions;
export default entriesSlice.reducer;