import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";
import { Role } from "../../utils/interfaces";

interface initState {
	roles: Array<Role>
	status: string
}

const initialState:initState = {
	roles: [],
	status: 'idle'
};

///
export const getRolesByArea = createAsyncThunk('areas/getRolesByArea', async (areaId: number) => {
	try {
		const {data} = await axios(`http://localhost:3001/roles/${areaId}`);
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
		})
	},
});

export const {
	resetRoles,
} = roleSlice.actions;
export default roleSlice.reducer;
export const allRoles = (state: RootState) => state.roles;
