import {useState, useEffect} from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Activity } from '../../utils/interfaces'
import { RootState } from '../../redux/store'
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { getCompanyRoles, setCurrentRole } from '../../redux/features/roleSlice'
import { useAppDispatch } from '../../hooks/typedSelectors'
import { getActivitiesByRole } from '../../redux/features/activitiesSlice'

function AddActivity() {
  const {roleId, actId} = useParams()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const roles = useSelector((state: RootState) => state.roles.roles)
  const activities = useSelector((state: RootState) => state.activities.activities)
  const currentRole = useSelector((state: RootState) => state.roles.currentRole)
  const logUser = useSelector((state: RootState) => state.user.logUser)

    const [activity, setActivity] = useState<Activity>({
      title: '',
      roleId: currentRole.id ?? 0
    })
    const [error, setError] = useState()

    useEffect(() => {
        if(roles.length === 0){
          dispatch(getCompanyRoles(logUser.companyId))
        }
        const findRole = roles.find((role) => role.id === Number(roleId))
        if(currentRole.id === 0 && findRole?.id){  
          dispatch(setCurrentRole(findRole))
          if(!actId){
            setActivity({...activity, roleId: findRole.id})
          }
        }
    }, [roles, logUser])

    useEffect(() => {
      if(actId){
        if(activities.length === 0 && roleId){
          dispatch(getActivitiesByRole(Number(roleId)))
        }
        const findActivity = activities.find((act) => act.id === Number(actId))
        if(findActivity){
          setActivity({title: findActivity.title, roleId: findActivity.roleId})
        }
      }
    }, [actId, roles])


    const handleSubmit = async () => {
      if(activity.roleId !== 0){
        try {
          const response = await axios.post('https://edupluss.onrender.com/activity', activity)
          if(response){
            alert('La actividad fue creada con éxito')
            dispatch(getActivitiesByRole(Number(roleId)))
            navigate(`/activities/${roleId}`)
          }
          setActivity({
            title: '',
            roleId: 0
          })
        } catch (error: any) {
          setError(error)
        }
      }else{
        return alert('No se encontró el cargo relacionado a esta actividad')
      }
    }

    const handleEdit = async () => {
      if(activity.roleId !== 0){
        const data = { id: Number(actId), title: activity.title}
        try {
          const response = await axios.put('https://edupluss.onrender.com/activity/update', data)
          if(response){
            alert('La actividad fue editada con éxito')
            dispatch(getActivitiesByRole(Number(roleId)))
            navigate(`/activities/${roleId}`)
          }
          setActivity({
            title: '',
            roleId: 0
          })
        } catch (error: any) {
          setError(error)
        }
      }else{
        return alert('No se encontró el cargo relacionado a esta actividad')
      }
    }

    return (
      <>
        <Link to={`/activities/${roleId}`}><Button icon="pi pi-angle-double-left" label="Atrás" className="m-2" rounded severity="secondary" /></Link>
        <div className="card p-fluid my-3 mx-[10%]">
          {actId ? <h5>Editando Actividad</h5> : <h5>Creando Actividad</h5>}
          <div className="field">
            <label>Nombre</label>
            <InputText type="text" value={activity.title}
              onChange={(e) => setActivity({...activity, title: e.target.value})}/>
          </div>
          <div className="field">
            <label>Cargo</label>
            <InputText type="text" value={currentRole?.name} disabled/>
          </div>
          <Button label={actId ? 'Editar' : 'Crear Actividad'} onClick={actId ? handleEdit : handleSubmit} 
          disabled={(activity.title.length > 0 && activity.roleId !== 0) ? false : true}/>
        </div>
        <p className='text-red-500 font-semibold'>{error}</p>
      </>
    );
  }
  
  export default AddActivity;