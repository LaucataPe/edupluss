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
      <div>
        <ol>
          {activities?.map((act) => (
            <Link to={`/actvitySteps/${act.id}`}>  
              <li key={act.id}>
                <h3>{act.title}</h3>
                {act.active ? <button onClick={()=>handleState(act.id, act.areaId)}>Desactivar</button> 
                : <button onClick={()=>handleState(act.id, act.areaId)}>Activar</button>}
              </li>
            </Link>
          ))}  
        </ol>
      </div>
      
      <Link to={`/addActivity/${areaId}`}><button className="py-2 px-4 flex justify-center items-center rounded-full 
      font-semibold bg-blue-500 text-white hover:bg-blue-600 transition-all text-2xl
       dark:focus:ring-offset-gray-800">+</button></Link>
      </>
    );
  }
  
  export default AdminActivities;