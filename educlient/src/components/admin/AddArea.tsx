import {useState, useEffect} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { Area } from '../../utils/interfaces'
import { RootState } from '../../redux/store'
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { useAppDispatch } from '../../hooks/typedSelectors'
import { fetchCompanyAreas, setCurrentArea } from '../../redux/features/areaSlice'

function AddArea() {
    const {areaId} =  useParams()
    const navigate = useNavigate()

    const dispatch = useAppDispatch()

    const currentEmpresa = useSelector((state: RootState) => state.activities.selectEmpresa)
    const areas = useSelector((state: RootState) => state.areas.areas)

    const [area, setArea] = useState<Area>({
      name: '',
      companyId: currentEmpresa.id     
    })
    const [error, setError] = useState()
    const [modalDelete, setModalDelete] = useState(false);

    useEffect(() => {
      if(areaId){
        if(areas.length === 0){
          dispatch(fetchCompanyAreas(currentEmpresa.id))
        }
        const findArea = areas.find((area) => area.id === Number(areaId))
        if(findArea?.id){  
          dispatch(setCurrentArea(findArea))
          setArea({...area, name: findArea.name})
        }
      }
    }, [areas, areaId])

    const handleSubmit = async () => {
      try {
        const response = await axios.post('https://edupluss.onrender.com/area', area)
        if(response){
          alert('El área fue creada con éxito')
          dispatch(fetchCompanyAreas(currentEmpresa.id))
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

    const handleEdit = async () => {
      try {
        const data = { id: Number(areaId), name: area.name}
        const response = await axios.put('https://edupluss.onrender.com/area/update', data)
        if(response){
          alert('El área fue editada con éxito')
          dispatch(fetchCompanyAreas(currentEmpresa.id))
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

    const handleDelete = async () => {
      console.log('Llegué');
      
      setModalDelete(false)
      try {
        const response = await axios.delete(`https://edupluss.onrender.com/area/${areaId}`)
        if(response){
          alert('El área fue eliminada')
          dispatch(fetchCompanyAreas(currentEmpresa.id))
          navigate('/admin')
        }
        setArea({
          name: '',
          companyId: currentEmpresa.id 
        })
      } catch (error: any) {
        console.log(error);        
        setError(error)
      }
    }

    const confirmationDialogFooter = (
      <>
          <Button type="button" label="No" icon="pi pi-times" onClick={() => setModalDelete(false)} text />
          <Button type="button" label="Sí" icon="pi pi-check" onClick={handleDelete} text autoFocus />
      </>
    );

    return (
      <>
      <div className="card p-fluid my-3 mx-[10%]">
        {areaId ? <h5>Editando Área</h5> : <h5>Creando Área</h5>}
        <div className="field">
          <label>Nombre</label>
          <InputText type="text" value={area.name}
            onChange={(e) => setArea({...area, name: e.target.value})}/>
        </div>
        <div className="field">
          <label>Empresa</label>
          <InputText type="text" value={currentEmpresa.name} disabled/>
        </div>
        <Button label={areaId ? 'Editar' : 'Crear Área'} onClick={areaId ? handleEdit : handleSubmit} 
        disabled={area.name.length > 0 ? false : true}/>
        {areaId ? <Button label='Eliminar Área' outlined severity="danger" className='my-3' 
        onClick={() => setModalDelete(true)}/> : ''}
      </div>
      <p className='text-red-500 font-semibold'>{error}</p>

      <Dialog header="Eliminar" visible={modalDelete} onHide={() => setModalDelete(false)} style={{ width: '350px' }} modal footer={confirmationDialogFooter}>
        <div className="flex align-items-center justify-content-center">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
          <span>¿Estás seguro de eliminar esta <strong>área, sus roles y actividades</strong>?</span>
        </div>
      </Dialog>
      </>
    );
  }
  
  export default AddArea;