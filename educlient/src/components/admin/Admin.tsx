import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
//import LeftMenu from "../LeftMenu";
import { RootState } from "../../redux/store";
import { useAppDispatch } from "../../hooks/typedSelectors";
import { fetchCompanyAreas } from "../../redux/features/areaSlice";
//import AdminActivities from "./AdminActivities";
//import { useLocation } from "react-router-dom";
import AppMenu from "../SideMenu";
import { getRolesByArea } from "../../redux/features/roleSlice";
import Roles from "./Roles";


function Admin() {
    //const {pathname} = useLocation()
    const dispatch = useAppDispatch()
    const areas = useSelector((state: RootState) => state.areas.areas)
    const currentEmpresa = useSelector((state: RootState) => state.activities.selectEmpresa)

    const [ready, setReady] = useState<boolean>(false)

    useEffect(() => {
      if(currentEmpresa.id){
        dispatch(fetchCompanyAreas(currentEmpresa.id));
        setReady(true)
      }
    }, [currentEmpresa]);

    useEffect(() => {
      if(ready && areas.length > 0){
        const firstArea = areas[0].id 
        if(firstArea){
          dispatch(getRolesByArea(firstArea))
        }
      }
    }, [ready, areas])

    return (
      <>
      <div className="flex">
        {/* <LeftMenu /> */}
        <AppMenu/>
        <Roles/>
      </div>
      </>
    );
  }
  
  export default Admin;