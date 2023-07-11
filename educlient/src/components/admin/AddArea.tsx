import {useState, useEffect} from 'react'
import axios from 'axios'
import { Area } from '../../utils/demodb'

function AddActivity() {
    const [area, setArea] = useState<Area>({
      name: '',
      companyId: 0     
    })
    const [error, setError] = useState({})



    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      try {
        const response = await axios.post('http://localhost:3001/area', area)
        if(response){
          alert('La actividad fue creada con éxito')
        }
        setArea({
          name: '',
          companyId: 0  
        })
      } catch (error: any) {
        setError({error})
      }
    }

    return (
      <>
      <h1>Nueva Área</h1>
      <form onSubmit={(e) => handleSubmit(e)}>
        <label>Nombre:</label>
        <input type="text" placeholder='Ingrese el nombre de la actividad' value={area.name}
        onChange={(e) => setArea({...area, name: e.target.value})}/> <br />
        <label>Empresa:</label>
        <input type="text" disabled={true} value={area.name} />
        <button type='submit' disabled={Object.keys(error).length === 0 ? false : true}>Crear Actividad</button>
      </form>
      </>
    );
  }
  
  export default AddActivity;