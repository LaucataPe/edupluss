import { configureStore } from "@reduxjs/toolkit";
import activitiesSlice from "./features/activitiesSlice";

export const store = configureStore({
    reducer:{
        activities: activitiesSlice
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch