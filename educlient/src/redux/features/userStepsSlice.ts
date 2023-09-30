import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";
import { UserStep } from "../../utils/interfaces";

interface initState {
  userSteps: Array<UserStep>;
  status: string;
}

const initialState: initState = {
  userSteps: [],
  status: "idle",
};

export const createUserStep = createAsyncThunk(
  "userSteps/createUserStep",
  async (userData: UserStep) => {
    // userData es un objeto que contiene los datos del formulario
    try {
      const { data } = await axios.post(
        "http://localhost:3001/userSteps",
        userData
      );

      return data;
    } catch (error: any) {
      console.warn("Aún no existe la ruta 'http://localhost:3001/userSteps'");
      throw new Error(error.message);
    }
  }
);
export const fetchUserSteps = createAsyncThunk(
  "userSteps/fetchUserSteps",
  async () => {
    try {
      const response = await axios.get("http://localhost:3001/userSteps");
      return response.data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
);

const userStepsSlice = createSlice({
  name: "userSteps",
  initialState,
  reducers: {
    resetUserSteps: (state) => {
      state.userSteps = [];
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createUserStep.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(
      createUserStep.fulfilled,
      (state, action: PayloadAction<UserStep>) => {
        state.status = "success";
        // Puedes hacer algo con la respuesta si es necesario, como agregarla a la lista de userSteps
        state.userSteps.push(action.payload);
      }
    );
    builder.addCase(createUserStep.rejected, (state) => {
      state.status = "rejected";
    });

    builder.addCase(fetchUserSteps.pending, (state) => {
      state.status = "loading";
    });

    builder.addCase(
      fetchUserSteps.fulfilled,
      (state, action: PayloadAction<UserStep[]>) => {
        state.status = "success";
        state.userSteps = action.payload;
      }
    );

    builder.addCase(fetchUserSteps.rejected, (state) => {
      state.status = "rejected";
    });
  },
});

export const { resetUserSteps } = userStepsSlice.actions;
export default userStepsSlice.reducer;
export const allUserSteps = (state: RootState) => state.userSteps;
