import {useState} from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { useParams, Link } from 'react-router-dom'
import { Activity } from '../../utils/interfaces'
import { RootState } from '../../redux/store'

function AddActivity() {
    const {id} = useParams()
    const areas = useSelector((state: RootState) => state.areas.areas)
    const currentArea = areas.find((area) => area.id === Number(id))

    const [activity, setActivity] = useState<Activity>({
      title: '',
      companyId: currentArea?.companyId ?? 0,
      areaId: currentArea?.id ?? 0    
    })
    const [error, setError] = useState()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      if(activity.companyId !== 0 && activity.areaId !== 0){
        try {
          const response = await axios.post('http://localhost:3001/activity', activity)
          if(response){
            alert('La actividad fue creada con éxito')
          }
          setActivity({
            title: '',
            companyId: 0,
            areaId: 0  
          })
        } catch (error: any) {
          setError(error)
        }
      }else{
        return alert('No se encontró el área relacionada a esta actividad')
      }
    }

    return (
      <>
      <h1>Nueva Actividad</h1>
      <form onSubmit={(e) => handleSubmit(e)}>
        <label>Nombre:</label>
        <input type="text" placeholder='Ingrese el nombre de la actividad' value={activity.title}
        onChange={(e) => setActivity({...activity, title: e.target.value})}/> <br />
        <label>Área</label>
        <input type="text" name="area" value={currentArea?.name} disabled/>
        <button type='submit'>Crear Actividad</button>
      </form>
      <Link to={`/admin`}><button>Atrás</button></Link>
      <p>{error}</p>
      </>
    );
  }
  
  export default AddActivity;