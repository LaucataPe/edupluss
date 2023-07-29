import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";
import { Area } from "../../utils/interfaces";

interface initState {
	areas: Array<Area>
	currentArea: Area
	status: string
}

const initialState:initState = {
	areas: [],
	currentArea: {
		id: 0,
		name: '',
		companyId: 0,
	},
	status: 'idle'
};

///
export const fetchCompanyAreas = createAsyncThunk('areas/fetchCompanyAreas', async (id: number) => {
	try {
		const {data} = await axios(`https://edupluss.onrender.com/areas/${id}`);
		const active = data.filter((area: Area) => area.active === true)
		return active;
	} catch (error: any) {
		throw new Error(error.message);
	}
}) 

export const getUserAreas = createAsyncThunk('areas/getUserAreas', async (id: number) => {
	try {
		const {data} = await axios(`https://edupluss.onrender.com/user/areas/${id}`);
		return data;
	} catch (error: any) {
		throw new Error(error.message);
	}
}) 


const areasSlice = createSlice({
	name: "areas",
	initialState,
	reducers: {
		resetAreas: (state) =>{
			state.areas = [];
			state.status = 'idle'
		}, 
		setCurrentArea: (state, action: PayloadAction<Area>) => {
			state.currentArea = action.payload;
		}
	},
	extraReducers: (builder) => {
		builder.addCase(fetchCompanyAreas.pending, (state) => {
			state.status = 'loading';
		});
		builder.addCase(fetchCompanyAreas.fulfilled, (state, action: PayloadAction<Area[]>) => {
			state.status = 'success';
			state.areas = action.payload;
		});
		builder.addCase(fetchCompanyAreas.rejected, (state) => {
			state.status = 'rejected';
		});
		builder.addCase(getUserAreas.pending, (state) => {
			state.status = 'loading';
		});
		builder.addCase(getUserAreas.fulfilled, (state, action: PayloadAction<Area[]>) => {
			state.status = 'success';
			state.areas = action.payload;
		});
		builder.addCase(getUserAreas.rejected, (state) => {
			state.status = 'rejected';
		});
	},
});

export const {
	resetAreas,
	setCurrentArea
} = areasSlice.actions;
export default areasSlice.reducer;
export const allAreas = (state: RootState) =>	state.areas;
