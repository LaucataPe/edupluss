import { useSelector} from "react-redux";
import { Link } from "react-router-dom";
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
                {act.active ? <button>Desactivar</button> : <button>Activar</button>}
              </li>
            </Link>
          ))}  
        </ol>
      </div>
      
      <Link to='/addActivity'><button className="py-2 px-4 flex justify-center items-center rounded-full 
      font-semibold bg-blue-500 text-white hover:bg-blue-600 transition-all text-2xl
       dark:focus:ring-offset-gray-800">+</button></Link>
      </>
    );
  }
  
  export default AdminActivities;