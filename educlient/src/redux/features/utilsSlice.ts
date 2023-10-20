import { PayloadAction, createSlice } from "@reduxjs/toolkit";
interface initState {
    activityEditedModal:boolean;
    activityCreatedModal:boolean;
    handleSideBar:boolean
    }
  
  const initialState: initState = {
    activityEditedModal: false,
    activityCreatedModal:false,
    handleSideBar:true,
    };

    const utilsSlice = createSlice({
name:"utils",
initialState,
reducers:{
    handleActivityEditedModal:(state,action: PayloadAction<boolean>)=>{
        state.activityEditedModal = action.payload
    },
    handleActivityCreatedModal:(state,action: PayloadAction<boolean>)=>{
        state.activityCreatedModal = action.payload
    },
    handleSideBar:(state,action:PayloadAction<boolean>)=>{
        state.handleSideBar = action.payload
    }
}
}
    )

    export const {handleActivityEditedModal,handleActivityCreatedModal,handleSideBar} = utilsSlice.actions
    export default utilsSlice.reducer