import { PayloadAction, createSlice } from "@reduxjs/toolkit";
interface initState {
    activityEditedModal:Boolean;
    activityCreatedModal:Boolean
    }
  
  const initialState: initState = {
    activityEditedModal: false,
    activityCreatedModal:false
    };

    const utilsSlice = createSlice({
name:"utils",
initialState,
reducers:{
    handleActivityEditedModal:(state,action: PayloadAction<Boolean>)=>{
        state.activityEditedModal = action.payload
    },
    handleActivityCreatedModal:(state,action: PayloadAction<Boolean>)=>{
        state.activityCreatedModal = action.payload
    }
}
}
    )

    export const {handleActivityEditedModal,handleActivityCreatedModal} = utilsSlice.actions
    export default utilsSlice.reducer