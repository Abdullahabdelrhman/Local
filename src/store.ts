// src/store.js أو src/store.ts (لو بتستخدم TypeScript)

import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './slices/counterSlice.ts'; // تأكد من مسار ملف slice الخاص بك

const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});

export default store;
