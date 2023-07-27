import {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { Area } from '../../utils/interfaces'
import { RootState } from '../../redux/store'
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

function AddArea() {
    const navigate = useNavigate()

    const currentEmpresa = useSelector((state: RootState) => state.activities.selectEmpresa)

    const [area, setArea] = useState<Area>({
      name: '',
      companyId: currentEmpresa.id     
    })
    const [error, setError] = useState()

    const handleSubmit = async () => {
      try {
        const response = await axios.post('http://localhost:3001/area', area)
        if(response){
          alert('El área fue creada con éxito')
          navigate('/admin')
        }
        setArea({
          name: '',
          companyId: currentEmpresa.id 
        })
      } catch (error: any) {
        setError(error)
      }
    }

    return (
      <>
      <div className="card p-fluid my-3 mx-[10%]">
        <h5>Creando Área</h5>
        <div className="field">
          <label>Nombre</label>
          <InputText type="text" value={area.name}
            onChange={(e) => setArea({...area, name: e.target.value})}/>
        </div>
        <div className="field">
          <label>Empresa</label>
          <InputText type="text" value={currentEmpresa.name} disabled/>
        </div>
        <Button label='Crear Área' onClick={handleSubmit} 
        disabled={area.name.length > 0 ? false : true}/>
      </div>
      <p className='text-red-500 font-semibold'>{error}</p>
      </>
    );
  }
  
  export default AddArea;