import AdminActivities from "../components/admin/AdminActivities";
import { useAppDispatch } from "../hooks/typedSelectors";
import { fetchActivities } from "../redux/features/activitiesSlice";
import { useEffect } from 'react'
import { Link } from "react-router-dom";

function MyActivities() {
    const dispatch = useAppDispatch()

    useEffect(() => {
          dispatch(fetchActivities());
      }, [dispatch]);
    return (
      <>
      <h1>Mis Actividades</h1>    
      <AdminActivities/>
      <Link to='/addActivity'><button className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-full border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800">+</button></Link>
      </>
    );
  }
  
  export default MyActivities;