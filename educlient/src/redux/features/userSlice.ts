import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
//import { User } from "../../utils/interfaces";
import axios from "axios";
import { Demo } from "../../utils/types/demo";

interface initState {
	users: Array<Demo.User>
	logUser: Demo.User
	status: string
}

const initialState:initState = {
	users: [],
    logUser: {
        id: 0,
        username: '',
        email: '',
        password: '',
        companyId: 0,
		tipo: '',
		roleId: 0,
		active: false
    },
    status: 'idle'
};

//
export const fetchUsers = createAsyncThunk('user/fetchUsers', async () => {
	try {
		const { data } = await axios(`http://38.242.216.20/users`);
		return data
	} catch (error: any) {
		throw new Error(error.message);
	}
} ) 

export const getUsersByCompany = createAsyncThunk('user/getUsersByCompany', async (id: number) => {
	try {
		const { data } = await axios(`http://38.242.216.20/users/${id}`);
		return data
	} catch (error: any) {
		throw new Error(error.message);
	}
} ) 


const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setLogUser: (state, action: PayloadAction<Demo.User>) =>{
			state.logUser = action.payload;
			state.status = 'idle'
		},
	},
	extraReducers: (builder) => {
		builder.addCase(fetchUsers.pending, (state) => {
			state.status = 'loading';
		});
		builder.addCase(fetchUsers.fulfilled, (state, action: PayloadAction<Demo.User[]>) => {
			state.status = 'success';
			const filtUsers = action.payload.filter((user) => user.id !== state.logUser.id)
			state.users = filtUsers;
		});
		builder.addCase(fetchUsers.rejected, (state) => {
			state.status = 'rejected';
		});
		builder.addCase(getUsersByCompany.pending, (state) => {
			state.status = 'loading';
		});
		builder.addCase(getUsersByCompany.fulfilled, (state, action: PayloadAction<Demo.User[]>) => {
			state.status = 'success';
			const filtUsers = action.payload.filter((user) => user.id !== state.logUser.id)
			state.users = filtUsers;
		});
		builder.addCase(getUsersByCompany.rejected, (state) => {
			state.status = 'rejected';
		});
	},
});

export const {
	setLogUser,
} = userSlice.actions;
export default userSlice.reducer;
export const allUsers = (state: RootState) => state.user;