import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";
import { Activity, Empresa } from "../../utils/interfaces";

interface initState {
	activities: Array<Activity>
	originalCopy: Array<Activity>
	selectEmpresa: Empresa
	status: string
}

const initialState:initState = {
	activities: [],
	originalCopy: [],
    selectEmpresa: {
		id: 0,
		name: '',
		nit: 0,
		active: false
	},
	status: 'idle'
};

///
export const fetchActivities = createAsyncThunk('activities/fetchActivities', async () => {
	try {
		const { data } = await axios(`http://localhost:3001/activities`);
		return data
	} catch (error: any) {
		throw new Error(error.message);
	}
} ) 

export const getEmpresaActivities = createAsyncThunk('activities/getEmpresaActivities', async (id: number) => {
	try {
		const { data } = await axios(`http://localhost:3001/activities/${id}`);
		return data;
	} catch (error: any) {
		throw new Error(error.message);
	}
}) ;

export const getActivitiesByRole = createAsyncThunk('activities/getActivitiesByRole', async (id: number) => {
	try {
		const { data } = await axios(`http://localhost:3001/activities/role/${id}`);
		return data
	} catch (error: any) {
		throw new Error(error.message);
	}
}) ;

const activitiesSlice = createSlice({
	name: "activities",
	initialState,
	reducers: {
		resetActivities: (state) =>{
			state.activities = [];
			state.originalCopy = [];
			state.status = 'idle'
		},
		setEmpresa: (state, action: PayloadAction<Empresa>) =>{
			state.selectEmpresa = action.payload;
		},
		setActivity: (state, action) => {
			const updatedActivity = action.payload;
			const index = state.activities.findIndex((activity) => activity.id === updatedActivity.id);
		
			if (index !== -1) {
				state.activities[index] = updatedActivity;
			}
		},
	},
	extraReducers: (builder) => {
		builder.addCase(fetchActivities.pending, (state) => {
			state.status = 'loading';
		});
		builder.addCase(fetchActivities.fulfilled, (state, action: PayloadAction<Activity[]>) => {
			state.status = 'success';
			state.activities = action.payload;
			state.originalCopy = action.payload;
		});
		builder.addCase(fetchActivities.rejected, (state) => {
			state.status = 'rejected';
		});
		builder.addCase(getEmpresaActivities.pending, (state) => {
			state.status = 'loading';
		});
		builder.addCase(getEmpresaActivities.fulfilled, (state, action: PayloadAction<Activity[]>) => {
			state.status = 'success';
			state.activities = action.payload;
			state.originalCopy = action.payload;
		});
		builder.addCase(getEmpresaActivities.rejected, (state) => {
			state.status = 'rejected';
		});
		builder.addCase(getActivitiesByRole.pending, (state) => {
			state.status = 'loading';
		});
		builder.addCase(getActivitiesByRole.fulfilled, (state, action: PayloadAction<Activity[]>) => {
			state.status = 'success';
			state.activities = action.payload;
		});
		builder.addCase(getActivitiesByRole.rejected, (state) => {
			state.status = 'rejected';
		});
	},
});

export const {
	resetActivities,
	setEmpresa,
	setActivity
} = activitiesSlice.actions;
export default activitiesSlice.reducer;
export const allActivities = (state: RootState) =>	state.activities;
