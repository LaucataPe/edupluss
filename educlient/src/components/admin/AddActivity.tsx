import {useState, useEffect} from 'react'
import axios from 'axios'
import { Activity, Empresa } from '../../utils/demodb'

function AddActivity() {
    const [activity, setActivity] = useState<Activity>({
      title: '',
      empresaId: 0     
    })
    const [empresas, setEmpresas] = useState<Array<Empresa>>()
    const [error, setError] = useState()

    useEffect(() => {
      const fetchEmpresas = async () =>{
        try {
          const empresas = await axios('http://localhost:3001/empresas')
          setEmpresas(empresas.data);
          
        } catch (error: any) {
          setError(error)
        }
      }
      fetchEmpresas()
    }, [])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      try {
        const response = await axios.post('http://localhost:3001/activity', activity)
        if(response){
          alert('La actividad fue creada con éxito')
        }
        setActivity({
          title: '',
          empresaId: 0  
        })
      } catch (error: any) {
        setError(error)
      }
    }

    return (
      <>
      <form onSubmit={(e) => handleSubmit(e)}>
        <label>Nombre:</label>
        <input type="text" placeholder='Ingrese el nombre de la actividad' value={activity.title}
        onChange={(e) => setActivity({...activity, title: e.target.value})}/> <br />
        <label>Seleccionar Empresa</label>
        <select name="empresaId"  onChange={(e) => setActivity({...activity, empresaId: Number(e.target.value)})}>
            {empresas ? empresas.map((empresa) => {
              return (<option key={empresa.id} value={empresa.id}>{empresa.name}</option>)
            }): <option value="nothing">No hay empresas</option>}
        </select>
        <button type='submit'>Crear Actividad</button>
      </form>
      <p>{error}</p>
      </>
    );
  }
  
  export default AddActivity;