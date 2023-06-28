import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";
import { Activity, Empresa } from "../../utils/demodb";

interface initSate {
	activities: Array<Activity>
	originalCopy: Array<Activity>
	selectEmpresa: Empresa
}

const initialState:initSate = {
	activities: [],
	originalCopy: [],
    selectEmpresa: {
		id: 0,
		name: '',
		nit: 0
	}
};

///
export const getAllActivities = async () => {
	try {
		const { data } = await axios(`http://localhost:3001/activities`);
		return data;
	} catch (error: any) {
		throw new Error(error.message);
	}
};

export const getEmpresaActivities = async (id: number) => {
	try {
		const { data } = await axios(`http://localhost:3001/activities/${id}`);
		return data;
	} catch (error: any) {
		throw new Error(error.message);
	}
};

const activitiesSlice = createSlice({
	name: "products",
	initialState,
	reducers: {
		getSearchedProducts: (state, action) => {
			state.activities = action.payload;
		},
		getProducts: (state, action) => {
			state.activities = action.payload;
			state.originalCopy = action.payload;
		},
		setEmpresa: (state, action: PayloadAction<Empresa>) =>{
			state.selectEmpresa = action.payload;
		}
	},
	/* extraReducers: (builder) => {
		builder.addCase(getAllProducts.fulfilled, (state, action) => {
			state.products = action.payload;
			state.originalCopy = action.payload;
		});
		builder.addCase(getAllProducts.rejected, (state, action) => {
			state.products = [];
			console.log(action);
		});
	}, */
});

export const {
	getProducts,
	getSearchedProducts,
	setEmpresa
} = activitiesSlice.actions;
export default activitiesSlice.reducer;
export const selectSearchedProducts = (state: RootState) =>	state.activities;
