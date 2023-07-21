import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Activities from "../components/Activities";
import { useAppDispatch } from "../hooks/typedSelectors";
import { RootState } from "../redux/store";
import {getUserAreas } from "../redux/features/areaSlice";
import { getActivitiesByArea } from "../redux/features/activitiesSlice";
import AppMenu from "../components/SideMenu";

function Home() {
    const Mydispatch = useAppDispatch()

    const [ready, setReady ] = useState<boolean>(false)

    const areas = useSelector((state: RootState) => state.areas.areas)
    const logUser = useSelector((state: RootState) => state.user.logUser)

    useEffect(() => {
      if(areas.length === 0 && logUser.id !== undefined){
        Mydispatch(getUserAreas(logUser.id));
        setReady(true)
      }
      
      if(ready && areas.length > 0){
        const firstArea = areas[0].id 
        if(firstArea){
          Mydispatch(getActivitiesByArea(firstArea))
        }
      }
    }, [ready, logUser]);

    return (
      <>
       <div className="flex">
        <AppMenu />
        <div className="w-[100%]">
          <h2 className="text-3xl font-semibold text-center p-5">Hola {logUser.username}</h2>
          <h1 className="text-3xl font-semibold text-center">¿Qué quieres aprender hoy?</h1>
          <Activities />
        </div>
      </div>
      
      </>
    );
  }
  
  export default Home;