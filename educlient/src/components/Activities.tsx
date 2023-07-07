import { useSelector} from "react-redux";
import { RootState } from "../redux/store";
import { Link, useLocation } from "react-router-dom";


function Activities() {
    const activities = useSelector((state: RootState) => state.activities.activities)

    return (
      <>
      {/*Mapea todas las actividades*/}
      <div>
        <ol>
          {activities?.map((act) => (
            <Link to={`/activity/${act.id}`}>  
              <li key={act.id}>
                <h3>{act.title}</h3>
              </li>
            </Link>
          ))}  
        </ol>
       
      </div>
      
      </>
    );
  }
  
  export default Activities;