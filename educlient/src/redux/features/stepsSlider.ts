import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";
import { Step } from "../../utils/demodb";

interface initState {
	steps: Array<Step>
	status: string
}

const initialState:initState = {
    steps: [],
    status: 'idle'
};

///
export const getStepsActivity = createAsyncThunk('steps/getStepsActivity', async (id: number) => {
	try {
		const { data } = await axios(`http://localhost:3001/steps/${id}`);
		return data;
	} catch (error: any) {
		throw new Error(error.message);
	}
}) ;

const stepsSlice = createSlice({
	name: "steps",
	initialState,
	reducers: {
		resetSteps: (state) =>{
			state.steps = [];
			state.status = 'idle'
		},
	},
	extraReducers: (builder) => {
		builder.addCase(getStepsActivity.pending, (state, action) => {
			state.status = 'loading';
		});
		builder.addCase(getStepsActivity.fulfilled, (state, action: PayloadAction<Step[]>) => {
			state.status = 'success';
			state.steps = action.payload;
		});
		builder.addCase(getStepsActivity.rejected, (state, action) => {
			state.status = 'rejected';
		});
	},
});

export const {
	resetSteps,
} = stepsSlice.actions;
export default stepsSlice.reducer;
export const allActivities = (state: RootState) =>	state.steps;