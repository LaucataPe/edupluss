import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { getEmpresaActivities, setEmpresa } from "../redux/features/activitiesSlice";
import Activities from "../components/Activities";
import { Empresa } from "../utils/demodb";
import { useAppDispatch } from "../hooks/typedSelectors";
import { RootState } from "../redux/store";
import { fetchCompanyAreas } from "../redux/features/areaSlice";

function Home() {
    const Mydispatch = useAppDispatch()
    const [error, setError] = useState<string>('')
    const [ready, setReady ] = useState<boolean>(false)

    const areas = useSelector((state: RootState) => state.areas.areas)

    useEffect(() => {
      if(areas.length === 0){
        Mydispatch(fetchCompanyAreas(1));
      }
    }, [ready]);

    return (
      <>
      
      <h1 className="text-3xl font-semibold text-center p-10">¿Qué quieres aprender hoy?</h1>
      <Activities />
      <p className="text-red-500 font-semibold">{error}</p>
      </>
    );
  }
  
  export default Home;