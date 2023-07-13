import { useSelector} from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../../redux/store";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAppDispatch } from "../../hooks/typedSelectors";
import { getActivitiesByArea } from "../../redux/features/activitiesSlice";

function AdminActivities() {
    const dispatch = useAppDispatch()
    const activities = useSelector((state: RootState) => state.activities.activities)
    const currentArea = useSelector((state: RootState) => state.areas.currentArea)

    const [areaId, setAreaId] = useState<number>(0);

  useEffect(() => {
    if (currentArea && currentArea.id !== undefined) {
      setAreaId(currentArea.id);
    }
  }, [currentArea]);

    const handleState = async (id: number = 1, areaId: number) => {
      try {
        const {data} = await axios.put(`http://localhost:3001/activity/state?id=${id}`)
        dispatch(getActivitiesByArea(areaId))
        return data 
      } catch (error) {
        console.log(error);
      }
    }

    return (
      <>
      {/*Mapea todas las actividades*/}
      <div className="w-[90%] relative mx-10">
          {activities?.map((act) => (
            <Link to={`/actvitySteps/${act.id}`}>  
              <div key={act.id} className="flex items-center my-5 relative bg-white border shadow-sm rounded-xl 
                p-4 text-lg md:p-5 dark:bg-gray-800 dark:border-gray-700 dark:shadow-slate-700/[.7]
                 dark:text-gray-400 hover:bg-slate-100">
                <p className="pr-10">{act.title}</p>
                {act.active ? <button onClick={()=>handleState(act.id, act.areaId)} 
                className="absolute right-5 p-1 bg-red-500 rounded text-white hover:bg-red-600">Desactivar</button> 
                : <button onClick={()=>handleState(act.id, act.areaId)}
                className="absolute right-5 p-1 bg-green-500 rounded text-white hover:bg-green-600">Activar</button>}
              </div>
            </Link>
          ))}  
      </div>
      
      <Link to={`/addActivity/${areaId}`}><button className="py-2 px-4 flex absolute bottom-10 right-10
      justify-center items-center rounded-full 
      font-semibold bg-blue-500 text-white hover:bg-blue-600 transition-all text-xl
       dark:focus:ring-offset-gray-800">+ Añadir Actividad</button></Link>
      </>
    );
  }
  
  export default AdminActivities;