import { configureStore } from "@reduxjs/toolkit";
import activitiesSlice from "./features/activitiesSlice";
import stepsSlice from "./features/stepsSlider"

export const store = configureStore({
    reducer:{
        activities: activitiesSlice,
        steps: stepsSlice
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch