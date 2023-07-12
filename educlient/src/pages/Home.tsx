import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Activities from "../components/Activities";
import { useAppDispatch } from "../hooks/typedSelectors";
import { RootState } from "../redux/store";
import {getUserAreas } from "../redux/features/areaSlice";
import LeftMenu from "../components/LeftMenu";
import { getActivitiesByArea } from "../redux/features/activitiesSlice";

function Home() {
    const Mydispatch = useAppDispatch()

    const [ready, setReady ] = useState<boolean>(false)

    const areas = useSelector((state: RootState) => state.areas.areas)

    useEffect(() => {
      if(areas.length === 0){
        Mydispatch(getUserAreas(2));
        setReady(true)
      }
      
      if(ready && areas.length > 0){
        const firstArea = areas[0].id 
        if(firstArea){
          Mydispatch(getActivitiesByArea(firstArea))
        }
      }
    }, [ready]);

    return (
      <>
      
      <h1 className="text-3xl font-semibold text-center p-10">¿Qué quieres aprender hoy?</h1>
      <LeftMenu />
      <Activities />
      </>
    );
  }
  
  export default Home;