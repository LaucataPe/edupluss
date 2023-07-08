import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { getEmpresaActivities, setEmpresa } from "../redux/features/activitiesSlice";
import Activities from "../components/Activities";
import { Empresa } from "../utils/demodb";
import { useAppDispatch } from "../hooks/typedSelectors";
import { RootState } from "../redux/store";

function Home() {
    const dispatch = useDispatch()
    const Mydispatch = useAppDispatch()
    const [error, setError] = useState<string>('')
    const [ready, setReady ] = useState<boolean>(false)

    const empresaId = useSelector((state: RootState) => state.activities.selectEmpresa.id)
    
    useEffect(() => {
      const currentEmpresa = window.localStorage.getItem("empresa");
      const fetchEmpresas = async () =>{
        try {
          const empresas = await axios('http://localhost:3001/empresas')
          const findEmpresa = empresas.data.find((empresa: Empresa) => empresa.name === currentEmpresa)
          dispatch(setEmpresa(findEmpresa))
          setReady(true)
          
        } catch (error: any) {
          setError(error.message)
        }
      }
      fetchEmpresas()
    }, [])

    useEffect(() => {
      if(ready){
        Mydispatch(getEmpresaActivities(empresaId));
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