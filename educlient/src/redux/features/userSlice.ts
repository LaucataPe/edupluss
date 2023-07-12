import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { User } from "../../utils/interfaces";

interface initState {
	logUser: User
	status: string
}

const initialState:initState = {
    logUser: {
        id: 1,
        username: '',
        email: '',
        password: '',
        companyId: 0,
		tipo:'admin'
    },
    status: 'idle'
};


const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setLogUser: (state, action: PayloadAction<User>) =>{
			state.logUser = action.payload;
			state.status = 'idle'
		},
	}
});

export const {
	setLogUser,
} = userSlice.actions;
export default userSlice.reducer;
export const allUsers = (state: RootState) => state.steps;