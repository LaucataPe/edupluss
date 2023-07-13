import { useSelector} from "react-redux";
import { RootState } from "../redux/store";
import { Link} from "react-router-dom";


function Activities() {
    const activities = useSelector((state: RootState) => state.activities.activities)

    const activeActivities = activities.filter((act) => act.active === true)

    return (
      <>
      <div className="container mx-auto px-20" key={1}>
          {activeActivities?.map((act) => (
            <Link to={`/activity/${act.id}`}>  
                <div key={act.id} className="flex flex-col my-5 bg-white border shadow-sm rounded-xl 
                p-4 text-lg md:p-5 dark:bg-gray-800 dark:border-gray-700 dark:shadow-slate-700/[.7]
                 dark:text-gray-400 hover:bg-slate-100">
                  {act.title}
                </div>
            </Link>
          ))}  
      </div>
      
      </>
    );
  }
  
  export default Activities;