import {useState} from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { Area } from '../../utils/interfaces'
import { RootState } from '../../redux/store'

function AddArea() {
    const currentEmpresa = useSelector((state: RootState) => state.activities.selectEmpresa)

    const [area, setArea] = useState<Area>({
      name: '',
      companyId: currentEmpresa.id     
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
          companyId: currentEmpresa.id 
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
        <input type="text" placeholder='Ingrese el nombre del área' value={area.name}
        onChange={(e) => setArea({...area, name: e.target.value})}/> <br />
        <label>Empresa:</label>
        <input type="text" disabled={true} value={currentEmpresa.name} />
        <button type='submit' disabled={Object.keys(error).length === 0 ? false : true}>Crear Área</button>
      </form>
      </>
    );
  }
  
  export default AddArea;