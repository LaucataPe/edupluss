import { configureStore } from "@reduxjs/toolkit";
import activitiesSlice from "./features/activitiesSlice";
import stepsSlice from "./features/stepsSlider";
import AreasSlice from "./features/areaSlice";
import UserSlice from "./features/userSlice";
import userStepsSlice from "./features/userStepsSlice";
import RoleSlice from "./features/roleSlice";
import utilsSlice from "./features/utilsSlice";
import testGradesSlice from "./features/testGradesSlice";


export const store = configureStore({
  reducer: {
    activities: activitiesSlice,
    steps: stepsSlice,
    areas: AreasSlice,
    roles: RoleSlice,
    userSteps: userStepsSlice,
    user: UserSlice,
    utils:utilsSlice,
    testGrades: testGradesSlice

  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
