import { configureStore } from '@reduxjs/toolkit';
import candidatesReducer from './candidatesSlice';
import indicatorsReducer from './indicatorsSlice';
import actionsReducer from './actionsSlice';
import entriesReducer from './entriesSlice';

const store = configureStore({
  reducer: {
    candidates: candidatesReducer,
    indicators: indicatorsReducer,
    actions: actionsReducer,
    entries: entriesReducer,
  },
});

export default store;
