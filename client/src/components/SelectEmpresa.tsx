import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Empresa } from "../utils/demodb";
import { useDispatch } from "react-redux/es/exports";
import { setEmpresa } from "../redux/features/activitiesSlice";


function SelectEmpresa() {
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [idEmpresa, setIdEmpresa] = useState<string>('')
  const [error, setError] = useState<string>('')
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchEmpresas = async () =>{
      try {
        const empresas = await axios('http://localhost:3001/empresas')
        setEmpresas(empresas.data);
        
      } catch (error: any) {
        setError(error.message)
      }
    }
    fetchEmpresas()
  }, [])

  const handleSelect = () => {
    const findEmpresa = empresas.find((empresa) => empresa.id === Number(idEmpresa))
    if(findEmpresa){
      dispatch(setEmpresa(findEmpresa))
      window.localStorage.setItem("empresa", findEmpresa.name)
    } 
    
  }

    return (
      <>
      <div>
        <label>Selecciona una empresa</label><br />
        <select name="empresa" value={idEmpresa} onChange={(e) => setIdEmpresa(e.target.value)}>
          <option>Seleccione la empresa</option>
          {empresas?.map((empresa) => (
            <option key={empresa.id} value={empresa.id}>{empresa.nit} - {empresa.name}</option>
          ))}
        </select>
        <Link to='/'><button disabled={idEmpresa.length === 0 ? true : false} onClick={handleSelect}>Ingresar</button></Link> 
        <p>{error ? error : ''}</p>
      </div>
      </> 
    );
  }
  
export default SelectEmpresa;