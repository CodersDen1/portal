import { createSlice } from '@reduxjs/toolkit';

const indicatorsSlice = createSlice({
  name: 'indicators',
  initialState: {
    indicators: [],
    selectedStudent: {},
  },
  reducers: {
    setIndicators: (state, action) => {
      state.indicators = action.payload;
    },
    updateIndicatorStatus: (state, action) => {
      const { id, status } = action.payload;
      const indicator = state.indicators.find((ind) => ind.id === id);
      if (indicator) {
        indicator.status = status;
      }
    },
    setSelectedStudent: (state, action) => {
      state.selectedStudent = action.payload;
    },
  },
});

export const { setIndicators, updateIndicatorStatus, setSelectedStudent } = indicatorsSlice.actions;
export default indicatorsSlice.reducer;
