import { useSelector} from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { RootState } from "../../redux/store";


function AdminActivities() {
    const activities = useSelector((state: RootState) => state.activities.activities)

    return (
      <>
      {/*Mapea todas las actividades*/}
      <div>
        <ol>
          {activities?.map((act) => (
            <Link to={`/actvitySteps/${act.id}`}>  
              <li key={act.id}>
                <h3>{act.title}</h3>
                <h3>{act.empresaId}</h3>
                {act.active ? <button>Desactivar</button> : <button>Activar</button>}
              </li>
            </Link>
          ))}  
        </ol>
       
      </div>
      
      </>
    );
  }
  
  export default AdminActivities;