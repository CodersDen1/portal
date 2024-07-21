import { createSlice } from '@reduxjs/toolkit';

const actionsSlice = createSlice({
  name: 'actions',
  initialState: {
    actions: [],
  },
  reducers: {
    setActions: (state, action) => {
      state.actions = action.payload;
    },
    updateActionSelection: (state, action) => {
      const { id, selected } = action.payload;
      const actionItem = state.actions.find((act) => act.id === id);
      if (actionItem) {
        actionItem.selected = selected;
      }
    },
  },
});

export const { setActions, updateActionSelection } = actionsSlice.actions;
export default actionsSlice.reducer;
