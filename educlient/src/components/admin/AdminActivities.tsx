import { useSelector} from "react-redux";
import { Link, useParams, useNavigate } from "react-router-dom";
import { RootState } from "../../redux/store";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAppDispatch } from "../../hooks/typedSelectors";
import { getActivitiesByRole } from "../../redux/features/activitiesSlice";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

function AdminActivities() {
    const {roleId} = useParams()
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const activities = useSelector((state: RootState) => state.activities.activities)

    const [displayConfirmation, setDisplayConfirmation] = useState(false);
    const [actId, setActId] = useState(0);

    useEffect(() => {
      if(activities.length === 0 && roleId){
        dispatch(getActivitiesByRole(Number(roleId)))
      }
    }, [roleId])

    const dialogHandler = (id: number) => {
      setDisplayConfirmation(true)
      setActId(id)
    }

    const handleDelete = async () =>{
      try {
          let response = await axios.delete(`https://api.colkrea.com/activity/${actId}`);
          let data = response.data;
          if(data){
            dispatch(getActivitiesByRole(Number(roleId)))
              setDisplayConfirmation(false)
          } 
       } catch (error: any) {
        console.log(error);          
       }
    }

    const confirmationDialogFooter = (
      <>
          <Button type="button" label="No" icon="pi pi-times" onClick={() => setDisplayConfirmation(false)} text />
          <Button type="button" label="Sí" icon="pi pi-check" onClick={handleDelete} text autoFocus />
      </>
    );

    const handleState = async (id: number = 1, roleId: number) => {
      try {
        const {data} = await axios.put(`https://api.colkrea.com/activity/state?id=${id}`)
        dispatch(getActivitiesByRole(roleId))
        return data 
      } catch (error) {
        console.log(error);
      }
    }

    return (
      <>
      {/*Mapea todas las actividades*/}
      <div className="card p-fluid my-3 h-[720px] overflow-auto">
          <h3 className="text-blue-500 text-bold">Actividades:</h3>
          {activities?.map((act) => (
               
            <div key={act.id} className="py-1 px-2 border rounded m-3 flex items-center hover:bg-slate-100">

            <div className="col-12">
                <div className="flex flex-column md:flex-row align-items-center w-full">
                    <div className="flex-1 flex flex-column md:text-left">
                        <div className="font-bold text-2xl">{act.title}</div>   
                    </div>
                    <div className="car-buttons">
                        <Button icon="pi pi-arrow-right" rounded outlined severity="info" className="mx-2"
                          onClick={() => navigate(`/actvitySteps/${act.id}`)}/>
                        <Button icon="pi pi-pencil" rounded outlined severity="success" className="mx-2"
                          onClick={() => navigate(`/editActivity/${roleId}/${act.id}`)}/>
                        <Button icon="pi pi-times" rounded outlined severity="danger" className="mx-2"
                          onClick={() => dialogHandler(act.id ?? 0)}/>
                    </div>
                    <div className="mx-2">
                    {act.active ? <Button label="Desactivar" severity="danger" outlined 
                      onClick={()=>handleState(act.id, act.roleId)} />
                      : <Button label="Activar" severity="success" outlined 
                      onClick={()=>handleState(act.id, act.roleId)} />}
                    </div>
                </div>
            </div>        

                <Dialog header="Eliminar Actividad" visible={displayConfirmation} onHide={() => setDisplayConfirmation(false)} style={{ width: '350px' }} modal footer={confirmationDialogFooter}>
                  <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    <span>¿Estás seguro de eliminar esta <strong>actividad y sus pasos</strong>?</span>
                  </div>
                </Dialog>
                
              </div>
               
          ))} 
          {activities.length === 0 ? <h3>No hay actividades para este cargo</h3> : ''} 
      </div>

      
      
      <Link to={`/addActivity/${roleId}`}><button className="py-2 px-4 flex absolute bottom-5 right-5
      justify-center items-center rounded-full 
      font-semibold bg-blue-500 text-white hover:bg-blue-600 transition-all text-xl
       dark:focus:ring-offset-gray-800">+ Crear Actividad</button></Link>
      </>
    );
  }
  
  export default AdminActivities;