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
      <Link to='/addActivity'><button>+</button></Link>
      </>
    );
  }
  
  export default MyActivities;