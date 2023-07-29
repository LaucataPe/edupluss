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

    useEffect(() => {
      if(activities.length === 0 && roleId){
        dispatch(getActivitiesByRole(Number(roleId)))
      }
    }, [roleId])

    const confirmationDialogFooter = (
      <>
          <Button type="button" label="No" icon="pi pi-times" onClick={() => setDisplayConfirmation(false)} text />
          <Button type="button" label="Sí" icon="pi pi-check" onClick={() => setDisplayConfirmation(false)} text autoFocus />
      </>
    );

    const handleState = async (id: number = 1, roleId: number) => {
      try {
        const {data} = await axios.put(`https://edupluss.onrender.com/activity/state?id=${id}`)
        dispatch(getActivitiesByRole(roleId))
        return data 
      } catch (error) {
        console.log(error);
      }
    }

    return (
      <>
      {/*Mapea todas las actividades*/}
      <div className="card p-fluid my-2">
          {activities?.map((act) => (
               
            <div key={act.id} className="py-4 px-3 border rounded m-3 flex items-center">
                <div className="flex w-[80%] gap-2 cursor-pointer hover:bg-slate-300" onClick={() => navigate(`/actvitySteps/${act.id}`)}>
                <p className=" text-black m-0 text-xl">{act.title}</p>
                </div>

                <div className="flex w-[20%] gap-2">
                  {act.active ? <Button label="Desactivar" severity="danger" outlined 
                  onClick={()=>handleState(act.id, act.roleId)} />
                  : <Button label="Activar" severity="success" outlined 
                  onClick={()=>handleState(act.id, act.roleId)} />}
                  <Button icon="pi pi-pencil" rounded outlined severity="success" className="w-3"
                    onClick={() => navigate(`/editActivity/${roleId}/${act.id}`)}/>
                  <Button icon="pi pi-times" rounded outlined severity="danger" className="w-3"
                  onClick={() => setDisplayConfirmation(true)}/>
                </div>

                <Dialog header="Confirmación" visible={displayConfirmation} onHide={() => setDisplayConfirmation(false)} style={{ width: '350px' }} modal footer={confirmationDialogFooter}>
                  <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    <span>¿Estás seguro de eliminar esta actividad?</span>
                  </div>
                </Dialog>
                
              </div>
               
          ))}  
      </div>
      
      <Link to={`/addActivity/${roleId}`}><button className="py-2 px-4 flex absolute bottom-10 right-10
      justify-center items-center rounded-full 
      font-semibold bg-blue-500 text-white hover:bg-blue-600 transition-all text-xl
       dark:focus:ring-offset-gray-800">+ Añadir Actividad</button></Link>
      </>
    );
  }
  
  export default AdminActivities;