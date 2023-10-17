import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";
import { TestGrade } from "../../utils/interfaces";

interface initState {
	testGrades: Array<TestGrade>
	originalCopy: Array<TestGrade>
	status: string
}

const initialState:initState = {
	testGrades: [],
	originalCopy: [],
	status: 'idle'
};

///
export const getGradePercentageByCompany = createAsyncThunk('testGrades/getGradePercentageByCompany', async (id: number) => {
	try {
		const { data } = await axios(`http://localhost:3001/tests/company/${id}`);
		return data;
	} catch (error: any) {
		throw new Error(error.message);
	}
}) ;

export const getGradesOfAllEmployeesByActivity = createAsyncThunk('testGrades/getGradesOfAllEmployeesByActivity', async (adminId, activityId) => {
	try {
		const { data } = await axios(`http://localhost:3001/tests/activity/${adminId}/${activityId}`);
		return data
	} catch (error: any) {
		throw new Error(error.message);
	}
}) ;

export const getAllTestGradesByUser = createAsyncThunk('testGrades/getAllTestGradesByUser', async (adminId, employeeId) => {
	try {
		const { data } = await axios(`http://localhost:3001/tests/${adminId}/${employeeId}`);
		return data
	} catch (error: any) {
		throw new Error(error.message);
	}
}) ;

const testGradesSlice = createSlice({
	name: "testGrades",
	initialState,
	reducers: {
		resetTestGrades: (state) =>{
			state.testGrades = [];
			state.originalCopy = [];
			state.status = 'idle'
		},
	},
	extraReducers: (builder) => {
		builder.addCase(getGradePercentageByCompany.pending, (state) => {
			state.status = 'loading';
		});
		builder.addCase(getGradePercentageByCompany.fulfilled, (state, action: PayloadAction<TestGrade[]>) => {
			state.status = 'success';
			state.testGrades = action.payload;
			state.originalCopy = action.payload;
		});
		builder.addCase(getGradePercentageByCompany.rejected, (state) => {
			state.status = 'rejected';
		});
		builder.addCase(getGradesOfAllEmployeesByActivity.pending, (state) => {
			state.status = 'loading';
		});
		builder.addCase(getGradesOfAllEmployeesByActivity.fulfilled, (state, action: PayloadAction<TestGrade[]>) => {
			state.status = 'success';
			state.testGrades = action.payload;
		});
		builder.addCase(getGradesOfAllEmployeesByActivity.rejected, (state) => {
			state.status = 'rejected';
		});
		builder.addCase(getAllTestGradesByUser.pending, (state) => {
			state.status = 'loading';
		});
		builder.addCase(getAllTestGradesByUser.fulfilled, (state, action: PayloadAction<TestGrade[]>) => {
			state.status = 'success';
			state.testGrades = action.payload;
		});
		builder.addCase(getAllTestGradesByUser.rejected, (state) => {
			state.status = 'rejected';
		});
	},
});

export const {
	resetTestGrades,
} = testGradesSlice.actions;
export default testGradesSlice.reducer;
export const allTestGrades = (state: RootState) =>	state.testGrades;