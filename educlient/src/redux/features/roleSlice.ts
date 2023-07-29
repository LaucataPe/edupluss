import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";
import { Role } from "../../utils/interfaces";

interface initState {
	roles: Array<Role>
	currentRole: Role
	status: string
}

const initialState:initState = {
	roles: [],
	currentRole: {
		id: 0,
		name: '', 
		hardSkills: []
	},
	status: 'idle'
};

///
export const getRolesByArea = createAsyncThunk('roles/getRolesByArea', async (areaId: number) => {
	try {
		const {data} = await axios(`https://edupluss.onrender.com/roles/${areaId}`);
        return data
	} catch (error: any) {
		throw new Error(error.message);
	}
}) 

export const getCompanyRoles = createAsyncThunk('roles/getCompanyRoles', async (companyId: number) => {
	try {
		const {data} = await axios(`https://edupluss.onrender.com/company/roles/${companyId}`);
		console.log(data);
		
        return data
	} catch (error: any) {
		throw new Error(error.message);
	}
}) 

const roleSlice = createSlice({
	name: "roles",
	initialState,
	reducers: {
		resetRoles: (state) =>{
			state.roles = [];
			state.status = 'idle'
		},
		setCurrentRole: (state, action) => {
			state.currentRole = action.payload
		}
	},
	extraReducers: (builder) => {
		builder.addCase(getRolesByArea.pending, (state) => {
			state.status = 'loading';
		});
		builder.addCase(getRolesByArea.fulfilled, (state, action: PayloadAction<Role[]>) => {
			state.status = 'success';
			state.roles = action.payload;
		});
		builder.addCase(getRolesByArea.rejected, (state) => {
			state.status = 'rejected';
		});
		builder.addCase(getCompanyRoles.pending, (state) => {
			state.status = 'loading';
		});
		builder.addCase(getCompanyRoles.fulfilled, (state, action: PayloadAction<Role[]>) => {
			state.status = 'success';
			state.roles = action.payload;
		});
		builder.addCase(getCompanyRoles.rejected, (state) => {
			state.status = 'rejected';
		})
	},
});

export const {
	resetRoles,
	setCurrentRole
} = roleSlice.actions;
export default roleSlice.reducer;
export const allRoles = (state: RootState) => state.roles;
