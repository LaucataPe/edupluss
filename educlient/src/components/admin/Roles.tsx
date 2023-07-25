import { useSelector} from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../../redux/store";
import { useAppDispatch } from "../../hooks/typedSelectors";
import { getActivitiesByRole } from "../../redux/features/activitiesSlice";
import { FaUser } from "react-icons/fa";

function Roles() {
    const dispatch = useAppDispatch()
    const roles = useSelector((state: RootState) => state.roles.roles)
    const currentArea = useSelector((state: RootState) => state.areas.currentArea)

    return (
      <>
      {/*Mapea todos los roles*/}
      <div className="w-[90%] relative mx-10">
        <h3 className="text-center my-2 text-indigo-500">{currentArea.name}</h3>
          {roles.map((role) => (
            <Link to={'/activities'}>
                <div key={role.id} onClick={() => dispatch(getActivitiesByRole(role.id ?? 0))}
                className="bg-white m-5 p-5 w-3 flex items-center">
                    <FaUser className="text-6xl"/>
                    <p className="text-xl ml-3">{role.name}</p>
                </div>
            </Link> 
          ))}
          {roles.length === 0 ? <p className="text-2xl text-blue-500 m-10"
          >Aún no hay cargos en esta área </p>: ''}
      </div>

      <Link to={`/addRole`}><button className="py-2 px-4 flex absolute bottom-10 right-10
      justify-center items-center rounded-full 
      font-semibold bg-blue-500 text-white hover:bg-blue-600 transition-all text-xl
       dark:focus:ring-offset-gray-800">+ Añadir Cargo</button></Link>
      
      </>
    );
  }
  
  export default Roles;