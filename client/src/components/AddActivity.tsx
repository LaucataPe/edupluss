import {useState} from 'react'
import axios from 'axios'

function AddActivity() {
    const [activity, setActivity] = useState()

    const handleSubmit = () => {
      try {
        const response = axios.post('', activity)
      } catch (error) {
        
      }
    }

    return (
      <>
      <form action="">
        <label>Nombre:</label>
        <input type="text" placeholder='Ingrese el nombre de la actividad' />
        <label>Seleccionar Empresa</label>
        <select name="empresaId">
            <option value="map"></option>
        </select>
      </form>
      </>
    );
  }
  
  export default AddActivity;