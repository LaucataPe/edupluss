import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import LeftMenu from "../LeftMenu";
import { RootState } from "../../redux/store";
import { useAppDispatch } from "../../hooks/typedSelectors";
import { fetchCompanyAreas } from "../../redux/features/areaSlice";
import { getActivitiesByArea } from "../../redux/features/activitiesSlice";
import AdminActivities from "./AdminActivities";


function Admin() {
    const dispatch = useAppDispatch()
    const areas = useSelector((state: RootState) => state.areas.areas)

    const [ready, setReady] = useState<boolean>(false)

    useEffect(() => {
      if(areas.length === 0){
        dispatch(fetchCompanyAreas(1));
        setReady(true)
      }
    }, []);

    useEffect(() => {
      if(ready && areas.length > 0){
        const firstArea = areas[0].id 
        if(firstArea){
          dispatch(getActivitiesByArea(firstArea))
        }
      }
    }, [ready])

    return (
      <>
      <LeftMenu />
      <AdminActivities />
      </>
    );
  }
  
  export default Admin;